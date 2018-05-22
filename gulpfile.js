"use strict";
// generated on 2018-04-26 using generator-webapp 3.0.1
const gulp = require('gulp');
var coveralls = require('gulp-coveralls');
var Server  =require('karma').Server;

gulp.task('test', function(done){
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true,
	}, done).start();
});

gulp.task('tdd', function(done){
	new Server({
		configFile: __dirname + '/karma.conf.js',
	}, done).start();
});

gulp.task('coveralls', ['test'], function() {
	gulp.src('coverage/**/lcov.info')
	.pipe(coveralls());
});