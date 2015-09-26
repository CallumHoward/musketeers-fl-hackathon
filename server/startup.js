Meteor.startup(function() {
  Freelancer = Freelancer(
    Meteor.settings.freelancer.developerId, 
    Meteor.settings.freelancer.developerKey
  );
});
