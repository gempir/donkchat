import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import React from "react";
import { Text, View } from "./Themed";
import { connect } from "react-redux";
import { Store, ThirdPartyEmotes, Badge } from "./../store/store";
import { Image } from "react-native";

class ChatMessage extends React.Component<{ message: PrivmsgMessage, thirdPartyEmotes: ThirdPartyEmotes, badges: Map<string, Badge> }> {
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
                            renderMessage.push(<Image key={x} style={{ width: 28, height: 28 }}
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

        const badges: Array<React.ReactNode> = [];

        for (const badge of msg.badges) {
            badges.push(
                <Image
                    key={badge.name}
                    style={{ width: 18, height: 18 }}
                    source={{
                        uri: this.props.badges.get(badge.name)?.versions.get(badge.version)?.image_url_1x,
                    }}
                />
            );
            badges.push(" ");
        }

        return (
            <Text style={{ includeFontPadding: false }}>
                {badges}<Text style={{ includeFontPadding: false, color: this.props.message.colorRaw || undefined, fontWeight: "bold" }}>{this.props.message.displayName}</Text>: {renderMessage}
            </Text>
        );
    }
}

export default connect((state: Store) => ({
    thirdPartyEmotes: state.thirdPartyEmotes,
    badges: state.badges,
}))(ChatMessage);