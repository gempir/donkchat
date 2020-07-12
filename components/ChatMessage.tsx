import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import React from "react";
import { Image } from "react-native";
import { Text } from "./Themed";
import { connect } from "react-redux";
import { Store, BttvChannelEmotes } from "./../store/store";

class ChatMessage extends React.Component<{ message: PrivmsgMessage, bttvChannelEmotes: BttvChannelEmotes }> {
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

        if (this.props.bttvChannelEmotes.has(msg.channelID)) {
            const emotes = this.props.bttvChannelEmotes.get(msg.channelID) || [];
            for (const emote of emotes) {
                // const regex = new RegExp(`\\b(${emote.code})\\b`, "g");
                const index = msg.messageText.indexOf(emote.code);
                if (index !== -1) {
                    renderMessage[index] = <Image key={index} style={{ width: 28, height: 28 }}
                        source={{
                            uri: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
                        }} />

                    for (let i = index + 1; i < index + emote.code.length; i++) {
                        delete renderMessage[i];
                    }
                }
            }
        }

        return (
            <Text>
                <Text style={{ color: this.props.message.colorRaw || undefined, fontWeight: "bold" }}>{this.props.message.displayName}</Text>: {renderMessage}
            </Text>
        );
    }
}

export default connect((state: Store) => ({
    bttvChannelEmotes: state.bttvChannelEmotes,
}))(ChatMessage);