import { AsyncStorage } from "react-native";
import { useDispatch } from "react-redux";
import { ChatConfig, ChatConfigs } from "../models/Configs";

export default () => {
    const dispatch = useDispatch();

    try {
        AsyncStorage.getItem('@chatConfigs').then(jsonValue => {
            const configs = jsonValue != null ? JSON.parse(jsonValue) : null;

            let input: Array<ChatConfig> = [];
            if (typeof configs === "object") {
                input = Object.values(configs.configs);
            }

            dispatch({
                type: 'SET_CFGS',
                chatConfigs: new ChatConfigs(input)
            });
        })

    } catch (e) {
        console.error(e);
    }
}