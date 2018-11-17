const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const headerfooter = require('gulp-headerfooter');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const util = require('gulp-util');
const isDevBuild = util.env.production !== true;

gulp.task('assets', () => {
  gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('html', () => {
  return gulp.src('src/**/*.html')
    .pipe(headerfooter.header('src/partials/header.html'))
    .pipe(headerfooter.footer('src/partials/footer.html'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('images', () => {
  let build = gulp.src('src/images/**/*');
  if(!isDevBuild) {
    build = build.pipe(imagemin());
  }

  return build.pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream());
});

gulp.task('sass', () => {
  let build = gulp.src('src/styles/*.scss')
  if (!isDevBuild) {
    build = build.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  }
  else {
    build = build.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  }

  return build.pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
  let build = gulp.src('src/scripts/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }));

  if (!isDevBuild) {
    build = build.pipe(uglify().on('error', (uglify) => {
      console.error(uglify.message);
      gulp.emit('end');
    }));
  }
  return build.pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['watch'], () => {
  return browserSync.init({
    notify: false,
    server: './dist'
  });
});

gulp.task('build', ['scripts', 'sass', 'html', 'images', 'assets']);

gulp.task('watch', ['build'], () => {
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/styles/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/images/**/*', ['images']);
});

gulp.task('default', ['serve']);
