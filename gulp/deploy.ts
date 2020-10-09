import fs from "fs";
import path from "path";
import gulp from "gulp";
import until from "gulp-until";
import del from "del";

import settings from "./settings";
import { task } from "./lib";

const { name, buildPath } = settings;
const deployPath = path.join(settings.deployPath, name);

const clean = task("deploy:clean", async () =>
    del.sync(deployPath, { force: true }));

const copy = task("deploy:copy", () => gulp
    .src([`${buildPath}/**/*`])
    .pipe(until(() => fs.existsSync(buildPath)))
    .pipe(gulp.dest(deployPath)));

const defaultTask = task("deploy", gulp
    .series([clean, copy]));

export {
    clean, copy,
    defaultTask as default
};
