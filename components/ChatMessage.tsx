import { PrivmsgMessage } from "dank-twitch-irc";
import { Image } from "react-native";

export default function ChatMessage(props: { message: PrivmsgMessage }) {
    const msg = props.message;
    const renderMessage = [];

    const renderTwitchEmote = (index: number, id: string) => <Image
        key={index}
        style={{ width: 28, height: 28 }}
        source={{
            uri: `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`,
        }}
    />;

    let replaced;
    for (var x = 0, c = ''; c = msg.messageText.charAt(x); x++) {
        replaced = false;
        for (const emote of msg.emotes) {
            if (emote.startIndex === x) {
                replaced = true;
                renderMessage.push(renderTwitchEmote(x, emote.id));
                x += emote.endIndex - emote.startIndex - 1;
            }
        }

        if (!replaced) {
            renderMessage.push(c);
        }
    }

    return (
        <Text style={styles.chatMessage}><b style={{ color: props.message.colorRaw }}>{props.message.displayName}</b>: {renderMessage}</Text>
    );
}