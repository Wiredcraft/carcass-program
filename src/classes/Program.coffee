debug = require('debug')('carcass:program')

carcass = require('carcass')
config = require('carcass-config')
_ = carcass.highland
Command = require('commander').Command

###*
 * Represents a program or say a system process.
###
module.exports = class Program
    ###*
     * Constructor.
    ###
    constructor: (options) ->
        @id(options)
        debug('initializing the %s program.', @id())

    ###*
     * Accessor.
     *
     * Default to a new instance of Command.
     *
     * @type {Function}
    ###
    command: carcass.helpers.accessor('_command', {
        getDefault: ->
            command = new Command(@id())
            # User can specify an extra config file to be loaded.
            command.option('-c, --config <name>', 'Load an extra config')
            # User can specify a (registered) script to be started.
            command.option('-s, --script <name>', 'Start a script or a server')
            return command
    })

    ###*
     * Accessor.
     *
     * Default to the current process.
     *
     * @type {Function}
    ###
    process: carcass.helpers.accessor('_process', {
        getDefault: -> return process
    })

    ###*
     * Accessor.
     *
     * @type {Function}
    ###
    script: carcass.helpers.accessor('_script')

    ###*
     * The processor.
     *
     * @type {Function}
    ###
    _run: carcass.helpers.processor()

    ###*
     * Boot everything.
    ###
    bootstrap: (done = ->) ->
        stream = @_run([
            'bootCommand'
            'bootProcess'
            { handler: 'bootConfig', callback: true }
            { handler: 'bootScript', callback: true }
        ])
        stream.on('error', done)
        stream.toArray((res) -> done(null, res))
        return @

    ###*
     * Task: boot the command.
     *
     * @return {undefined}
    ###
    bootCommand: ->
        command = @command()
        process = @process()
        # Parse user command.
        command.parse(process.argv) if process.argv?
        # The command can specify a script. Specifying a wrong script does
        # nothing.
        if @scripts? and command.script?
            @script(@scripts[command.script] ? null)
        return

    ###*
     * Task: handle process events.
     *
     * @return {undefined}
    ###
    bootProcess: ->
        process = @process()
        return if not process.on?
        script = @script()
        if script?
            process.on('exit', -> script.onExit()) if script.onExit?
            # TODO: ?
            # process.on('SIGTERM', ->
            #     if script.onSIGTERM?
            #         script.onSIGTERM(-> process.exit(0))
            #     else
            #         process.exit(0)
            # )
        # else
        process.on('SIGTERM', -> process.exit(0))
        # TODO:
        # process.on('uncaughtException', (err) ->)
        return

    ###*
     * Task: load config.
     *
     * @return {undefined}
    ###
    bootConfig: (done) ->
        manager = @configManager()
        return done() if not manager?
        # The command can specify an extra config file.
        manager.source(command.config) if @command()?.config?
        # Inherit config manager.
        @script()?.configManager?(manager)
        # Load config.
        manager.reload(done)
        return

    ###*
     * Task: start a script.
     *
     * @return {undefined}
    ###
    bootScript: (done) ->
        script = @script()
        return done() if not script?.start?
        script.start(@, done)
        return

    ###*
     * Register a script.
     *
     * @param {Object} script
     * @param {String} name is optional
    ###
    registerScript: (script, name) ->
        @scripts ?= {}
        @scripts[name ? script.id()] = script
        return @

    ###*
     * Register a list of scripts.
    ###
    registerScripts: (scripts) ->
        @registerScript(script, name) for name, script of scripts
        return @

    ###*
     * Route to command.option().
    ###
    option: ->
        @command().option(arguments...)
        return @

###*
 * Mixins.
###
carcass.mixable(Program)
Program::mixin(carcass.proto.uid)
Program::mixin(config.proto.consumer)
