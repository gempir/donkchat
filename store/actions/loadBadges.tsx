import { Dispatch } from "react";
import { Store, Badge } from "../store";

export function loadGlobalBadges() {
    return function (dispatch: Dispatch<object>, getState: (value: void) => Store) {
        return new Promise((resolve, reject) => {
            fetch("https://badges.twitch.tv/v1/badges/global/display").then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response
                } else {
                    var error = new Error(response.statusText)
                    throw error
                }
            }).then((response) => {
                return response.json();
            }).then((json) => {
                updateBadges(json, getState, dispatch, resolve);
            }).catch(reject);
        });
    };
}

function updateBadges(json: any, getState: (value: void) => Store, dispatch: Dispatch<object>, resolve: any) {
    const badges: Map<string, Badge> = getState().badges;
    for (const [name, emoteData] of Object.entries(json.badge_sets)) {
        const badge: Badge = {
            versions: new Map(),
        };

        for (const [versionName, versionData] of Object.entries(emoteData.versions)) {
            badge.versions.set(versionName, versionData);
        }

        badges.set(name, badge);
    }

    dispatch({
        type: "SET_BADGES",
        badges: new Map(badges),
    });

    resolve();
}

export function loadChannelBadges(channelID: string) {
    return function (dispatch: Dispatch<object>, getState: (value: void) => Store) {
        return new Promise((resolve, reject) => {
            fetch(`https://badges.twitch.tv/v1/badges/channels/${channelID}/display`).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response
                } else {
                    var error = new Error(response.statusText)
                    throw error
                }
            }).then((response) => {
                return response.json();
            }).then((json) => {
                updateBadges(json, getState, dispatch, resolve);
            }).catch(reject);
        });
    };
}
