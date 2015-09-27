Meteor.methods({
  insertSubmission: function(projectId, bidId, text) {
    ProjectRequests.update(projectId, {$set: {
      submitted: true,
      submission: text
    }});
    var project = ProjectRequests.findOne(projectId);

    var emailTemplate = Assets.getText('email_template.html');

    // Inject content
    var emailContent = emailTemplate.replace(/\{\{content\}\}/gi, text);

    Email.send({
      to: project.email,
      from: 'yourCopy@musketeers.com',
      subject: 'Your content is ready',
      text: emailContent
    });
  }
});

function sendSubmissionToClient() {
  Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
}
