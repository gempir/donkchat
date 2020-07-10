import { Dispatch } from "react";
import { ChatConfigs } from "../../models/Configs";

export default (cfgs: ChatConfigs): any => (dispatch: Dispatch<object>) => {
    dispatch({
        type: 'SET_CFGS',
        chatConfigs: cfgs
    });
}