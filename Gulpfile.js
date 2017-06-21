var gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass        = require('gulp-sass'),
    minifycss   = require('gulp-clean-css'),
    prefix      = require('gulp-autoprefixer'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    gutil       = require('gulp-util');

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'uglify'], function() {

    browserSync.init({server: "./app"});

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/scripts/*.js", ['uglify']);
    gulp.watch("app/*.html")
    .on('change', browserSync.reload);
});

gulp.task('uglify', function(){
    gulp.src("app/scripts/*.js")
    .pipe(uglify()
            .on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
                this.emit('end');
            })
        )
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest("app/js"));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    gulp.src("app/scss/*.scss")
    .pipe(sass())
    .pipe(prefix("last 2 version", "> 1%", "ie 8", "ie 7"))
    .pipe(gulp.dest("app/css"))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);