program = require('../')
carcass = require('carcass')
config = require('carcass-config')

# The lib.
module.exports = lib = carcass.mixable()
lib.mixin(carcass.proto.register)
lib.mixin(config.proto.manager)

# Integrate.
lib.extend(program, 'classes')

# Register.
lib.register(__dirname, name) for name in ['scripts', 'servers']

# Stack config files.
path = require('path')
lib.configDir(path.resolve(__dirname, 'configs')).initConfig()
