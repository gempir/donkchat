import { Dispatch } from "react";
import { Store } from "./../store";

export default function (channelID: string) {
    return function (dispatch: Dispatch<object>, getState: (value: void) => Store) {
        return new Promise((resolve, reject) => {
            fetch("https://api.betterttv.net/3/cached/users/twitch/" + channelID).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response
                } else {
                    var error = new Error(response.statusText)
                    throw error
                }
            }).then((response) => {
                return response.json();
            }).then((json) => {
                dispatch({
                    type: "SET_BTTV_CHANNEL_EMOTES",
                    emotes: json.channelEmotes.concat(json.sharedEmotes),
                    channelID: channelID,
                });

                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    };
}