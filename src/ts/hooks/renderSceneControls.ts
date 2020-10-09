import ShowDialog from "@src/ShowDialog";

Hooks.on('renderSceneControls', (_: any, html: JQuery<HTMLElement>) => {
    const searchBtn = $(`
<li class="scene-control">
  <i class="fas fa-question"></i>
</li>`);
    html.append(searchBtn);
    searchBtn[0].addEventListener('click', evt => {
        evt.stopPropagation();
        ShowDialog();
    });
});
