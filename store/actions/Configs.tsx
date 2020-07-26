import AsyncStorage from '@react-native-community/async-storage';
import { Dispatch } from "react";
import { ChatConfig, ChatConfigs } from "../../models/Configs";
import { Store } from "../store";

export const addChat = (cfg: ChatConfig): any => (dispatch: Dispatch<object>, getState: (value: void) => Store) => {
    const cfgs = getState().chatConfigs.createNewWith(cfg);
    const chatClient = getState().chatClient;
    chatClient.join(cfg.channel);

    dispatch({
        type: 'SET_CFGS',
        chatConfigs: cfgs
    });
    persistConfig(cfgs);
}

export const setConfigs = (cfgs: ChatConfigs): any => (dispatch: Dispatch<object>) => {
    dispatch({
        type: 'SET_CFGS',
        chatConfigs: cfgs
    });

    persistConfig(cfgs);
}

const persistConfig = async (cfgs: ChatConfigs) => {
    try {
        await AsyncStorage.setItem("@chatConfigs", JSON.stringify(cfgs))
    } catch (e) {
        console.error(e);
    }
};