Template.contentSubmission.events({
  'submit form': function(e) {
    e.preventDefault();

    var text = $(e.target).find('[name=text]').val();
    var projectId = Router.current().params.projectId;
    var bidId = Router.current().params.bidId;

    Meteor.call('insertSubmission', projectId, bidId, text, function(err, res) {
      if (err) alert(err);

    });
  }
})
