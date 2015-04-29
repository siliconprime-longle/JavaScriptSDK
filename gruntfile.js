module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
            },
            dist: {
                // the files to concatenate
                src: ['src/promise.js','src/Cloudapp.js','src/CloudNotifications.js','src/co.js','src/cq.js','src/cs.js'
                    ,'src/CloudUser.js','src/CloudRole.js','src/ACL.js','src/CloudFile.js','src/Private_methods.js'],
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
        },
        mocha:
        {
            test:
            {
                src: [ 'test/index.html' ],
                options:
                {
                    debug: true,
                    reporter: 'Spec',
                    run: true,
                    ui:'bdd',
                    log:true,
                    quiet: false,
                    logErrors:true,
                    timeout:30000
                }
            }

        }
        /*watch:
        {
            test:
            {
                files: ['test/**'],
                tasks: ['mocha']
            }
        }*/
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default',['concat','uglify']);
    grunt.registerTask('test', ['mocha']);


}