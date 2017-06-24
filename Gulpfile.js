const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const minifycss = require('gulp-clean-css');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const del = require('del');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const validator = require('gulp-html');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const include = require("gulp-include");


// Directories definition.
const rootDir = '.';
const sourceDir = rootDir + '/src';
const destDir = rootDir + '/build';

// Components configuration.
const components = {
  sass: {
    source: sourceDir + '/scss',
    watch: sourceDir + '/scss/*.scss',
    dest: destDir + '/css'
  },
  html: {
    source: sourceDir,
    watch: sourceDir + '/*.html',
    dest: destDir
  },
  image: {
    source: sourceDir + '/images',
    watch: sourceDir + '/images/*',
    dest: destDir + '/images'
  },
  js: {
    source: sourceDir + '/js',
    watch: sourceDir + '/js/*.js',
    dest: destDir + '/js',
    all: 'scripts.js'
  }
};

gulp.task('watch', ['sass', 'uglify', 'html', 'image'], function () {

  browserSync.init({server: destDir});

  gulp.watch(components.sass.watch, ['sass']);
  gulp.watch(components.js.watch, ['uglify']);
  gulp.watch(components.image.watch, ['image']);
  gulp.watch(components.html.watch, ['html']);
  gulp.watch(components.html.watch).on('change', browserSync.reload);
});

gulp.task('uglify', function () {
  let options = {
    mangle: false,
    compress: false
  };
  gulp.src(components.js.watch)
    .pipe(include())
    .on('error', console.log)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify(options).on('error', function (err) {
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
    .pipe(validator()).on('error', function (err) {
    gutil.log(gutil.colors.red('[Error]'), err.toString());
    this.emit('end');
  })
    .pipe(gulp.dest(components.html.dest));
});

gulp.task('sass', function () {
  gulp.src(components.scss.watch)
    .pipe(sass())
    .pipe(autoprefixer(["last 15 versions", '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(components.sass.dest))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: destDir
    },
    notify: false
  });
});

gulp.task("default", ["watch"]);
