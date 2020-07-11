import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import React from "react";
import { Image } from "react-native";
import { Text } from "./Themed";

export default class ChatMessage extends React.Component<{ message: PrivmsgMessage }> {
    render() {
        const msg = this.props.message;
        const renderMessage = [];

        let replaced;
        for (var x = 0, c = ''; c = msg.messageText.charAt(x); x++) {
            replaced = false;
            for (const emote of msg.emotes) {
                if (emote.startIndex === x) {
                    replaced = true;
                    renderMessage.push(<Image
                        key={x}
                        style={{ width: 28, height: 28 }}
                        source={{
                            uri: `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`,
                        }}
                    />);
                    x += emote.endIndex - emote.startIndex - 1;
                }
            }

            if (!replaced) {
                renderMessage.push(c);
            }
        }

        return (
            <Text>
                <Text style={{ color: this.props.message.colorRaw || undefined, fontWeight: "bold" }}>{this.props.message.displayName}</Text>: {renderMessage}
            </Text>
        );
    }
}