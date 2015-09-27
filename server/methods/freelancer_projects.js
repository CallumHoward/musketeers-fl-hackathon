Meteor.methods({
  createNewProject: function(email, data) {
    check(data, {
      title: String,
      description: String,
      currency: {id: Number},     // 1 for USD, 3 for AUD
      budget: {minimum: Number},  // 15
      jobs: [{id: Number}]
    });

    // Create Freelancer Project
    Freelancer.Projects.create(data, Meteor.bindEnvironment(function(err, res) {
      if (err) throw new Meteor.Error(400, err);
      res = JSON.parse(res);
      console.log(res);
      var projectId = res.result.id;

      // Wait 2 minutes
      var twoMinutes = 120000;
      Meteor.setTimeout(function() {
        // Get all bids on the project
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
            Freelancer.Bids.performAction(
              bestBids[i].id,
              {action: 'award'},
              Meteor.bindEnvironment(logErrorCallback)
            );
          }

          // Wait 1 hr
          var oneHour = 3600000;
          Meteor.setTimeout(function() {

          }, oneHour);
        }));
      }, twoMinutes);
    }));
  },
  // createNewProject(data, createNewProjectCallBack);
});

function createNewProject(data, callBack) {
  Freelancer.Projects.create(data, Meteor.bindEnvironment(callBack));
}

//call get bids after 30 minutes
function createNewProjectCallBack(err, res) {
  if (err) throw new Meteor.Error(400, err);

  var projectId = res.result.id;
  var budget = res.budget.minimum - 5; //budget min profit

  Meteor.setTimeout(function() {
    getBids(projectId, {}, getBidsCallBack);
  }, 1800000);
}

function getBids(projectId, data, callBack) {
  Freelancer.Projects.getBids(projectId, data, Meteor.bindEnvironment(callBack));
}

function getBidsCallBack(err, res) {
  if (err) throw new Meteor.Error(400, err);

  var bids = res.result.bids; //array of bid objects
  var bestBid = _.filter(bids, function(item) {
    return item.amount <= budget;
  })[0]; //get best bidder

  var bestBidId = bestBid.id; //id of the best bid
  performBid(bestBidId, {award : "award"}, performBidCallBack);
}

//award the bid
function performBid(bidId, data, callBack) {
  Freelancer.Bids.performBid(bidId, data, Meteor.bindEnvironment(callBack));
}

function performBidCallBack(err, res) {
  if (err) throw new Meteor.Error(400, err);
}


//data required are bidder_id, amount, project_id, description)
function createMilestones(data, callBack) {
  Freelancer.Milestones.create(data, callBack, Meteor.bindEnvironment(callBack));
}

function createMilestonesCallBack(err, res) {
  if (err) throw new Meteor.Error(400, err);

}

//data required are action : "release" and amount : money
function doActionMilestones(milestoneId, data, callBack) {
  Freelancer.Milestones.doAction(milestoneId, data, Meteor.bindEnvironment(callBack));
}

function doActionMilestones(err, res) {
  if (err) throw new Meteor.Error(400, err);
}
