import EntityCollection from "./EntityCollection";



export default class PlaylistCollection extends EntityCollection<Playlist> {
    constructor() {
        super("users", Playlist.create);
    }

    get collection(): Collection<Playlist> {
        return game.playlists;
    }
}

