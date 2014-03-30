var debug, fs, lib, path, script;

debug = require('debug')('carcass:script:install');

lib = require('../');

path = require('path');

fs = require('fs');


/**
 * Install.
 *
 * Just an example.
 */

module.exports = script = lib.getConsumer('Script', 'install');


/**
 * Start.
 */

script.start = function(program, done) {
  var stream;
  stream = this._run([
    {
      handler: 'installFS',
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

script.installFS = function(done) {
  var conf, filename, manager, _ref;
  manager = this.configManager();
  conf = manager.get('theFile');
  if (conf.filename == null) {
    return;
  }
  filename = path.resolve(__dirname, '../../test', conf.filename);
  return fs.writeFile(filename, (_ref = conf.content) != null ? _ref : '', done);
};
