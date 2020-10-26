import EntityCollection from "./EntityCollection";
import SceneCollection from "./SceneCollection";
import UserCollection from "./UserCollection";
import ActorCollection from "./ActorCollection";
import PlaylistCollection from "./PlaylistCollection";
import RollTableCollection from "./RollTableCollection";
import ChatMessageCollection from "./ChatMessageCollection";
import JournalCollection from "./JournalCollection";
import ItemCollection from "./ItemCollection";
import FolderCollection from "./FolderCollection";


class RPCServer {
    modules: { [key: string]: EntityCollection<Entity> };

    constructor() {
        this.modules = {};
    }

    add(mod: EntityCollection<Entity>) {
        if (mod.ns) {
            this.modules[mod.ns] = mod;
        }
    }

    run(ns: string, method: string, args: any[]) {
        console.log(`Running ${ns}.${method}`);
        const mod = this.modules[ns];
        if (!mod) {
            console.log(`Couldn't find RPC namespace: ${ns}`);
            return;
        }

        const callback = mod[method];
        if (callback == undefined) {
            console.log(`Couldn't find RPC procedure: ${ns}.${name}`);
            return;
        }

        return callback.apply(mod, args || null);
    }
}

const server = new RPCServer();

server.add(new ActorCollection());
server.add(new ChatMessageCollection());
server.add(new FolderCollection());
server.add(new ItemCollection());
server.add(new JournalCollection());
server.add(new PlaylistCollection());
server.add(new RollTableCollection());
server.add(new SceneCollection());
server.add(new UserCollection());

export default server;
