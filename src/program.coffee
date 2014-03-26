lib = require('./')

###*
 * Just an example.
###
module.exports = program = lib.getConsumer('Program')

program.registerScripts(lib.scripts).registerScripts(lib.servers).bootstrap()
