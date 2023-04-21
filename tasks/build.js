'use strict';

const gulp = require('gulp');
const rollup = require('rollup');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const livereload = require('gulp-livereload');
const util = require('gulp-util');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');


function onError(err, pipeline = null) {
  util.log(util.colors.red(`Error: ${err.message}`));
  util.beep();
  if (pipeline) {
    pipeline.emit('end');
  }
}

async function buildFull() {
  try {
    const bundle = await rollup.rollup({
      input: 'src/js/main.js',
      plugins: [nodeResolve(), commonjs()]
    });

    return bundle.write({
      file: 'dist/main.js',
      format: 'iife'
    }).then(() => livereload({}));

  } catch (error) {
    onError(error);
  }
}

function buildMin() {
  let pipeline;
  return pipeline = gulp.src('./dist/main.js')
    .pipe(terser())
    .on('error', err => onError(err, pipeline))
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('./dist'));
}
exports.build = gulp.series(buildFull, buildMin)
