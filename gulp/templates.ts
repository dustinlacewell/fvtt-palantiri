import glob from "glob";
import gulp from "gulp";
import file from "gulp-file";

import { task } from "./lib";
import settings from "./settings";


const defaultTask = task("templates", () => {
    var templates = glob.sync("src/templates/**/*.html");
    var json = JSON.stringify(templates, null, 2);
    return file("templates/templates.json", json, { src: true })
        .pipe(gulp.dest(settings.sourcePath));
});

export { defaultTask as default };
