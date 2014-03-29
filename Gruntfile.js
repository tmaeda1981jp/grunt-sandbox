/*jslint white: true, nomen: true, maxlen: 120, plusplus: true, */
/*global _:false, $:false, define:false, require:false, module: false, */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jsFiles: [
      'js/*.js',
      'js/collections/**/*.js',
      'js/utils/**/*.js',
      'js/views/**/*.js',
      'js/models/**/*.js',
      'js/exceptions/**/*.js',
      'js/viewmodels/**/*.js',
      'js/test/specs/**/*.js',
      'js/test/main.js'
    ],

    // exec
    exec: {
      testjs: {
        command: 'mocha-phantomjs js/test/spec_runner.html'
      }
    },

    // requirejs
    requirejs: {
      compile: {
        options: {
          out: 'js/main-build.js',
          almond: true,
          baseUrl: 'js/',
          name: 'libs/almond/almond', // path to almond.js
          include: ['main'],
          insertRequire: ['main'],
          preserveLicenseComments: true,
          // install using bower
          paths: {
            text: 'libs/text/text',
            jquery: 'libs/jquery/jquery',
            // underscore: 'libs/underscore-amd/underscore',
            underscore: 'libs/underscore/underscore',
            // backbone: 'libs/backbone-amd/backbone',
            backbone: 'libs/backbone/backbone',
            'backbone.viewmodel': 'libs/backbone-view-model/src/view-model',
            mustache: 'libs/mustache/mustache'
          },
          shim: {
            underscore: {
              exports: '_'
            },
            backbone: {
              deps: ['jquery', 'underscore'],
              exports: 'Backbone'
            },
            'backbone.viewmodel': {
              deps: ['backbone']
            }
          }
        }
      }
    },

    // compass
    compass: {
      dev: {
        options: {
          sassDir: '_sass/',
          cssDir: 'css/',
          environment: 'develepment',
          noLineComments: false,
          force: true,
          relativeAssets: true
        }
      },
      prod: {
        options: {
          sassDir: '_sass/',
          cssDir: 'css/',
          environment: 'production',
          noLineComments: true,
          outputstyle: 'compressed',
          force: false,
          relativeAssets: false
        }
      }
    },

    // docco
    docco: {
      dist: {
        src: '<%= jsFiles %>',
        options: {
          output: 'js/docs/'
        }
      }
    },

    // optimize images
    img: {
      task: {
        src: 'imgs/src',
        dest: 'imgs'
      }
    },

    // jade
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: {
          'html/dest.html': 'jade/**/*.jade' //, 'a.html': ['path/to/a1.jade', 'path/to/a2.jade']
        }
      }
    },

    // watch
    watch: {
      js: {
        files: '<%= jsFiles %>',
        tasks: ['docco', 'exec:testjs']
      },
      jstest: {
        files: '<%= jsFiles %>',
        tasks: ['exec:testjs']
      },
      jsdoc: {
        files: '<%= jsFiles %>',
        tasks: ['docco']
      },
      css: {
        files: ['_sass/*.scss'],
        tasks: ['compass:dev']
      },
      jade: {
        files: ['jade/**/*.jade'],
        tasks: ['jade']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-img');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-contrib-jade');

  // tasks for optimize(minify)
  grunt.registerTask('minify', ['requirejs', 'compass-clean', 'compass:prod']);
  grunt.registerTask('minify:js',  ['requirejs']);
  grunt.registerTask('minify:css', ['compass-clean', 'compass:prod']);
};
