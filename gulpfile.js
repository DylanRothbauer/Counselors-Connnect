/// <binding ProjectOpened='Watch' />
const { src, dest, task, watch, series} = require('gulp');
const webpack = require('webpack')
const rename = require('gulp-rename')
const sass = require('gulp-sass')(require('sass'));

task("Styles", function () {
    return src('./FrontEndDev/styles/**/*.scss')
        .pipe(sass({ includePaths: './FrontEndDev/styles' }).on('error', sass.logError))
        .pipe(rename({extname: ".css"}))
        .pipe(dest('./wwwroot/css/compiledscss'));
});


task('React', function () {
    return new Promise((resolve, reject) => {
        webpack(require('./FrontEndDev/reactapp/webpack.config.js'), (err, stats) => {
            if (err) {
                return reject(err)
            }
            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join('\n')))
            }
            resolve()
        })
    });

});
task('Watch', function () {
    watch(['./FrontEndDev/reactapp/components/*.js'], series('React'))
    watch(['./FrontEndDev/styles/**/*.scss'], series('Styles'))
});


