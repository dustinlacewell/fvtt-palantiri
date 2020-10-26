import EntityCollection from "./EntityCollection";



export default class ChatMessageCollection extends EntityCollection<ChatMessage> {
    constructor() {
        super("messages", ChatMessage.create);
    }

    get collection(): Collection<ChatMessage> {
        return game.messages;
    }
}

