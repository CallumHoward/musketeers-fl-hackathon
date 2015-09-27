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
      var projectId = res.result.id;
      console.log(res);

      // Wait 2 minutes
      var twoMinutes = 120000;
      Meteor.setTimeout(function() {
        // Get all bids on the project
        Freelancer.Projects.getBids(projectId, {}, Meteor.bindEnvironment(function(err, res) {
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

});
