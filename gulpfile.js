
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');

gulp.task('build-app', function() {
  return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('build'))
})

gulp.task('default', ['build-app']);
