import { ChatConfigs } from "../models/Configs";
import { AnyAction } from "redux";
import ChatClient from "./../twitch/ChatClient";

export const createInitialState = () => {
    return {
        chatConfigs: new ChatConfigs(),
        chatClient: new ChatClient(),
    }
}

export const reducer = (state: any, action: AnyAction) => {
    switch (action.type) {
        case "SET_CFGS":
            return { ...state, chatConfigs: action.chatConfigs }
        default:
            return state;
    }
};

export interface ReduxStore {
    chatConfigs: ChatConfigs
    chatClient: ChatClient
}

