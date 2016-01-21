'use strict';

let co       = require('co');
let bluebird = require('bluebird');
let opn      = bluebird.promisify(require('opn'));
let cli      = require('heroku-cli-util');

function* run (context, heroku) {
  let app = yield heroku.apps(context.args.app || context.app).info();
  try {
    yield opn('foewjoijw', {wait: false});
  } catch (err) {
    throw new Error(`${err}
Could not open browser window.
Navigate to ${cli.color.yellow(app.web_url)} in your browser.`);
  }
}

module.exports = {
  topic: 'apps',
  command: 'open',
  description: 'open the app in a web browser',
  wantsApp: true,
  needsAuth: true,
  args:  [{name: 'app', hidden: true, optional: true}],
  run: cli.command(co.wrap(run))
};
