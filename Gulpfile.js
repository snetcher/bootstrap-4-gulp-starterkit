var gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass        = require('gulp-sass'),
    minifycss   = require('gulp-clean-css'),
    concat      = require('gulp-concat'),
    autoprefixer= require('gulp-autoprefixer'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    uglify      = require('gulp-uglify'),
    gutil       = require('gulp-util'),
    babel       = require('gulp-babel'),
    validator   = require('gulp-html'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    include     = require("gulp-include");

var rootDir   = '.';
var sourceDir = rootDir + '/src';
var destDir   = rootDir + '/build';

var components = {
    sass: {
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

gulp.task('serve', ['sass', 'uglify', 'html', 'image'], function() {

    browserSync.init({server: destDir});

    gulp.watch(components.sass.watch,  ['sass']);
    gulp.watch(components.js.watch,    ['uglify']);
    gulp.watch(components.image.watch, ['image']);
    gulp.watch(components.html.watch,  ['html']);
    gulp.watch(components.html.watch).on('change', browserSync.reload);
});

gulp.task('uglify', function(){
    let options = {mangle: false, compress: false};
    gulp.src(components.js.watch)
    .pipe(include())
      .on('error', console.log)
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify(options).on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
                this.emit('end');
        })
    )
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

gulp.task('sass', function() {
    gulp.src(components.scss.watch)
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(components.sass.dest))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('default', ['serve']);
