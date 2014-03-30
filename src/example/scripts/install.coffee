debug = require('debug')('carcass:script:install')

lib = require('../')
path = require('path')
fs = require('fs')

###*
 * Install.
 *
 * Just an example.
###
module.exports = script = lib.getConsumer('Script', 'install')

###*
 * Start.
###
script.start = (program, done) ->
    stream = @._run([
        { handler: 'installFS', callback: true }
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
script.installFS = (done) ->
    manager = @configManager()
    conf = manager.get('theFile')
    return if not conf.filename?
    filename = path.resolve(__dirname, '../../test', conf.filename)
    fs.writeFile(filename, conf.content ? '', done)
