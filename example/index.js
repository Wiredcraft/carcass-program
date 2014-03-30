var carcass, config, extend, lib, name, path, program, _i, _len, _ref;

program = require('../');

carcass = require('carcass');

config = require('carcass-config');

extend = carcass.Object.extendProperties;

module.exports = lib = carcass.mixable();

lib.mixin(carcass.proto.register);

lib.mixin(config.proto.manager);

lib.classes = {};

extend(lib.classes, program.classes);

_ref = ['scripts', 'servers'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  name = _ref[_i];
  lib.register(__dirname, name);
}

path = require('path');

lib.configDir(path.resolve(__dirname, 'configs')).initConfig();
