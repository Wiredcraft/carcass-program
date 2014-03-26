debug = require('debug')('carcass:program:server')

carcass = require('carcass')
config = require('carcass-config')

try memwatch = require('strong-memwatch')

###*
 * Represents a server.
###
module.exports = class Server
    ###*
     * Constructor.
    ###
    constructor: (options) ->
        @id(options)
        debug('initializing the %s server.', @id())

    ###*
     * A processor. Just for convenience.
     *
     * @type {Function}
    ###
    _run: carcass.helpers.processor()

    ###*
     * Output memory stats.
    ###
    initMemwatch: ->
        return @ if not memwatch?
        memwatch.on('leak', -> debug('mem leak', arguments...))
        memwatch.on('stats', -> debug('mem stat', arguments...))
        return @

    ###*
     * Force GC per TTL (milliseconds).
    ###
    initGC: (ttl) ->
        return @ if not memwatch?
        # Default to every 100 seconds.
        ttl = 100000 if not ttl?
        setInterval(memwatch.gc, ttl)
        setImmediate(memwatch.gc)
        return @

###*
 * Mixins.
###
carcass.mixable(Server)
Server::mixin(carcass.proto.uid)
Server::mixin(config.proto.consumer)
