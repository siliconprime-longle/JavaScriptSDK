module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            foo: {
                // the files to concatenate

                    src: ['src/Promises.js','src/Cloudapp.js','src/ACL.js','src/CloudNotifications.js','src/CloudObject.js','src/CloudQuery.js','src/CloudSearch.js'
                    ,'src/CloudUser.js','src/CloudRole.js','src/CloudFile.js','src/CloudGeoPoint.js', 'src/Private_methods.js'],

                // the location of the resulting JS file
                dest: 'dist/1.0.0.js'
            },
            bar:{
              // the files to concatenate
                    src: ['dist/1.0.0.js','test/util/util.js','test/server_test.js','test/init/init.js','test/CloudObject/*.js','test/CloudExpire/*.js'
                        ,'test/CloudExpire/*.js','test/CloudFile/*.js','test/CloudNotification/*.js','test/CloudGeoPoint/*.js', 'test/CloudQuery/*.js','test/CloudSearch/*.js'
                    ,'test/CloudUser/*.js','test/ACL/*.js'],
                    dest: 'test/join.js'
            }
            },
            uglify: {
                options: {},
                my_target: {
                    files: {
                        'dist/1.0.0.min.js': ['dist/1.0.0.js']
                    }
                }
            }
        });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default',['concat:foo','concat:bar']);
    grunt.registerTask('ugly',['uglify']);
};
