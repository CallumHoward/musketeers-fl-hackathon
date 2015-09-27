Template.homepage.events({
  'submit form.description-field': function(e) {
    e.preventDefault();

    var data = {
      title: $(e.target).find('[name=email]').val(),
      description: $(e.target).find('[name=description]').val()
    };
    var email = data.title;

    Meteor.call('createNewProject', email, data, function(err, res) {
      if (err) alert(err);
      Router.go('submitted');
    });
  }
});

Template.homepage.onRendered(function (){
  // auto adjust the height of
  $('#description-field-textbox').on( 'keyup', 'textarea', function (){
    $(this).height( 0 );
    $(this).height( this.scrollHeight );
  });
  $('#description-field-textbox').find( 'textarea' ).keyup();
});
