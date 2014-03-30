var debug, fs, lib, path, script;

debug = require('debug')('carcass:script:uninstall');

lib = require('../');

path = require('path');

fs = require('fs');


/**
 * Uninstall.
 *
 * Just an example.
 */

module.exports = script = lib.getConsumer('Script', 'uninstall');


/**
 * Start.
 */

script.start = function(program, done) {
  var stream;
  stream = this._run([
    {
      handler: 'uninstallFS',
      callback: true
    }
  ]);
  stream.on('error', done);
  stream.toArray(function(res) {
    if (typeof process.send === "function") {
      process.send({
        finished: true
      });
    }
    return done(null, res);
  });
  return this;
};


/**
 * Task.
 */

script.uninstallFS = function(done) {
  var conf, filename, manager;
  manager = this.configManager();
  conf = manager.get('theFile');
  if (conf.filename == null) {
    return;
  }
  filename = path.resolve(__dirname, '../../test', conf.filename);
  return fs.unlink(filename, done);
};
