var gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),
    scss        = require('gulp-sass'),
    minifycss   = require('gulp-clean-css'),
    concat      = require('gulp-concat'),
    prefix      = require('gulp-autoprefixer'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    gutil       = require('gulp-util'),
    babel       = require('gulp-babel'),
    validator   = require('gulp-html'),
    imagemin    = require('gulp-imagemin'),
    include       = require("gulp-include");

var rootDir   = '.';
var sourceDir = rootDir + '/src';
var destDir   = rootDir + '/build';

var components = {
    scss: {
        source: sourceDir + '/scss',
        watch:  sourceDir + '/scss/*.scss',
        dest:   destDir   + '/css'
    },
    html: {
        source: sourceDir,
        watch:  sourceDir + '/*.html',
        dest:   destDir
    },
    image: {
        source: sourceDir + '/images',
        watch:  sourceDir + '/images/*',
        dest:   destDir   + '/images'
    },
    js: {
        source: sourceDir + '/js',
        watch:  sourceDir + '/js/*.js',
        dest:   destDir   + '/js',
        all:    'scripts.js'
    }
}

// Static Server + watching scss/html files
gulp.task('serve', ['scss', 'uglify', 'html', 'image'], function() {

    browserSync.init({server: destDir});

    gulp.watch(components.scss.watch,  ['scss']);
    gulp.watch(components.js.watch,    ['uglify']);
    gulp.watch(components.image.watch, ['image']);
    gulp.watch(components.html.watch,  ['html']);
    gulp.watch(components.html.watch).on('change', browserSync.reload);
});

gulp.task('uglify', function(){
    gulp.src(components.js.watch)
    // .pipe(concat(components.js.all))
    .pipe(include())
      .on('error', console.log)
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify().on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
                this.emit('end');
        })
    )
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(components.js.dest));
});

gulp.task('image', function () {
    gulp.src(components.image.watch)
    .pipe(imagemin())
    .pipe(gulp.dest(components.image.dest));
    
});

gulp.task('html', function () {
    gulp.src(components.html.watch)
    .pipe(validator()).on('error', function(err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
            this.emit('end');
    })
    .pipe(gulp.dest(components.html.dest));
});

// Compile scss into CSS & auto-inject into browsers
gulp.task('scss', function() {
    gulp.src(components.scss.watch)
    .pipe(scss())
    .pipe(prefix("last 2 version", "> 1%", "ie 8", "ie 7"))
    // .pipe(gulp.dest(components.scss.dest))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(components.scss.dest))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);