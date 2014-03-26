// var debug = require('debug')('carcass:test');

var should = require('should');

var Program = require('../classes/Program');

describe('Class / Program:', function() {

    it('should be a class', function() {
        Program.should.be.type('function');
        (new Program()).should.be.type('object');
    });

    describe('An instance:', function() {

        var program = null;

        before(function() {
            program = new Program();
        });

        it('should be an object', function() {
            program.should.be.type('object');
        });

        it('should be mixable', function() {
            program.should.have.property('mixin').with.type('function');
        });

        it('should have an id', function() {
            program.should.have.property('id').with.type('function');
            program.id().should.be.type('string');
        });

        it('should be a config consumer', function() {
            program.should.have.property('configManager').with.type('function');
            program.should.have.property('configName').with.type('function');
            program.should.have.property('config').with.type('function');
        });

        it('should have a default command', function() {
            program.should.have.property('command').with.type('function');
            program.command().should.be.type('object');
        });

        it('should have a default process', function() {
            program.should.have.property('process').with.type('function');
            program.process().should.be.type('object');
        });

        it('should not have a default script', function() {
            program.should.have.property('script').with.type('function');
            should.not.exist(program.script());
        });

        // TODO

    });

});
