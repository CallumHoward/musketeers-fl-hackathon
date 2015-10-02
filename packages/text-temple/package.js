Package.describe({
  name: 'thrivetide:text-temple',
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
  api.addFiles('text-temple.js', 'server');
  api.export('Temple', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('thrivetide:text-temple');
  api.addFiles('text-temple-tests.js');
});

Npm.depends({
  "text-temple": 'https://ttdeployer:triplethriver@bitbucket.org/thrivetide/text-temple/get/f2776b8745f640519cb8aa292fc312a7ab127315.tar.gz',
});
