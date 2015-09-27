Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
    name: 'homepage'
});

Router.route('/submitted', {
    name: 'submitted'
});
