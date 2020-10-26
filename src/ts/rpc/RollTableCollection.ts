import EntityCollection from "./EntityCollection";



export default class RollTableCollection extends EntityCollection<RollTable> {
    constructor() {
        super("tables", RollTable.create);
    }

    get collection(): Collection<RollTable> {
        return game.tables;
    }
}

