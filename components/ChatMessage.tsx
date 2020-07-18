import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import React from "react";
import { Text } from "./Themed";
import { connect } from "react-redux";
import { Store, ThirdPartyEmotes } from "./../store/store";
import FastImage from "react-native-fast-image/dist/index.js";

class ChatMessage extends React.Component<{ message: PrivmsgMessage, thirdPartyEmotes: ThirdPartyEmotes }> {
    render() {
        const msg = this.props.message;
        const renderMessage = [];

        let replaced;
        let buffer = "";

        for (var x = 0, c = ""; c = msg.messageText.charAt(x); x++) {
            replaced = false;
            for (const emote of msg.emotes) {
                if (emote.startIndex === x) {
                    replaced = true;
                    renderMessage.push(
                        <FastImage key={x} source={{
                            uri: `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`,
                        }} />
                    );
                    // renderMessage.push(<Image
                    //     key={x}
                    //     style={{ width: 28, height: 28 }}
                    //     source={{
                    //         uri: `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`,
                    //     }}
                    // />);
                    x += emote.endIndex - emote.startIndex - 1;
                }
            }

            if (!replaced) {
                if (c !== " " && x !== msg.messageText.length - 1) {
                    buffer += c;
                    continue;
                }

                let emoteFound = false;

                if (this.props.thirdPartyEmotes.has(msg.channelID)) {
                    const emotes = this.props.thirdPartyEmotes.get(msg.channelID) || [];
                    for (const emote of emotes) {
                        if (buffer.trim() === emote.code) {
                            emoteFound = true;
                            renderMessage.push(<FastImage key={x} style={{ width: 28, height: 28 }}
                                source={{
                                    uri: emote.url,
                                }} />
                            );

                            break;
                        }
                    }
                }

                if (!emoteFound) {
                    renderMessage.push(buffer);
                    buffer = "";
                }
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

export default connect((state: Store) => ({
    thirdPartyEmotes: state.thirdPartyEmotes,
}))(ChatMessage);