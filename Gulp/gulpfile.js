const gulp = require('gulp');
const sass = require('gulp-sass');
const sassDirectory = 'src/styles/sass/*.scss';
const stylesDirectory = 'src/styles';
const allSassDirectories = 'src/styles/sass/**/*.scss';

gulp.task('sass', () => {
  return gulp.src(sassDirectory)
    .pipe(sass())
    .pipe(gulp.dest(stylesDirectory));
});

gulp.task('watch-sass', ['sass'], () => {
  gulp.watch(allSassDirectories, ['sass']);
});

gulp.task('default', ['watch-sass']);
