var Command, Program, carcass, config, debug;

debug = require('debug')('carcass:program');

carcass = require('carcass');

config = require('carcass-config');

Command = require('commander').Command;


/**
 * Represents a program or say a system process.
 */

module.exports = Program = (function() {

  /**
   * Constructor.
   */
  function Program(options) {
    this.id(options);
    debug('initializing the %s program.', this.id());
  }


  /**
   * Accessor.
   *
   * Default to a new instance of Command.
   *
   * @type {Function}
   */

  Program.prototype.command = carcass.helpers.accessor('_command', {
    getDefault: function() {
      var command;
      command = new Command(this.id());
      command.option('-c, --config <name>', 'Load an extra config');
      command.option('-s, --script <name>', 'Start a script or a server');
      return command;
    }
  });


  /**
   * Accessor.
   *
   * Default to the current process.
   *
   * @type {Function}
   */

  Program.prototype.process = carcass.helpers.accessor('_process', {
    getDefault: function() {
      return process;
    }
  });


  /**
   * Accessor.
   *
   * @type {Function}
   */

  Program.prototype.script = carcass.helpers.accessor('_script');


  /**
   * The processor.
   *
   * @type {Function}
   */

  Program.prototype._run = carcass.helpers.processor();


  /**
   * Boot everything.
   */

  Program.prototype.bootstrap = function(done) {
    if (done == null) {
      done = function() {};
    }
    this._run([
      'bootCommand', 'bootProcess', {
        handler: 'bootConfig',
        callback: true
      }, {
        handler: 'bootScript',
        callback: true
      }
    ]).on('error', done).toArray(function(res) {
      return done(null, res);
    });
    return this;
  };


  /**
   * Task: boot the command.
   *
   * @return {undefined}
   */

  Program.prototype.bootCommand = function() {
    var command, process, _ref;
    command = this.command();
    process = this.process();
    if (process.argv != null) {
      command.parse(process.argv);
    }
    if ((this.scripts != null) && (command.script != null)) {
      this.script((_ref = this.scripts[command.script]) != null ? _ref : null);
    }
  };


  /**
   * Task: handle process events.
   *
   * @return {undefined}
   */

  Program.prototype.bootProcess = function() {
    var process, script;
    process = this.process();
    if (process.on == null) {
      return;
    }
    script = this.script();
    if (script != null) {
      if (script.onExit != null) {
        process.on('exit', function() {
          return script.onExit();
        });
      }
    }
    process.on('SIGTERM', function() {
      return process.exit(0);
    });
  };


  /**
   * Task: load config.
   *
   * @return {undefined}
   */

  Program.prototype.bootConfig = function(done) {
    var manager, _ref, _ref1;
    manager = this.configManager();
    if (manager == null) {
      return done();
    }
    if (((_ref = this.command()) != null ? _ref.config : void 0) != null) {
      manager.source(this.command().config);
    }
    if ((_ref1 = this.script()) != null) {
      if (typeof _ref1.configManager === "function") {
        _ref1.configManager(manager);
      }
    }
    manager.reload(done);
  };


  /**
   * Task: start a script.
   *
   * @return {undefined}
   */

  Program.prototype.bootScript = function(done) {
    var script;
    script = this.script();
    if ((script != null ? script.start : void 0) == null) {
      return done();
    }
    script.start(this, done);
  };


  /**
   * Register a script.
   *
   * @param {Object} script
   * @param {String} name is optional
   */

  Program.prototype.registerScript = function(script, name) {
    if (this.scripts == null) {
      this.scripts = {};
    }
    this.scripts[name != null ? name : script.id()] = script;
    return this;
  };


  /**
   * Register a list of scripts.
   */

  Program.prototype.registerScripts = function(scripts) {
    var name, script;
    for (name in scripts) {
      script = scripts[name];
      this.registerScript(script, name);
    }
    return this;
  };


  /**
   * Route to command.option().
   */

  Program.prototype.option = function() {
    var _ref;
    (_ref = this.command()).option.apply(_ref, arguments);
    return this;
  };

  return Program;

})();


/**
 * Mixins.
 */

carcass.mixable(Program);

Program.prototype.mixin(carcass.proto.uid);

Program.prototype.mixin(config.proto.consumer);
