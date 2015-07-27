module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            sdk: {
                // the files to concatenate

                    src: ['src/Promises.js','src/CloudApp.js','src/ACL.js','src/CloudNotifications.js','src/CloudObject.js','src/CloudQuery.js','src/CloudSearch.js'
                    ,'src/CloudUser.js','src/CloudRole.js','src/CloudFile.js','src/CloudGeoPoint.js', 'src/PrivateMethods.js'],

                // the location of the resulting JS file
                dest: 'dist/1.0.0.js'
                },
            test:{
              // the files to concatenate
                    src: [
                    'test/nodeTest.js',
                    'test/util/util.js',
                    'test/serverTest.js',
                    'test/init/init.js',
                    'test/CloudObject/*.js',
                    'test/CloudExpire/*.js',
                    'test/CloudNotification/*.js',
                    'test/CloudGeoPoint/*.js',
                    'test/CloudQuery/*.js',
                    'test/CloudSearch/*.js',
                    'test/CloudUser/*.js',
                    'test/ACL/*.js'],
                    dest: 'test/test.js'
                },
            stagingTest:{
                    src: ['dist/1.0.0.js',
                    'test/util/util.js',
                    'test/stageTest.js',
                    'test/init/init.js',
                    'test/CloudObject/*.js',
                    'test/CloudExpire/*.js',
                    'test/CloudNotification/*.js',
                    'test/CloudGeoPoint/*.js',
                    'test/CloudQuery/*.js',
                    'test/CloudSearch/*.js',
                    'test/CloudUser/*.js',
                    'test/ACL/*.js'],
                    dest: 'test/stagingTest.js'
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
    grunt.registerTask('default',['concat:sdk','concat:test','concat:stagingTest','uglify']);

};
