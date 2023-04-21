const gulp = require('gulp');
const buildTasks = require('./build.js');
const cssTasks = require('./css.js');
const templateTasks = require('./template.js');
const zipTasks = require('./zip.js');

exports.dist = gulp.series(
  buildTasks.build,
  cssTasks.css,
  templateTasks.template,
  zipTasks.zip,
  zipTasks.report
);