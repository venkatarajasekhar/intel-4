/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Console = require('console').Console;
const EE = require('events').EventEmitter;

const winston = require('winston');
const intel = require('../');

var stdout = new EE();
stdout.write = function (out, encoding, cb) {
  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  cb && cb();
  return true;
};

var _console = new Console(stdout, stdout);
intel.basicConfig({
  stream: stdout,
  level: intel.INFO,
  format: '%O'
});

winston.add(winston.transports.File, { stream: stdout });
winston.remove(winston.transports.Console);

module.exports = {
  'logging.info()': {
    'bench': {
      'console.info': function() {
        _console.info('asdf');
      },
      'intel.info': function() {
        intel.info('asdf');
      },
      'winston.info': function() {
        winston.info('asdf');
      }
    }
  },
  'string interpolation': {
    'bench': {
      'console': function() {
        _console.info('foo', 'bar');
      },
      'intel': function() {
        intel.info('foo', 'bar');
      },
      'winston': function() {
        winston.info('foo', 'bar');
      }
    }
  },
  'disabled': {
    'before': function() {
      intel.setLevel(intel.INFO);
      intel.getLogger('foo');
      intel.getLogger('foo.bar');
      intel.getLogger('foo.bar.baz');
      this.intel = intel.getLogger('foo.bar.baz.quux');
      intel.setLevel(intel.WARN);
      winston.level = 'warn';
    },
    'bench': {
      'console': function() {
        _console.info('foo', 'bar');
      },
      'intel': function() {
        this.intel.info('foo', 'bar');
      },
      'winston': function() {
        winston.info('foo', 'bar');
      }
    }
  }
};
