Meteor.methods({
  createNewProject: function(email, data) {
    check(data, {
      title: String,
      description: String,
      currency: {id: Number},
      budget: {minimum: Number},
      jobs: [{id: Number}]
    });

    createNewProject(data, createNewProjectCallBack);
/*
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

          var bestBidId = bestBid.id; //id of the best bid

          //award the bidder
          Freelancer.Bids.performBid(bestBidId, {action: "award"}, Meteor.bindEnvironment(function(err, res) {
            if (err) throw new Meteor.Error(400, err);


          }));

        }));
      }, 1800000);
    }));
    */
  }
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
