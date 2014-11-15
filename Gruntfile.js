'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.initConfig({
    jshint: {
      all: ['./server.js', './lib/**/*.js', './routes/**/*.js', './models/**/*.js'],
      options: {
        jshintrc: true
      }
    },
    jscs: {
      src: ['./server.js', './lib/**/*.js', './routes/**/*.js', './models/**/*.js'],
      options: {
        config: '.jscsrc'
      }
    },
    simplemocha: {
      src: ['./tests/**/*.js']
    }
  });

  grunt.registerTasks('test', ['jshint', 'jscs', 'simplemocha']);
  grunt.registerTasks('default', ['test']);
};
