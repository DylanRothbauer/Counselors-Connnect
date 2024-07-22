const { src, dest, task, watch, series } = require('gulp');
const { exec } = require('child_process');
const webpack = require('webpack');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const path = require('path');

task("Styles", function () {
    return src('./FrontEndDev/styles/**/*.scss')
        .pipe(sass({ includePaths: './FrontEndDev/styles' }).on('error', sass.logError))
        .pipe(rename({ extname: ".css" }))
        .pipe(dest('./wwwroot/css/compiledscss'));
});

task('React', function (cb) {
    exec('npm run build-react', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error executing npm run build-react: ${stderr}`);
            cb(err);
            return;
        }
        console.log(`npm run wpb output: ${stdout}`);
        cb();
    });
});
task('Watch', function () {
    watch(['./FrontEndDev/reactapp/components/*.js'], series('React'));
    watch(['./FrontEndDev/styles/**/*.scss'], series('Styles'));
});
