const { src, dest, task, watch, series } = require('gulp');
const bable = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));

task("styles", function () {
    return src('./FrontEndDev/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./wwwroot/css/compiledscss'));
});

task("react", function () {
    return src('./FrontEndDev/reactapp/components/*.js')
        .pipe(bable({ presets: ['@babel/preset-env', '@babel/preset-react'] }))
        .pipe(dest('./wwwroot/js/compiledreact'))
})

function watchFiles() {
    watch('./FrontEndDev/reactapp/components/*.js', series('react'))
    watch('./FrontEndDev/styles/**/*.scss', series('styles'))
}

exports.watch = watchFiles
exports.default = series('styles', 'react', watchFiles)