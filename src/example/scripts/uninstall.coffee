debug = require('debug')('carcass:script:uninstall')

lib = require('../')
path = require('path')
fs = require('fs')

###*
 * Uninstall.
 *
 * Just an example.
###
module.exports = script = lib.getConsumer('Script', 'uninstall')

###*
 * Start.
###
script.start = (program, done) ->
    stream = @._run([
        { handler: 'uninstallFS', callback: true }
    ])
    stream.on('error', done)
    stream.toArray((res) ->
        process.send?({
            finished: true
        })
        done(null, res)
    )
    return @

###*
 * Task.
###
script.uninstallFS = (done) ->
    manager = @configManager()
    conf = manager.get('theFile')
    return if not conf.filename?
    filename = path.resolve(__dirname, '../../test', conf.filename)
    fs.unlink(filename, done)
