var Script, carcass, config, debug;

debug = require('debug')('carcass:program:script');

carcass = require('carcass');

config = require('carcass-config');


/**
 * A simplest script.
 */

module.exports = Script = (function() {

  /**
   * Constructor.
   */
  function Script(options) {
    this.id(options);
    debug('initializing the %s script.', this.id());
  }


  /**
   * A processor. Just for convenience.
   *
   * @type {Function}
   */

  Script.prototype._run = carcass.helpers.processor();

  return Script;

})();


/**
 * Mixins.
 */

carcass.mixable(Script);

Script.prototype.mixin(carcass.proto.uid);

Script.prototype.mixin(config.proto.consumer);
