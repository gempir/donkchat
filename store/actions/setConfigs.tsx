import { Dispatch } from "react";
import { ChatConfigs } from "../../models/Configs";

export default (cfgs: ChatConfigs) => (dispatch: Dispatch<object>) => {
    dispatch({
        type: 'SET_CFGS',
        chatConfigs: cfgs
    });
}