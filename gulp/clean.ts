import del from "del";

import { task } from "./lib";
import settings from "./settings";

const defaultTask = task("clean", async () => del.sync(settings.buildPath));

export { defaultTask as default }
