import yargs from "yargs";
import path from "path";
import chalk from "chalk";
import fs from "fs-extra";
import archiver from "archiver";

import settings from "./settings";
import { deptask } from "./lib";

const defaultTask = deptask("package", ["build"], async () =>
    new Promise((resolve, _) => {
        const manifest = fs.readJSONSync(path.join(settings.buildPath, "module.json"));

        if (yargs.argv.clean || yargs.argv.c) {
            console.log('Removing all packaged files');
            fs.removeSync('package');
            return;
        }

        // Ensure there is a directory to hold all the packaged versions
        fs.ensureDirSync('package');

        // Initialize the zip file
        const zipName = `${manifest.name}-v${manifest.version}.zip`;
        const zipFile = fs.createWriteStream(path.join('package', zipName));
        const zip = archiver('zip', { zlib: { level: 9 } });

        zipFile.on('close', () => {
            console.log(chalk.green(zip.pointer() + ' total bytes'));
            console.log(
                chalk.green(`Zip file ${zipName} has been written`)
            );
            return resolve();
        });

        zip.on('error', (err) => {
            throw err;
        });

        zip.pipe(zipFile);

        // Add the directory with the final code
        zip.directory(settings.buildPath, manifest.name);

        zip.finalize();
    }));

export { defaultTask as default };
