export default function registerSettings() {
    game.settings.register("ModuleTemplate", "YesNoQuestion", {
        name: "ModuleTemplate.YesNoQuestion.Text",
        scope: "client",
        config: true,
        type: String,
        default: "Choose wisely!",
    });
    game.settings.register("ModuleTemplate", "YesResult", {
        name: "ModuleTemplate.YesResult.Text",
        scope: "client",
        config: true,
        type: String,
        default: "You chose... poorly",
    });
    game.settings.register("ModuleTemplate", "NoResult", {
        name: "ModuleTemplate.NoResult.Text",
        scope: "client",
        config: true,
        type: String,
        default: "You chose... wisely!",
    });
}
