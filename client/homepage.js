Template.homepage.events({
  'submit form.description-field': function(e) {
    e.preventDefault();

    var data = {
      description: $(e.target).find('[name=description]').val()
    };

    ProjectRequests.insert(data);
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

