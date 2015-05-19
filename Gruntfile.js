module.exports = function (grunt) {
    "use strict";

    var conf = {
        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'src', src: ['**/*.html'], dest: 'build' },
                ]
            },
            fonts: {
                files: [
                    { expand: true, cwd: 'node_modules/font-awesome/fonts', src: ['*'], dest: 'build/fonts/' },
                ]
            }
        },

        concat: {
            options: {
                separator: '\n\n',
            },
            js: {
                src: ['node_modules/rx/dist/rx.all.min.js', 'node_modules/webrx/dist/web.rx.min.js'],
                dest: 'build/js/bundle.js',
            },
            css: {
                src: ['node_modules/font-awesome/css/font-awesome.min.css', "build/css/main.css"],
                dest: 'build/css/bundle.css',
            },
        },

        watch: {
            ts: {
                files: ["src/**/*.ts"],
                tasks: ['execute:tsc']
            },
            html: {
                files: ["src/**/*.html"],
                tasks: ['copy:main']
            },
            css: {
                files: ["src/**/*.scss"],
                tasks: ["sass", 'concat:css']
            }
        },

        connect: {
            server: {
                options: {
                    port: 9000,
                    base: "build"
                }
            }
        },

        sass: {                              // Task
            dist: {                            // Target
                options: {                       // Target options
                    style: 'expanded'
                },
                files: {
                    'build/css/main.css': 'src/main.scss',   // 'destination': 'source'
                }
            }
        },

        execute: {
            tsc: {
                options: {
                    cwd: 'src'
                },
                src: ['node_modules/typescript/bin/tsc.js']
            }
        },

        clean: {
            build: ["build"]
        }
    };

    grunt.initConfig(conf);

    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-execute');

    grunt.registerTask("default", ["clean:build", 'concat:js', "sass", 'concat:css', 'copy:main', 'copy:fonts', "connect", "execute:tsc", "watch"]);
};
