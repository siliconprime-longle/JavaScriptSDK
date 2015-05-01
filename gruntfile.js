module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
            },
            dist: {
                // the files to concatenate
                src: ['src/promise.js','src/Cloudapp.js','src/ACL.js','src/CloudNotifications.js','src/co.js','src/cq.js','src/cs.js'
                    ,'src/CloudUser.js','src/CloudRole.js','src/CloudFile.js','src/Private_methods.js'],
                // the location of the resulting JS file
                dest: 'dist/1.0.0.js'
            }
        },
        uglify: {
            options:{
            },
            my_target:{
                files:{
                    'dist/1.0.0.min.js':['dist/1.0.0.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default',['concat','uglify']);
}