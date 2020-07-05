import { ChatConfig } from "../../models/Configs";
import { Dispatch } from "react";
import { Store } from "./../store";

export default (cfg: ChatConfig) => (dispatch: Dispatch<object>, getState: (value: void) => Store) => {
    const cfgs = getState().chatConfigs.createNewWith(cfg);

    dispatch({
        type: 'SET_CFGS',
        chatConfigs: cfgs
    });
}