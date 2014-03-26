// var debug = require('debug')('carcass:test');

// var should = require('should');
var path = require('path');
var dir = path.resolve(__dirname, '..');
var Monitor = require('carcass-monitor');
var supertest = require('supertest');

describe('Server / http:', function() {

    var monitor = new Monitor();
    var request = supertest('http://127.0.0.1:3210');

    after(function(done) {
        monitor.close(done);
    });

    it.skip('cannot be connected before started', function(done) {
        request.get('/ping')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('can start', function(done) {
        monitor.stack({
            sourceDir: dir,
            script: 'program.js',
            options: ['-s', 'http'],
            startupMessage: 'listening'
        }).start(done);
    });

    it('can handle a request', function(done) {
        request.get('/ping')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

});
