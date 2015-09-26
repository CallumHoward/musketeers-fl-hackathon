Template.homepage.events({
    'submit form.description-field': function(e) {
        e.preventDefault();

        var data = {
            description: $(e.target).find('[name=description]').val()
        };

        ProjectRequests.insert(data);
    }
});
