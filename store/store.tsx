import { ChatConfigs } from "../models/Configs";
import { ChatClient } from "dank-twitch-irc";

export const createInitialState = () => {

    return {
        chatConfigs: new ChatConfigs(),
        chatClient: new ChatClient({ connection: { type: "websocket", secure: true } }),
    }
}

export const reducer = (state: object, action: object) => {
    switch (action.type) {
        case "SET_CFGS":
            return { ...state, chatConfigs: action.chatConfigs }
        default:
            return { ...state };
    }
};

export interface Store {
    chatConfigs: ChatConfigs
    chatClient: ChatClient
}