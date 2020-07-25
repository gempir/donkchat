import { ChatConfigs } from "../models/Configs";
import { AnyAction } from "redux";
import ChatClient from "./../twitch/ChatClient";

export const createInitialState = () => {
    return {
        chatConfigs: new ChatConfigs(),
        chatClient: new ChatClient(),
        thirdPartyEmotes: new Map(),
        badges: new Map(),
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
        case "SET_BADGES":
            return { ...state, badges: action.badges }
        default:
            return { ...state };
    }
};

export type ThirdPartyEmotes = Map<string, Array<ThirdPartyEmote>>;

export type ThirdPartyEmote = {
    code: string;
    url: string;
}

export type BadgeContent = {
    image_url_1x: string;
    image_url_2x: string;
    image_url_4x: string;
    description: string;
    title: string;
    click_action: string;
    click_url: string;
    last_updated: string;
}

export type UserId = string;

export type Badge = {
    versions: { [key: string]: BadgeContent }
}

export type BadgeType = "global" | UserId;

export type Badges = { [key: string]: { [badgeName: string]: Badge } };

export interface Store {
    chatConfigs: ChatConfigs
    chatClient: ChatClient
    thirdPartyEmotes: ThirdPartyEmotes
    badges: Badges
}

