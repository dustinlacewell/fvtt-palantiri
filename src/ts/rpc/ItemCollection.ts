import EntityCollection from "./EntityCollection";



export default class ItemCollection extends EntityCollection<Item> {
    constructor() {
        super("items", Item.create);
    }

    get collection(): Collection<Item> {
        return game.items;
    }
}

