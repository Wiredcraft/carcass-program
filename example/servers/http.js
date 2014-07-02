var bodyParser, debug, errorhandler, express, http, httpError, lib, logger, server;

debug = require('debug')('carcass:server:http');

lib = require('../');

http = require('http');

express = require('express');

logger = require('morgan');

bodyParser = require('body-parser');

errorhandler = require('errorhandler');

httpError = require('build-http-error');


/**
 * HTTP server.
 *
 * Just an example.
 */

module.exports = server = lib.getConsumer('Server', 'http');


/**
 * Start.
 */

server.start = function(program, done) {
  var config, port, process, _ref;
  config = this.config();
  process = program.process();
  port = (_ref = config != null ? config.port : void 0) != null ? _ref : 3000;
  server = http.createServer(this.app());
  debug('starting http server on %s.', port);
  server.on('listening', function() {
    if (process != null) {
      if (typeof process.send === "function") {
        process.send({
          listening: true
        });
      }
    }
    return done();
  });
  return server.listen(port);
};


/**
 * Helper.
 */

server.app = function() {
  var app, config;
  app = express();
  config = this.config();
  if ((config != null ? config.dev : void 0) != null) {
    app.use(logger('dev'));
  }
  app.use(bodyParser());
  app.get('/ping', function(req, res) {
    return res.json('pong');
  });
  app.get('*', function(req, res, next) {
    return next(httpError(404));
  });
  app.use(errorhandler());
  return app;
};
