import { tp } from 'utils';
import HudHandle from './HudHandle';


export class ModuleButton {
    id: string;
    icon?: string;
    label?: string;
    callback: () => Promise<void>;
}

export default class ModuleHud extends Application {
    buttons: ModuleButton[];

    constructor(buttons: ModuleButton[], options: ApplicationOptions = {}) {
        super(options);
        this.buttons = buttons;
        this.render(true);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: tp("hud"),
            id: "module-hud",
            scale: 1,
            popOut: false,
            minimizable: false,
            resizable: false,
            dragDrop: [],
            tabs: [],
            scrollY: [],
        });
    }

    get title() {
        return "Module HUD";
    }

    getData() {
        return {
            buttons: this.buttons,
        };
    }

    activateListeners(html: JQuery) {
        // HUD handle
        html.find("#mt-hud-handle").mousedown(HudHandle);

        // HUD buttons
        this.buttons.forEach(b => html.find(`#${b.id}`).click(b.callback));

        // bail if no saved position
        if (!(game.user.data.flags.ModuleTemplate &&
            game.user.data.flags.ModuleTemplate.hudPos))
            return;

        // move to saved position
        const pos = game.user.data.flags.ModuleTemplate.hudPos;
        html.css("left", pos.left);
        html.css("top", pos.top);
    }
}
