Meteor.methods({
  insertSubmission: function(projectId, bidId, text) {
    ProjectRequests.update({projectId: projectId}, {$set: {
      submitted: true,
      submission: text
    }});
    var project = ProjectRequests.findOne({projectId: projectId});

    var emailTemplate = Assets.getText('email_template.html');

    // Inject content
    var emailContent = Temple.compileString(emailTemplate, {
      content: text,
      email: project.email
    });

    Email.send({
      to: project.email,
      from: 'yourCopy@musketeers.com',
      subject: 'Your content is ready',
      text: emailContent
    });
  }
});
