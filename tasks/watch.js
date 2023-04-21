'use strict';

const gulp = require('gulp');
const livereload = require('gulp-livereload');
const serve = require('gulp-serve');
const distTasks = require('./dist.js');

function watch() {
  livereload.listen();
  gulp.series(distTasks.dist, serve('dist'))();
  return gulp.watch(
    ['src/js/**/*.js', 'src/css/**/*.css', 'src/index.hbs'],
    // Gulp4 requires a function to be passed to watch()
    // a call to series() with one task returns a function
    gulp.series
    (distTasks.dist)
  );
}

exports.watch = watch;
