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

      console.log(res);
    }));
  },

});
