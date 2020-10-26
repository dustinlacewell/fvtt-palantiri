import EntityCollection from "./EntityCollection";



export default class FolderCollection extends EntityCollection<Folder> {
    constructor() {
        super("folders", Folder.create);
    }

    get collection(): Collection<Folder> {
        return game.folders;
    }
}

