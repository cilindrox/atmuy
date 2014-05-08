gulp = require 'gulp'
autoprefixer = require 'gulp-autoprefixer'
cache = require 'gulp-cache'
clean = require 'gulp-clean'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
gutil = require 'gulp-util'
help = require 'gulp-task-listing'
imagemin = require 'gulp-imagemin'
jshint = require 'gulp-jshint'
livereload = require 'gulp-livereload'
minifycss = require 'gulp-minify-css'
notify = require 'gulp-notify'
rename = require 'gulp-rename'
sass = require 'gulp-ruby-sass'
tiny_lr = require 'tiny-lr'
server = tiny_lr()
uglify = require 'gulp-uglify'
mocha = require 'gulp-mocha'

# Help
gulp.task 'help', help

# Styles -- Process and minify SASS and stylesheets
gulp.task 'styles', ->
  gulp.src 'src/css/**/*.scss'
  .pipe sass { style: 'expanded' }
  .pipe autoprefixer 'last 2 version'
  , 'safari 5'
  , 'ie 8'
  , 'ie 9'
  , 'opera 12.1'
  , 'ios 6'
  , 'android 4'
  .pipe gulp.dest 'public/stylesheets'
  .pipe rename { suffix: '.min' }
  .pipe minifycss()
  .pipe livereload server
  .pipe gulp.dest 'public/stylesheets'
  .pipe notify { message: 'Styles task complete' }

# Scripts -- Process and minify client-side JavaScript files
gulp.task 'scripts', ->
  gulp.src 'src/js/**/*.js'
  .pipe jshint '.jshintrc'
  .pipe jshint.reporter 'default'
  .pipe concat 'main.js'
  .pipe gulp.dest 'public/javascripts'
  .pipe rename { suffix: '.min' }
  .pipe uglify()
  .pipe livereload server
  .pipe gulp.dest 'public/javascripts'
  .pipe notify { message: 'Scripts task complete' }

# Coffee -- Process and minify Coffeescript files
gulp.task 'coffee', ->
  gulp.src 'src/js/**/*.coffee'
  .pipe coffee { bare: true }
  .on 'error', gutil.log
  .pipe jshint '.jshintrc'
  .pipe jshint.reporter 'default'
  .pipe concat 'main.js'
  .pipe gulp.dest 'public/javascripts'
  .pipe rename { suffix: '.min' }
  .pipe uglify()
  .pipe livereload server
  .pipe gulp.dest 'public/javascripts'
  .pipe notify { message: 'Coffee task complete' }

# Images -- Optimize images and static content
gulp.task 'images', ->
  gulp.src 'src/images/**/*'
  .pipe cache imagemin {
    optimizationLevel: 3
    , progressive: true
    , interlaced: true
  }
  .pipe livereload server
  .pipe gulp.dest 'public/images'
  .pipe notify { message: 'Images task complete' }

# Clean -- Purge any files from previous runs
gulp.task 'clean', ->
  gulp.src [
    'public/stylesheets'
    , 'public/javascripts'
    , 'public/images'
    ], { read: false }
    .pipe clean()

# Default task -- Run the following tasks by default
gulp.task 'default', ->
  gulp.start 'styles'
    , 'scripts'
    , 'coffee'
    , 'images'

# Watch --  Listen on port 35729 for resource changes and run the appropriate tasks
gulp.task 'watch', ->
  server.listen 35729, (err) ->
    return console.log err if err
    gulp.watch 'src/js/**/*.js', ['scripts']
    gulp.watch 'src/js/**/*.coffee', ['coffee']
    gulp.watch 'src/css/**/*.scss', ['styles']
    gulp.watch 'src/images/**/*', ['images']

gulp.task 'mocha', ->
  gulp.src './test/**/*.js'
  .pipe mocha {reporter: 'spec'}

gulp.task 'test', ['mocha']

