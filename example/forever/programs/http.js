var lib = require('../../');

var program = module.exports = lib.getConsumer('Program');
var server = lib.servers.http;

program.script(server).bootstrap();
