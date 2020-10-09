import gulp from "gulp";
import browserify from "browserify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import sourcemaps from "gulp-sourcemaps";

import { task } from "./lib";
import settings from "./settings";
const { vendors, buildPath } = settings;

const defaultTask = task("vendor", () => {
    const b = browserify({
        debug: true
    });

    vendors.forEach(lib => {
        b.require(lib);
    });

    return b.bundle()
        .pipe(source('vendor.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath));
});

export { defaultTask as default };
