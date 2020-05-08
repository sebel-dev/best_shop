const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps"); //zamienia wskazanie linii na plik scss a nie css w chromie
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const notifier = require('node-notifier');


sass.compiler = require('sass');


function serversync(cb) {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        browser: "chrome.exe"
    });
    cb();
}

function showError(err) {
    console.log(err.messageFormatted)
    notifier.notify({
        title: 'SASS error',
        message: err.messageFormatted
    });
}

function css() {
    return gulp.src('./scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: "expanded"}).on('error', showError)) //było sass.logError ale piszemy naszą funkcję showError dla node-notifiera
        .pipe(autoprefixer({})) //prefixy dodajemy do css czyli jak już z scss zrobi nam css
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
}

function watch() {
    gulp.watch('./scss/**/*.scss', gulp.series(css)) //jak się zmieni jakiś plik .scss ze ścieżki to odpala css
    gulp.watch("./*.html").on('change', browserSync.reload);
}
module.exports.css = css;
module.exports.watch = watch;

// module.exports.default = gulp.series() //w nawiasach nazwy zadań po przecinku, series odpala sekwencyjnie
module.exports.default = gulp.parallel(serversync, css, watch) //w nawiasach nazwy zadań po przecinku, parallel odpala wszystkie jedocześnie


