import AsyncStorage from '@react-native-community/async-storage';
import { Dispatch } from "react";
import { ChatConfig, ChatConfigs } from "../../models/Configs";
import { Store } from "./../store";

export default (cfg: ChatConfig) => (dispatch: Dispatch<object>, getState: (value: void) => Store) => {
    const cfgs = getState().chatConfigs.createNewWith(cfg);

    getState().chatClient.join(cfg.channel);

    dispatch({
        type: 'SET_CFGS',
        chatConfigs: cfgs
    });
    save(cfgs);
}

const save = async (cfgs: ChatConfigs) => {
    try {
        await AsyncStorage.setItem("@chatConfigs", JSON.stringify(cfgs))
    } catch (e) {
        console.error(e);
    }
}