var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var webserver = require('gulp-webserver');
var webpack = require('webpack');
var webpackSetting = require('./webpack.config');

gulp.task('Watch', function() {
    gulp.watch(['./src/**'],['Build']);
});

gulp.task('Webserver', function(){
    gulp.src(path.join(__dirname))
    .pipe(webserver({
        livereload: false,
        fallback:'./examples/sampleapp.html',
        port: 8888
    }));
});

gulp.task('Build', function(callback) {
    webpack(webpackSetting, 
        function(err, stats) {
            if(err) throw new gutil.PluginError('webpack', err);
            gutil.log('[webpack]', stats.toString({
                // output options
            }));
            callback();
        }
    );
});

gulp.task('default', ['Build', 'Webserver', 'Watch']);