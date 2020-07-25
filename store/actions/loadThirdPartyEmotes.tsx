import { Dispatch } from "react";
import { Store, ThirdPartyEmote } from "../store";

export default function (channelID: string) {
    return function (dispatch: Dispatch<object>, getState: (value: void) => Store) {
        return new Promise((resolve, reject) => {
            const bttvChannel = fetch("https://api.betterttv.net/3/cached/users/twitch/" + channelID).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response
                } else {
                    var error = new Error(response.statusText)
                    throw error
                }
            }).then((response) => {
                return response.json();
            }).then((json) => {
                const bttvEmotes = json.channelEmotes.concat(json.sharedEmotes);
                const emotes: Array<ThirdPartyEmote> = [];
                for (const emote of bttvEmotes) {
                    emotes.push({
                        code: emote.code,
                        url: `https://cdn.betterttv.net/emote/${emote.id}/1x`
                    });
                }

                dispatch({
                    type: "SET_THIRD_PARTY_EMOTES",
                    emotes: [...getState().thirdPartyEmotes.get(channelID) ?? [], ...emotes],
                    channelID: channelID,
                });
            });

            const ffzChannel = fetch("https://api.frankerfacez.com/v1/room/id/" + channelID).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response
                } else {
                    var error = new Error(response.statusText)
                    throw error
                }
            }).then((response) => {
                return response.json();
            }).then((json) => {
                const ffzEmotes = Object.values(json.sets).map((set: any) => set.emoticons).flat();
                const emotes: Array<ThirdPartyEmote> = [];
                for (const emote of ffzEmotes) {
                    emotes.push({
                        code: emote.name,
                        url: emote.urls[1].replace("//cdn.frankerfacez.com", "https://cdn.frankerfacez.com")
                    });
                }

                dispatch({
                    type: "SET_THIRD_PARTY_EMOTES",
                    emotes: [...getState().thirdPartyEmotes.get(channelID) ?? [], ...emotes],
                    channelID: channelID,
                });
            });

            Promise.all([bttvChannel, ffzChannel]).then(resolve).catch(reject);
        });
    };
}