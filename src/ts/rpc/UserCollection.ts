import EntityCollection from "./EntityCollection";



export default class UserCollection extends EntityCollection<User> {
    constructor() {
        super("users", User.create);
    }

    get collection(): Collection<User> {
        return game.users;
    }
}

