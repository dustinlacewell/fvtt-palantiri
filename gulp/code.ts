import path from "path";

import settings from "./settings";
import { bundle, task } from "./lib";

const { entrypoint, sourcePath, buildPath, standalone, debug } = settings;

const defaultTask = task("code", () =>
    bundle({
        src: path.join(sourcePath, entrypoint),
        dst: path.join(buildPath, "module.js"),
        standalone: standalone ?? "mt",
        debug: debug ?? false,
    }));

export { defaultTask as default };
