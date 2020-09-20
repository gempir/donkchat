import { useEffect } from "react";
import { AsyncStorage } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ChatConfig, ChatConfigs } from "../models/Configs";
import { ReduxStore } from "../store/store";

export default () => {
    const dispatch = useDispatch();

    const chatClient = useSelector((state: ReduxStore) => state.chatClient);

    useEffect(() => {
        try {
            AsyncStorage.getItem('@chatConfigs').then(jsonValue => {
                const configs = jsonValue != null ? JSON.parse(jsonValue) : null;
    
                let input: Array<ChatConfig> = [];
                if (typeof configs === "object") {
                    input = Object.values(configs.configs);
                }
    
                const cfgs = new ChatConfigs(input);
                dispatch({
                    type: 'SET_CFGS',
                    chatConfigs: cfgs,
                });

                for (const cfg of cfgs.toArray()) {
                    chatClient.join(cfg.channel);
                }
            })
    
        } catch (e) {
            console.error(e);
        }
    }, []);
}