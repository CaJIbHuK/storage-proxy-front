
const gulp = require('gulp');
const webserver = require('gulp-webserver');

module.exports = function (src, port) {
  return gulp.src(src)
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      port: port
    }));
};
