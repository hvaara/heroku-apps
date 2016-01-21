'use strict';

let co       = require('co');
let cli      = require('heroku-cli-util');
let extend   = require('util')._extend;

function* run (context, heroku) {
  let app = context.args.app || context.app;
  if (!app) throw new Error('No app specified');
  app = yield heroku.apps(app).info();
  yield cli.open(app.web_url);
}

let cmd = {
  topic: 'apps',
  command: 'open',
  description: 'open the app in a web browser',
  wantsApp: true,
  needsAuth: true,
  args:  [{name: 'app', hidden: true, optional: true}],
  run: cli.command(co.wrap(run))
};

module.exports.open = cmd;
module.exports.root = extend({}, cmd);
module.exports.root.topic = 'open';
delete module.exports.root.command;
