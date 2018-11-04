const babel = require('gulp-babel');
const gulp = require('gulp');
const headerfooter = require('gulp-headerfooter');
const imagemin = require('gulp-imagemin');
const livereload = require('gulp-livereload');
const log = require('fancy-log');
const open = require('gulp-open');
const rename = require('gulp-rename');
const run = require('gulp-run');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

gulp.task('html', () => {
  gulp.src('src/**/*.html')
    .pipe(headerfooter.header('src/partials/header.html'))
    .pipe(headerfooter.footer('src/partials/footer.html'))
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});

gulp.task('images', () => {
  gulp.src('src/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(livereload());
});

gulp.task('sass', () => {
  return gulp.src('src/styles/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest('dist/styles'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename((path) => {
      path.extname = '.min.css'
    }))
    .pipe(gulp.dest('dist/styles'))
    .pipe(livereload());
});

gulp.task('scripts', () => {
  gulp.src('src/scripts/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(uglify().on('error', () => { log.error('Scripts failed to minify'); }))
    .pipe(rename((path) => {
      path.extname = '.min.js'
    }))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(livereload());
});

gulp.task('assets', () => {
  gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('serve', ['uri', 'watch'], () => {
  gulp.start('server');
});

gulp.task('server', () => {
  return run('nodemon index.js').exec();
});

gulp.task('uri', () => {
  gulp.src(__filename)
    .pipe(open({uri: 'http://localhost:3000'}));
});

gulp.task('build', ['scripts', 'sass', 'html', 'images', 'assets']);

gulp.task('watch', ['build'], () => {
  livereload.listen();
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/styles/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/images/**/*', ['images']);
});

gulp.task('default', ['serve']);
