'use strict';
process.env.TZ    = 'UTC';
global.cli        = require('heroku-cli-util');
global.expect     = require('chai').expect;
cli.raiseErrors   = true;
cli.color.enabled = false;
