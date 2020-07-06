import { ChatConfigs } from "../models/Configs";
import ChatClient from "./../twitch/ChatClient";

export const createInitialState = () => {
    return {
        chatConfigs: new ChatConfigs(),
        chatClient: new ChatClient(),
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