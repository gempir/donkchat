import { Dispatch } from "react";
import { Store, Badge, Badges } from "../store";

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
                updateBadges(json, getState, dispatch, resolve, "global");
            }).catch(reject);
        });
    };
}

function updateBadges(json: any, getState: (value: void) => Store, dispatch: Dispatch<object>, resolve: any, badgeType: string) {
    const badges: Badges = getState().badges;

    const newBadges: Badges = { [badgeType]: { ...badges["global"] } };

    for (const [name, badgeData] of Object.entries(json.badge_sets)) {
        const badge: Badge = {
            versions: {},
        };

        // @ts-ignore
        for (const [versionName, versionData] of Object.entries(badgeData.versions)) {
            // @ts-ignore
            badge.versions[versionName] = versionData;
        }

        if (!newBadges[badgeType]) {
            newBadges[badgeType] = {};
        }
        newBadges[badgeType][name] = badge;
    }

    dispatch({
        type: "SET_BADGES",
        badges: newBadges,
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
                updateBadges(json, getState, dispatch, resolve, channelID);
            }).catch(reject);
        });
    };
}