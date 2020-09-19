import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import React from "react";
import { View } from "./Themed";

export default (props: {message: PrivmsgMessage}) => {
    return <View>
        {props.message.messageText}
    </View>;
}