import templates from "templates";
import registerSettings from "@src/settings";

Hooks.once('init', async function() {
    registerSettings();
    await loadTemplates(templates);
});
