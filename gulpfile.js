'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cache');
var clean = require('gulp-clean');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var help = require('gulp-task-listing');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var minifycss = require('gulp-minify-css');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var server = require('tiny-lr')();
var uglify = require('gulp-uglify');

// Help
//  Run `gulp help` for... well, help
gulp.task('help', help);

// Styles
//  Process and minify SASS and stylesheets
gulp.task('styles', function() {
  return gulp.src('src/css/**/*.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer(
      'last 2 version'
      , 'safari 5'
      , 'ie 8'
      , 'ie 9'
      , 'opera 12.1'
      , 'ios 6'
      , 'android 4'
    ))
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(livereload(server))
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
//  Process and minify client-side JavaScript files
gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/javascripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('public/javascripts'))
    .pipe(notify({ message: 'Scripts task complete' }
  ));
});

// Coffee
//  Process and minify Coffeescript files
gulp.task('coffee', function() {
  return gulp.src('src/js/**/*.coffee')
    .pipe(coffee({ bare: true }).on('error', gutil.log))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/javascripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('public/javascripts'))
    .pipe(notify({ message: 'Coffee task complete' }
  ));
});

// Images
//  Optimize images and static content
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({
      optimizationLevel: 3
      , progressive: true
      , interlaced: true
    })))
    .pipe(livereload(server))
    .pipe(gulp.dest('public/images'))
    .pipe(notify({ message: 'Images task complete' }
  ));
});

// Clean
//  Purge any files from previous runs
gulp.task('clean', function() {
  return gulp.src([
    'public/stylesheets'
    , 'public/javascripts'
    , 'public/images']
    , { read: false }
  )
  .pipe(clean());
});

// Default task
//  Run the following tasks by default
gulp.task('default', ['clean'], function() {
  gulp.start(
    'styles'
    , 'scripts'
    , 'coffee'
    , 'images'
  );
});

// Watch
//  Watch for folder/content changes and run the appropriate tasks
gulp.task('watch', function() {

  // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };

    // Watch .scss files
    gulp.watch('src/css/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);

    // Watch .coffee files
    gulp.watch('src/js/**/*.coffee', ['coffee']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);
  });
});
