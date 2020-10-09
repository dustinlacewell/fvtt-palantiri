import { rt } from "utils";


export default async function ShowDialog() {
    const question = game.settings.get("ModuleTemplate", "YesNoQuestion");
    const yes = game.settings.get("ModuleTemplate", "YesResult");
    const no = game.settings.get("ModuleTemplate", "NoResult");

    const popup = (msg: string, title: string = "") => {
        let d = new Dialog({
            title: title,
            content: `<p>${msg}</p>`,
            buttons: {},
        });
        d.render(true);
    };

    Dialog.confirm({
        title: "A Yes or No Question",
        content: (await rt("index", { question })).outerHTML,
        yes: () => popup(yes),
        no: () => popup(no),
        defaultYes: false
    });
}
