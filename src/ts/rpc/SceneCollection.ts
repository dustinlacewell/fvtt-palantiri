import EntityCollection from "./EntityCollection";



export default class SceneCollection extends EntityCollection<Scene> {
    constructor() {
        super("scenes", Scene.create);
    }

    get collection(): Collection<Scene> {
        return game.scenes;
    }
}

