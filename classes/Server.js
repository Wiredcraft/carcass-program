var Server, carcass, config, debug, memwatch,
  __slice = [].slice;

debug = require('debug')('carcass:program:server');

carcass = require('carcass');

config = require('carcass-config');

try {
  memwatch = require('strong-memwatch');
} catch (_error) {}


/**
 * Represents a server.
 */

module.exports = Server = (function() {

  /**
   * Constructor.
   */
  function Server(options) {
    this.id(options);
    debug('initializing the %s server.', this.id());
  }


  /**
   * A processor. Just for convenience.
   *
   * @type {Function}
   */

  Server.prototype._run = carcass.helpers.processor();


  /**
   * Output memory stats.
   */

  Server.prototype.initMemwatch = function() {
    if (memwatch == null) {
      return this;
    }
    memwatch.on('leak', function() {
      return debug.apply(null, ['mem leak'].concat(__slice.call(arguments)));
    });
    memwatch.on('stats', function() {
      return debug.apply(null, ['mem stat'].concat(__slice.call(arguments)));
    });
    return this;
  };


  /**
   * Force GC per TTL (milliseconds).
   */

  Server.prototype.initGC = function(ttl) {
    if (memwatch == null) {
      return this;
    }
    if (ttl == null) {
      ttl = 100000;
    }
    setInterval(memwatch.gc, ttl);
    setImmediate(memwatch.gc);
    return this;
  };

  return Server;

})();


/**
 * Mixins.
 */

carcass.mixable(Server);

Server.prototype.mixin(carcass.proto.uid);

Server.prototype.mixin(config.proto.consumer);
