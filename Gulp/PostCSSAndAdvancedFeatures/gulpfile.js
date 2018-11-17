const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const gulp = require('gulp');
const headerfooter = require('gulp-headerfooter');
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const postcssimport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const uglify = require('gulp-uglify');
const util = require('gulp-util');
const postcssplugins = [
  postcssimport,
  postcssPresetEnv({
    importFrom: './src/styles/partials/variables.css'
  })
];

const cssminplugins = [
  cssnano
];
const isDevBuild = util.env.production !== true;

gulp.task('assets', () => {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('build', ['scripts', 'css', 'html', 'images', 'assets']);

gulp.task('css', () => {
  let build = gulp.src('src/styles/*.css')
    .pipe(postcss(postcssplugins))

  if (!isDevBuild) {
    build = build.pipe(postcss(cssminplugins))
  }

  return build.pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream());
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

gulp.task('serve', [ 'watch'], () => {
  return browserSync.init({
    notify: false,
    server: './dist'
  });
});

gulp.task('watch', ['build'], () => {
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/styles/**/*.css', ['css']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/images/**/*', ['images']);
});

gulp.task('default', ['serve']);
