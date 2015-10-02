Meteor.methods({
  createNewProject: function(email, data) {
    check(data, {
      title: String,
      description: String,
    });

    data.budget = {minimum: 15};
    data.currency = {id: 1};
    data.jobs = [{id:21}, {id: 156}, {id: 375}, {id: 662}];
    data.title = 'Short copy needs to be written very quickly!';

    var docId = ProjectRequests.insert({
      email: email,
      title: data.title,
      description: data.description,
      submission: null,
      submissionPath: null,
      submitted: false
    });

    // Create Freelancer Project
    console.log('Creating Freelancer project...');
    Freelancer.Projects.create(data, Meteor.bindEnvironment(function(err, res) {
      if (err) throw new Meteor.Error(400, err);
      res = JSON.parse(res);
      console.log(res);
      var projectId = res.result.id;

      // Put to DB
      ProjectRequests.update(docId, {$set: {projectId: projectId}});

      // Wait 2 minutes
      var twoMinutes = 120000;
      Meteor.setTimeout(function() {
        // Get all bids on the project
        console.log('Getting Freelancer project bids...');
        Freelancer.Projects.getBids(projectId, {}, Meteor.bindEnvironment(function(err, res) {
          if (err) throw new Meteor.Error(400, err);
          res = JSON.parse(res);
          console.log(res);
          // Award upto the best 3 bids that are in our budget and set Milestone
          var bids = res.result.bids;
          var bestBids = _.filter(bids, function(item) {
            return item.amount <= budget;
          });
          var limit = (bestBids.length < 3) ? bestBids.length : 3;
          var logErrorCallback = function(err) {if (err) console.log(err);};
          for (var i = 0; i < limit; i++) {
            console.log('Awarding top bids...');
            Freelancer.Bids.performAction(
              bestBids[i].id,
              {action: 'award'},
              Meteor.bindEnvironment(logErrorCallback)
            );
          }

          // Wait 5 mins
          var fiveMin = 300000;
          Meteor.setTimeout(function() {
            // Get all bids
            console.log('Retrieving bid status...');
            Freelancer.Bids.get({
              'bids[]': _.map(bestBids, function(item) {
                  return item.id;
              })
            },
            Meteor.bindEnvironment(function(err , res) {
              if (err) throw new Meteor.Error(400, err);
              res = JSON.parse(res);

              // Check first accepted
              var firstAcceptedBid = _.filter(res.result.bids, function(item) {
                return item.award_status === 'accepted';
              })[0];

              var bidderId = firstAcceptedBid.bidder_id;
              var bidId = firstAcceptedBid.id;
              // Create milestone for the accepted
              console.log('Creating Freelancer project milestone for accepted bid...');
              Freelancer.Milestones.create({
                bidder_id: bidderId,
                amount: 15,
                project_id: projectId,
                description: "Project completed, submit to this URL: " + createSubmissionUrl(projectId, firstAcceptedBid.id)
              }, Meteor.bindEnvironment(function(err, res) {
                if (err) throw new Meteor.Error(400, err);
              }));
            }));
          }, fiveMin);
        }));
      }, twoMinutes);
    }));
  }
});

function createSubmissionUrl(projectId, bidId) {
  ProjectRequests.update({projectId: projectId}, {$set: {
    submissionPath: projectId + '/' + bidId
  }});
  return Meteor.absoluteUrl('submissions/' + projectId + '/' + bidId);
}
