export default function HudHandle(ev: JQuery.Event) {
    ev.preventDefault();

    let hud = $(document.body).find("#mt-hud");
    let marginLeft = parseInt(hud.css('marginLeft').replace('px', ''));
    let marginTop = parseInt(hud.css('marginTop').replace('px', ''));

    dragElement(hud.get(0));
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    function dragElement(elmnt: HTMLElement) {
        $(elmnt).mousedown(dragMouseDown);

        function dragMouseDown(e: JQuery.Event) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e: MouseEvent) {
            e = e || (window.event as MouseEvent);
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) - marginTop + 'px';
            elmnt.style.left = (elmnt.offsetLeft - pos1) - marginLeft + 'px';
            elmnt.style.position = 'fixed';
            elmnt.style.zIndex = "100";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            elmnt.onmousedown = null;
            document.onmouseup = null;
            document.onmousemove = null;
            let xPos = (elmnt.offsetLeft - pos1) > window.innerWidth ? window.innerWidth : (elmnt.offsetLeft - pos1);
            let yPos = (elmnt.offsetTop - pos2) > window.innerHeight - 20 ? window.innerHeight - 100 : (elmnt.offsetTop - pos2)
            xPos = xPos < 0 ? 0 : xPos
            yPos = yPos < 0 ? 0 : yPos
            if (xPos != (elmnt.offsetLeft - pos1) || yPos != (elmnt.offsetTop - pos2)) {
                elmnt.style.top = (yPos) + 'px';
                elmnt.style.left = (xPos) + 'px';
            }
            game.user.update({ flags: { 'ModuleTemplate': { hudPos: { top: yPos, left: xPos } } } })
        }
    }
}

