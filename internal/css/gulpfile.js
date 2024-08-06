const merge2 = require('merge2');
const gulp = require('gulp');
const transformLess = require('./build/transformLess');
const through2 = require('through2');
const path = require('path');
const fs = require('fs');
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');

const esDir = path.resolve(__dirname, './es');
const cssDir = path.resolve(__dirname, './css');

function compileCss() {
  if (fs.existsSync(esDir)) {
    fs.rmSync(esDir, {
      force: true,
      recursive: true,
    });
  }
  const less = gulp
    .src(['../../node_modules/@yh/ta404-ui/es/**/*.less'])
    .pipe(
      through2.obj(function (file, encoding, next) {
        // this.push(file.clone())
        if (
          file.path.match(/[\\/]style[\\/]index\.less$/) ||
          file.path.match(/[\\/]style[\\/]v2-compatible-reset\.less$/)
        ) {
          transformLess(file.path)
            .then((css) => {
              file.contents = Buffer.from(css);
              file.path = file.path.replace(/\.less$/, '.css');
              this.push(file);
              next();
            })
            .catch((e) => {
              console.error(e);
            });
        } else {
          next();
        }
      }),
    )
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest(esDir));
  return merge2([less]);
}

function concatCss() {
  if (fs.existsSync(cssDir)) {
    fs.rmSync(cssDir, {
      force: true,
      recursive: true,
    });
  }
  const css = gulp
    .src(['./es/**/*.css'])
    .pipe(concat('ui.css'))
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest(cssDir));
  return merge2([css]);
}

gulp.task(
  'compile-less',
  gulp.series((done) => {
    compileCss();
    done();
  }),
);
gulp.task(
  'concat-css',
  gulp.series((done) => {
    concatCss();
    done();
  }),
);
