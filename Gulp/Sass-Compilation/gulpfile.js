const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', () => {
  return gulp.src('src/styles/sass/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest('src/styles'));
});

gulp.task('watch-sass', ['sass'], () => {
  gulp.watch('src/styles/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['watch-sass']);
