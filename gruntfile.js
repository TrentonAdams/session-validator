'use strict';

var request = require('request');
var assets = require('./config/assets.js');

module.exports = function (grunt)
{
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        // run the babelified app.
        file: 'dist/app.js'
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      js: {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js',
          'public/js/*.js'
        ],
        tasks: ['clean', 'copy', 'babel', 'develop', 'delayed-livereload']
      },
      css: {
        files: [
          'public/css/*.css'
        ],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: [
          'app/views/*.ejs',
          'app/views/**/*.ejs'
        ],
        options: {livereload: reloadPort}
      }
    },
    jsdoc: {
      dist: {
        src: ['app/**/*.js', 'public/js/**/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: './',
            src: ['app/**/*.js', 'app.js', 'config/*.js', 'public/js/*.js'],
            dest: 'dist',
            ext: '.js'
          }]
      }
    },
    clean: {
        build: ['build/'],
        dist: ['dist/']
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            src: [
              'app/**/*', 'config/**'],
            dest: 'dist/'
          },
          {
            expand: false,
            src: [
              assets.public],
            dest: 'dist/'
          }
        ]
      }
    },
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('delayed-livereload',
    'Live reload after the node server has restarted.', function ()
    {
      var done = this.async();
      setTimeout(function ()
      {
        request.get('http://localhost:' + reloadPort + '/changed?files=' +
          files.join(','), function (err, res)
        {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
      }, 500);
    });

  grunt.registerTask('default', [
    'clean',
    'copy',
    'babel',
    'develop',
    'watch',
  ]);

  grunt.registerTask('dist', [
    'clean',
    'copy',
    'babel'
  ]);

};
