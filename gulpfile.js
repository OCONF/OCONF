'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var jsdoc = require('gulp-jsdoc3');
var sequence = require('run-sequence');
var babel = require('gulp-babel');
var isparta = require('isparta');
var babelRegister = require('babel-register');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var mochify = require('mochify');

var GULP_FILE = ['gulpfile.js'];
var SRC_FILES = ['src/**/*.js'];
var TEST_FILES = ['test/**/*.js'];
var TEST_CASE_FILES = ['test/**/*.test.js'];
var COVERAGE_REPORT_DIR = 'public/build/coverage';
var COMPILED_SRC_DIR = 'public/build/dist';
var COMPILED_SRC_FILES = [COMPILED_SRC_DIR + '/**/*.js'];
var JSDOC_DIR = 'public/build/jsdoc';

gulp.task('jshint', function (done) {
  gulp.src(GULP_FILE.concat(SRC_FILES, TEST_FILES))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('finish', done);
});

gulp.task('jscs', function (done) {
  gulp.src(GULP_FILE.concat(SRC_FILES, TEST_FILES))
    .pipe(jscs())
    .on('finish', done);
});

gulp.task('eslint', function () {
    return gulp.src(['src/*.js','!node_modules/**', '!public/**']) 
        .pipe(eslint()) 
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/*gulp.task('test', function (done) {
  gulp.src(SRC_FILES)
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(TEST_CASE_FILES)
        .pipe(mocha({compilers: {js: babelRegister}}))
        .pipe(istanbul.writeReports({
          dir: COVERAGE_REPORT_DIR
        }))
        .pipe(istanbul.enforceThresholds({
          thresholds: {
            global: 0
          }
        }))
        .on('finish', done);
    });
});*/

gulp.task('test', function (done) {
  mochify(TEST_FILES, {
    report: 'tap',
    cover: true
  })
  .transform(babelify)
  .bundle();
});

gulp.task('compile', function (done) {
  gulp.src(SRC_FILES)
    .pipe(babel())
    .pipe(browserify())
    .pipe(gulp.dest(COMPILED_SRC_DIR))
    .on('finish', done);
});

gulp.task('bundle', function (done) {
  var bundler = browserify({
    entries: './src/index.js',
    debug: true
  });
  bundler
    .transform(babelify)
    .bundle()
    .on('error', function (err) { console.error(err); })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest(COMPILED_SRC_DIR));
});

gulp.task('jsdoc', ['compile'], function (done) {
  gulp.src(COMPILED_SRC_FILES)
    .pipe(jsdoc(JSDOC_DIR))
    .on('finish', done);
});

gulp.task('build', function (done) {
  sequence('eslint', 'jscs', 'test', 'bundle', 'jsdoc', done);
});

gulp.task('pre-commit', ['build']);

gulp.task('ci', ['build']);

gulp.task('default', ['build']);
