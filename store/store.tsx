import { ChatConfigs } from "../models/Configs";
import { AnyAction } from "redux";
import ChatClient from "./../twitch/ChatClient";

export const createInitialState = () => {
    return {
        chatConfigs: new ChatConfigs(),
        chatClient: new ChatClient(),
        thirdPartyEmotes: new Map(),
    }
}

export const reducer = (state: any, action: AnyAction) => {
    switch (action.type) {
        case "SET_CFGS":
            return { ...state, chatConfigs: action.chatConfigs }
        case "SET_THIRD_PARTY_EMOTES":
            const emotes = new Map(state.thirdPartyEmotes);
            emotes.set(action.channelID, action.emotes);

            return { ...state, thirdPartyEmotes: emotes }
        default:
            return { ...state };
    }
};

export type ThirdPartyEmotes = Map<string, Array<ThirdPartyEmote>>;

export type ThirdPartyEmote = {
    code: string;
    url: string;
}

export interface Store {
    chatConfigs: ChatConfigs
    chatClient: ChatClient
    thirdPartyEmotes: ThirdPartyEmotes
}