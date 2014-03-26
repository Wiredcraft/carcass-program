debug = require('debug')('carcass:program:script')

carcass = require('carcass')
config = require('carcass-config')

###*
 * A simplest script.
###
module.exports = class Script
    ###*
     * Constructor.
    ###
    constructor: (options) ->
        @id(options)
        debug('initializing the %s script.', @id())

    ###*
     * A processor. Just for convenience.
     *
     * @type {Function}
    ###
    _run: carcass.helpers.processor()

###*
 * Mixins.
###
carcass.mixable(Script)
Script::mixin(carcass.proto.uid)
Script::mixin(config.proto.consumer)
