import EntityCollection from "./EntityCollection";



export default class ActorCollection extends EntityCollection<Actor> {
    constructor() {
        super("actors", Actor.create);
    }

    get collection(): Collection<Actor> {
        return game.actors;
    }
}

