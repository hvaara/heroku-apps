'use strict';

let co     = require('co');
let cli    = require('heroku-cli-util');
let extend = require('util')._extend;
let _      = require('lodash');

function* run (context, heroku) {
  let git = require('../../lib/git')(context);

  let app = context.args.app || context.app;
  yield heroku.get(`/apps/${app}`);
  yield cli.confirmApp(app, context.flags.confirm);
  let request = heroku.request({
    method: 'DELETE',
    path:   `/apps/${app}`,
  });
  yield cli.action(`Destroying ${app} (including all add-ons)`, request);

  if (git.inGitRepo()) {
    // delete git remotes pointing to this app
    _(yield git.listRemotes())
    .filter(r => git.gitUrl(app) === r[1] || git.sshGitUrl(app) === r[1])
    .map(r => r[0])
    .uniq()
    .forEach(git.rmRemote);
  }
}

let cmd = {
  topic: 'apps',
  command: 'destroy',
  description: 'permanently destroy an app',
  help: 'This will also destroy all add-ons on the app.',
  needsAuth: true,
  wantsApp:  true,
  args:  [{name: 'app', hidden: true, optional: true}],
  flags: [
    {name: 'confirm', char: 'c', hasValue: true},
  ],
  run: cli.command(co.wrap(run))
};

module.exports.apps = cmd;
module.exports.root = extend({}, cmd);
module.exports.root.topic = 'destroy';
delete module.exports.root.command;
