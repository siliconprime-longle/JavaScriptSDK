module.exports = function(grunt) {

    var  pjson = grunt.file.readJSON('package.json');

    var config = {
        concat: {
            sdk: {
                // the files to concatenate
                    src: ['src/Promises.js','src/PrivateMethods.js','src/CloudApp.js','src/ACL.js','src/CloudNotifications.js','src/CloudObject.js','src/CloudQuery.js','src/CloudSearch.js'
                    ,'src/CloudUser.js','src/CloudRole.js','src/CloudFile.js','src/CloudGeoPoint.js', 'src/CloudTable.js', 'src/Column.js','src/CloudQueue.js',
                    'src/CloudCache.js','src/CloudPush.js'],
                    // the location of the resulting JS file
                    dest: 'dist/cloudboost.js'
                },

            test:{
              // the files to concatenate
                    src: [
                        'test/config.js',
                        'test/util/util.js',
                        'test/requireCloudBoost.js',
                        'test/init/init.js',
                        'test/CloudCache/*.js',
                        'test/CloudTable/*.js',
                        'test/CloudQueue/*.js',
                        'test/CloudObject/*.js',
                        'test/CloudFile/*.js',
                        'test/CloudNotification/*.js',
                        'test/ACL/*.js',
                        'test/CloudExpire/*.js',
                        'test/CloudGeoPoint/*.js',
                        'test/CloudQuery/*.js',
                        'test/CloudPush/*.js',
                        'test/CloudSearch/*.js',
                        'test/CloudUser/*.js',
                        'test/CloudRole/*.js',
                        'test/CloudApp/socket.js',
                        'test/CloudApp/deleteApp.js',
                        'test/CloudDevice/*.js',
                    ],

                    dest: 'test/test.js'
                },

            sdkRelease: {
                // the files to concatenate
                    src: ['dist/cloudboost.js'],

                    // the location of the resulting JS file
                    dest: 'dist/'+pjson.version+'.js'
                }
            },

            uglify:{
                uglifyDev: {
                    files: {
                        'dist/cloudboost.min.js': ['dist/cloudboost.js']
                    }
                },
                uglifyRelease: {
                    files: {

                    }
                }
            },

            bumpup: 'package.json' //update the version of package.json
        };


    config.uglify.uglifyRelease.files['dist/'+pjson.version+'.min.js']=  ['dist/'+pjson.version+'.js'];

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bumpup');

    grunt.registerTask('default',['concat:sdk','concat:test','bumpup','uglify:uglifyDev']);
    grunt.registerTask('release',['concat:sdkRelease','uglify:uglifyRelease']);

};
