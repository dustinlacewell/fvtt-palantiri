import EntityCollection from "./EntityCollection";



export default class JournalCollection extends EntityCollection<JournalEntry> {
    constructor() {
        super("journal", JournalEntry.create);
    }

    get collection(): Collection<JournalEntry> {
        return game.journal;
    }
}

