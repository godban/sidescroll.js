'use strict';

module.exports = function (grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    var version = 'patch';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        banner: '/*! <%= pkg.name.replace(".js", "") %> by <%= pkg.author.name %>, <%=' +
        ' grunt.template.today("dd-mm-yyyy")' +
        ' %> */\n',

        concat: {
            options: {
                separator: "\n\n"
            },
            dist: {
                src: [
                    'src/main.js'
                ],
                dest: 'dist/jquery.<%= pkg.name.replace(".js", "") %>.js'
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/jquery.<%= pkg.name.replace(".js", "") %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        usebanner: {
            options: {
                position: 'top',
                banner: '<%= banner %>'
            },
            files: {
                src: [
                    'dist/**/*.js'
                ]
            }
        },

        jshint: {
            files: ['dist/<%= pkg.name %>.js'],
            options: {
                globals: {
                    console: true,
                    module: true,
                    document: true
                },
                jshintrc: '.jshintrc'
            }
        },

        version: {
            options: {
                release: version
            },
            src: [
                'package.json',
                'bower.json'
            ]
        },

        exec: {
            gitTag: {
                cmd: 'git tag -a v<%= pkg.version %> -m "Package update"'
            }
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['concat', 'jshint']
        }

    });

    grunt.registerTask('default', [
        'concat',
        'jshint',
        'uglify',
        'usebanner',
        'version'
    ]);

};
