Meteor.startup(function() {
  FL = Freelancer(
    Meteor.settings.freelancer.developerId,
    Meteor.settings.freelancer.developerKey
  );
});
