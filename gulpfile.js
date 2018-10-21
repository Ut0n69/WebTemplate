const gulp = require('gulp');
const ejs = require('gulp-ejs');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssDeclarationSorter = require('css-declaration-sorter');
const mqpacker = require('css-mqpacker');
const fs = require('fs');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

// babel
gulp.task('browserify', () => {
  browserify({
    entries: './src/js/main.js',
  })
    .transform(babelify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('browserify:watch', ['browserify'], () => {
  gulp.watch('./src/js/*.js', ['browserify']);
  gulp.watch('./src/js/**/*.js', ['browserify']);
});

// ejs
gulp.task('ejs', () => {
  const data = './src/views/pages.json';
  const json = JSON.parse(fs.readFileSync(data, 'utf8'));

  for (let i = 0; i < json.pages.length; i++) {
    const {
      name,
    } = json.pages[i];

    gulp.src(`./src/views/pages/${name}.ejs`)
      .pipe(ejs({
        pageData: json.pages[i],
      }))
      .pipe(rename(`${name}.html`))
      .pipe(gulp.dest('./public/'));
  }
});

gulp.task('ejs:watch', ['ejs'], () => {
  gulp.watch('./src/views/pages/*.ejs', ['ejs']);
  gulp.watch('./src/views/common/*.ejs', ['ejs']);
  gulp.watch('./src/views/pages.json', ['ejs']);
});

// sass
gulp.task('sass', () => {
  const plugin = [
    autoprefixer({
      browsers: [
        'last 2 versions',
      ],
    }),
    cssDeclarationSorter({
      order: 'smacss',
    }),
    mqpacker(),
  ];
  gulp.src('./src/sass/style.scss')
    .pipe(postcss(plugin))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('sass:watch', () => {
  gulp.watch('./src/sass/*.scss', ['sass']);
  gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['browserify', 'browserify:watch', 'ejs', 'ejs:watch', 'sass', 'sass:watch']);
