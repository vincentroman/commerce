'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            default : {
                src: ['src/**/*.ts'],
                ourDir: "dist",
                tsconfig: 'src/tsconfig.json'
            }
        },
        bootlint: {
            options: {
                stoponerror: false,
                relaxerror: [
                    'W005', // jQuery not found
                    'E001', // missing a DOCTYPE declaration
                    'W001', // missing UTF-8
                    'W002', // missing X-UA-Compatible
                    'W003' // missing viewport
                ]
            },
            files: [
                'src/app/component/*.html',
                'src/index.html'
            ]
        },
        tslint: {
            options: {
                configuration: "tslint.json"
            },
            files: {
                src: ['src/**/*.ts']
            }
        },
        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    'dist/css/screen.css': 'src/scss/screen.scss'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-bootlint');

    grunt.registerTask('css', ['sass']);
    grunt.registerTask('build', ['bootlint', 'tslint', 'sass']);
    grunt.registerTask('default', ['build']);
}
