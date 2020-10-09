import fs from "fs-extra";
import gulp from "gulp";
import file from "gulp-file";

import settings from "./settings";
const { name, version, description, buildPath } = settings;

import { task } from "./lib";


function getManifestPath() {
    const modulePath = "module.json";
    const systemPath = "system.json";

    if (fs.existsSync(modulePath)) {
        return modulePath;
    } else {
        return systemPath;
    }
}

function readManifest() {
    const manifestPath = getManifestPath();
    return fs.readJSONSync(manifestPath);
}

function getManifest() {
    const manifest: any = readManifest();
    manifest.name = manifest?.name ?? name;
    manifest.title = manifest?.title ?? name;
    manifest.version = manifest?.version ?? version;
    manifest.description = manifest?.description ?? description;
    return manifest;
}


const defaultTask = task("manifest", () => {
    const manifest = getManifest();
    const content = JSON.stringify(manifest, null, 2);
    return file(getManifestPath(), content, { src: true })
        .pipe(gulp.dest(buildPath));
});

export { defaultTask as default };
