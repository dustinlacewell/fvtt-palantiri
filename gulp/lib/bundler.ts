import path from "path";
import gulp from "gulp";
import babelify from "babelify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import sourcemaps from "gulp-sourcemaps";
import tsify from "tsify";
import terser from "gulp-terser";
import * as gutils from "gulp-util";

import browserify, { BrowserifyObject } from "browserify";


export class BundleOptions {
    src: string;
    dst: string;
    standalone?: string;
    vendors?: string[];
    includeExternal?: boolean = true;
    debug?: boolean;
}

export function transformBundle(bundler: BrowserifyObject) {
    return bundler
        .plugin(tsify)
        .transform(babelify.configure({
            presets: [
                ["@babel/preset-env"],
                "proposal-typescript",
                "@babel/preset-typescript"
            ],
            plugins: [
                ["@babel/plugin-transform-runtime"],
                ["module-resolver", {
                    "root": "./",
                    "alias": {
                        "utils": "./src/ts/utils",
                        "@src": "./src/ts",
                        "@hooks": "./src/ts/hooks",
                        "templates": "./src/templates/templates.json",
                        "package": "./package.json",
                    }
                }],
                ["@babel/proposal-pipeline-operator", {
                    "proposal": "minimal"
                }]
            ],
            extensions: [".ts", ".js"],
        }));
}

export function createBundler(options: BundleOptions) {
    const sourceFile = path.basename(options.src);
    const sourcePath = path.dirname(options.src);

    const bundleOptions = {
        basedir: sourcePath + "/",
        debug: options?.debug ?? true,
        entries: [sourceFile],
        extensions: [".ts", ".js"],
        bundleExternal: true,
        standalone: options?.standalone ?? path.basename(options.src, ".ts"),
    };

    gutils.log(bundleOptions);

    let bundler = browserify(bundleOptions);

    if (options.vendors) {
        for (let vendor of options.vendors) {
            gutils.log(`Excluding vendor: ${vendor}`);
            bundler = bundler.exclude(vendor);
        }
    }

    return bundler;
}

export function bundle(options: BundleOptions) {
    const bundler = createBundler(options);

    let bundle = transformBundle(bundler)
        .bundle()
        .pipe(source(path.basename(options.dst)))
        .pipe(buffer());

    if (options.debug) {
        bundle = bundle.pipe(sourcemaps.init({ loadMaps: true }));
    }

    if (!options.debug) {
        bundle = bundle.pipe(terser());
    }

    if (options.debug) {
        bundle = bundle.pipe(sourcemaps.write());
    }

    const buildPath = path.dirname(options.dst);
    return bundle.pipe(gulp.dest(buildPath));
}
