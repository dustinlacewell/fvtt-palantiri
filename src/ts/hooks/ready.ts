import ModuleHud from "@src/ModuleHud";
import buttons from "@src/buttons";

Hooks.once('ready', async function() {
    new ModuleHud(buttons);
});
