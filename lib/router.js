Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
    name: 'homepage'
});

Router.route('/submitted', {
    name: 'submitted'
});

Router.route('/submissions/:bid_id', {
    name: 'contentSubmission'
});
