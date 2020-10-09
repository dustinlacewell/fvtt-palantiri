import gulp from "gulp";
import sass from "gulp-sass";
import path from "path";

import { task } from "./lib";
import settings from "./settings";
const { sourcePath, buildPath } = settings;


const styles = task('styles', () => gulp
    .src(`${sourcePath}/styles/*.scss`)
    .pipe(sass())
    .pipe(gulp.dest(buildPath)));

const html = task('html', () => gulp
    .src(`${sourcePath}/templates/*.html`)
    .pipe(gulp.dest(path.join(buildPath, "templates"))));

const images = task("images", () => gulp
    .src(`${sourcePath}/assets/*.{png,jpg,gif,js}`)
    .pipe(gulp.dest(buildPath)));

const fonts = task("fonts", () => gulp
    .src(`${sourcePath}/assets/fonts/*}`)
    .pipe(gulp.dest(buildPath)));

const defaultTask = task("static", gulp
    .series([images, fonts, html, styles]));

export {
    styles, html, images,
    defaultTask as default,
}
