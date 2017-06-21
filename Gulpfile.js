var gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),
    scss        = require('gulp-sass'),
    minifycss   = require('gulp-clean-css'),
    prefix      = require('gulp-autoprefixer'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    gutil       = require('gulp-util'),
    imagemin    = require('gulp-imagemin');

var rootDir = '.';
var sourceDir = rootDir + '/src';
var destDir = rootDir + '/build';

var components = {
    scss: {
        source: sourceDir + '/scss',
        watch:  sourceDir + '/scss/*.scss',
        dest:   destDir + '/css'
    },
    image: {
        source: sourceDir + '/images',
        watch:  sourceDir + '/images/*',
        dest:   destDir + '/images'
    },
    js: {
        source: sourceDir + '/js',
        watch:  sourceDir + '/js/*.js',
        dest:   destDir + '/js'
    }
}

// Static Server + watching scss/html files
gulp.task('serve', ['scss', 'uglify', 'html', 'image'], function() {

    browserSync.init({server: destDir});

    gulp.watch(components.scss.watch, ['scss']);
    gulp.watch(components.js.watch, ['uglify']);
    gulp.watch(components.image.watch, ['image']);
    gulp.watch(sourceDir + "/*.html")
    .on('change', browserSync.reload);
});

gulp.task('uglify', function(){
    gulp.src(components.js.watch)
    .pipe(uglify()
            .on('error', function(err) {
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
    
})

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