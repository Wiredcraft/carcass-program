// var debug = require('debug')('carcass:test');

// var should = require('should');
var path = require('path');
var dir = path.resolve(__dirname, '..');
var Monitor = require('carcass-monitor');
var fs = require('fs');

describe('Scripts:', function() {

    describe('Install:', function() {

        var monitor = new Monitor();

        after(function(done) {
            monitor.close(done);
        });

        it('can run', function(done) {
            monitor.stack({
                sourceDir: dir,
                script: 'program.js',
                options: ['-s', 'install'],
                startupMessage: 'finished'
            }).start(done);
        });

        it('should have the file created', function(done) {
            fs.exists(path.resolve(__dirname, 'lorem.md'), function(exists) {
                exists.should.equal(true);
                done();
            });
        });

    });

    describe('Uninstall:', function() {

        var monitor = new Monitor();

        after(function(done) {
            monitor.close(done);
        });

        it('can run', function(done) {
            monitor.stack({
                sourceDir: dir,
                script: 'program.js',
                options: ['-s', 'uninstall'],
                startupMessage: 'finished'
            }).start(done);
        });

        it('should have the file deleted', function(done) {
            fs.exists(path.resolve(__dirname, 'lorem.md'), function(exists) {
                exists.should.equal(false);
                done();
            });
        });

    });

});
