import path from "path";
import gulp from "gulp";

import settings from "./settings";
import { task } from "./lib"

const watch = task("watch", () => {
    gulp.watch([
        path.join(settings.sourcePath, "/**/*"),
        "!" + path.join(settings.sourcePath, "/templates/templates.json"),
    ], gulp.series(["default"]));
})

export { watch as default }
