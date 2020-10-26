export default function registerSettings() {
    game.settings.register("Palantiri", "YesNoQuestion", {
        name: "Palantiri.YesNoQuestion.Text",
        scope: "client",
        config: true,
        type: String,
        default: "Choose wisely!",
    });
    game.settings.register("Palantiri", "YesResult", {
        name: "Palantiri.YesResult.Text",
        scope: "client",
        config: true,
        type: String,
        default: "You chose... poorly",
    });
    game.settings.register("Palantiri", "NoResult", {
        name: "Palantiri.NoResult.Text",
        scope: "client",
        config: true,
        type: String,
        default: "You chose... wisely!",
    });
}
