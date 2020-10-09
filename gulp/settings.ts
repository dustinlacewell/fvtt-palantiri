import fs from "fs-extra";

const packageSettings = fs.readJSONSync("package.json");

export default {
    ...packageSettings.gulp,
    name: packageSettings.name,
    version: packageSettings.version,
    description: packageSettings.description,
}
