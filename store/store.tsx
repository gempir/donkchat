import { ChatConfigs } from "../models/Configs";
import { AnyAction } from "redux";
import ChatClient from "./../twitch/ChatClient";

export const createInitialState = () => {
    return {
        chatConfigs: new ChatConfigs(),
        chatClient: new ChatClient(),
        bttvChannelEmotes: new Map(),
    }
}

export const reducer = (state: any, action: AnyAction) => {
    switch (action.type) {
        case "SET_CFGS":
            return { ...state, chatConfigs: action.chatConfigs }
        case "SET_BTTV_CHANNEL_EMOTES":
            const emotes = new Map(state.bttvChannelEmotes);
            emotes.set(action.channelID, action.emotes);

            return { ...state, bttvChannelEmotes: emotes }
        default:
            return { ...state };
    }
};

export type BttvChannelEmotes = Map<string, Array<any>>;

export interface Store {
    chatConfigs: ChatConfigs
    chatClient: ChatClient
    bttvChannelEmotes: BttvChannelEmotes
}