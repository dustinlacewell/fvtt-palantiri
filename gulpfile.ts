import gulp from "gulp";

import clean from "./gulp/clean";
import code from "./gulp/code";
import deploy from "./gulp/deploy";
import manifest from "./gulp/manifest";
import statics from "./gulp/static";
import templates from "./gulp/templates";
import { task } from "./gulp/lib";


const defaultTasks = gulp.series([
    clean,
    gulp.parallel([
        statics,
        manifest,
        gulp.series([templates, code])
    ]),
]);

task("build", defaultTasks);
task("default", gulp.series([defaultTasks, deploy]));

export { default as watch } from "./gulp/watch";
export { default as package } from "./gulp/package";
