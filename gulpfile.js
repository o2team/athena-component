var gulp = require('gulp');
var rename = require('gulp-rename');
var babel = require('gulp-babel');

gulp.task('default', function () {
  return gulp.src('server.js')
    .pipe(babel())
    .pipe(rename('serverb.js'))
    .pipe(gulp.dest('./'));
});