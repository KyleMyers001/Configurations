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
  gulp.src('src/*.html')
    .pipe(headerfooter.header('src/partials/header.html'))
    .pipe(headerfooter.footer('src/partials/footer.html'))
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});

gulp.task('images', () => {
  gulp.src('src/images/*').pipe(imagemin()).pipe(gulp.dest('dist/images'));
});

gulp.task('sass', () => {
  return gulp.src('src/styles/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename(function(path) {
      path.extname = '.min.css'
    }))
    .pipe(gulp.dest('dist/styles'))
    .pipe(livereload());
});

gulp.task('scripts', () => {
  gulp.src('src/scripts/*.js')
    .pipe(uglify().on('error', function() { log.error('test'); }))
    .pipe(rename(function(path) {
      path.extname = '.min.js'
    }))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(livereload());
});

gulp.task('server', () => {
  return run('node index.js').exec();
});

gulp.task('uri', function(){
  gulp.src(__filename)
    .pipe(open({uri: 'http://localhost:3000'}));
});

gulp.task('watch', ['scripts', 'sass', 'html', 'images'], () => {
  gulp.watch('src/scripts/*.js', ['scripts']);
  gulp.watch('src/styles/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/images/*', ['images']);
});

gulp.task('serve', ['uri', 'watch'], () => {
  livereload.listen();
  gulp.start('server');
});

gulp.task('default', ['serve']);
