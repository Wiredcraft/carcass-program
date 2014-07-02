debug = require('debug')('carcass:server:http')

lib = require('../')
http = require('http')
express = require('express')
logger = require('morgan')
bodyParser = require('body-parser')
errorhandler = require('errorhandler')
httpError = require('build-http-error')

###*
 * HTTP server.
 *
 * Just an example.
###
module.exports = server = lib.getConsumer('Server', 'http')

###*
 * Start.
###
server.start = (program, done) ->
    config = @config()
    process = program.process()
    # Port.
    port = config?.port ? 3000
    # HTTP server.
    server = http.createServer(@app())
    # Listen.
    debug('starting http server on %s.', port)
    server.on('listening', ->
        # Send a message to parent process.
        process?.send?({
            listening: true
        })
        done()
    )
    server.listen(port)

###*
 * Helper.
###
server.app = ->
    app = express()
    config = @config()

    # Dev.
    app.use(logger('dev')) if config?.dev?

    # Basics.
    app.use(bodyParser())

    # Just an example.
    app.get('/ping', (req, res) -> res.json('pong'))

    # Catchall.
    app.get('*', (req, res, next) -> next(httpError(404)))

    # Error handler.
    app.use(errorhandler())

    return app
