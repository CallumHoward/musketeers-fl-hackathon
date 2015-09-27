Meteor.methods({
  createNewProject: function(email, data) {
    check(data, {
      title: String,
      description: String,
      currency: {id: Number},
      budget: {minimum: Number},
      jobs: [{id: Number}]
    });

    Freelancer.Projects.create(data, Meteor.bindEnvironment(function(err, res) {
      if (err) throw new Meteor.Error(400, err);


      var project_id = res.result.id;
      var budget = res.budget.minimum - 5; //budget min profit

      Meteor.setTimeout(function() {
        Freelancer.Projects.getBids(project_id, {}, Meteor.bindEnvironment(function(err, res) {
          if (err) throw new Meteor.Error(400, err);

          var bids = res.result.bids; // Array
          var bestBid = _.filter(bids, function(item) {
              return item.amount <= budget;
          })[0]; //get best bidder

          var bestBidderId = bestBid.id; //id of the best bidder

          //award the bidder
          Freelancer.Bids.performBid(bestBidderId, {action: "award"}, Meteor.bindEnvironment(function(err, res) {
            if (err) throw new Meteor.Error(400, err);

            
          }));

        }));
      }, 1800000);
    }));
  }
});
