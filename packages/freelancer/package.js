Package.describe({
  name: 'musketeers:freelancer',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');
  api.use('ecmascript');
  api.addFiles('freelancer.js', 'server');
  api.export('Freelancer', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('musketeers:freelancer');
  api.addFiles('freelancer-tests.js');
});

Npm.depends({
  "freelancer-node": "https://musketeersdummy:giveusmonies8@github.com/kAlbert19/freelancer-node/archive/7f14eef055035b845c31a7867001a49ddd53348c.tar.gz"
});
