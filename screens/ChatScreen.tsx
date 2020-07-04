import * as React from 'react';
import { StyleSheet, Button, TextInput, FlatList, Image } from 'react-native';
import { ChatClient, PrivmsgMessage, TwitchEmote } from "dank-twitch-irc";

import { Text, View } from '../components/Themed';

interface IProps {
}

interface IState {
    messages: Array<PrivmsgMessage>;
    channels: Array<string>;
    addChannel: string;
}

function ChatMessage(props: { message: PrivmsgMessage }) {
    const msg = props.message;
    const renderMessage = [];

    const renderTwitchEmote = (index: number, id: string) => <Image
        key={index}
        style={styles.emote}
        source={{
            uri: `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`,
        }}
    />;

    const replacements: Array<TwitchEmote> = [];

    for (const emote of msg.emotes) {
        replacements.push({ ...emote, endIndex: emote.endIndex + 1 });
    }

    replacements.sort((a, b) => {
        if (a.startIndex > b.endIndex) {
            return -1;
        }
        if (a.startIndex < b.endIndex) {
            return 1;
        }
        return 0;
    });

    let replaced = false;
    for (var x = 0, c = ''; c = msg.messageText.charAt(x); x++) {
        replaced = false;
        for (const emote of replacements) {
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

export default class ChatScreen extends React.Component<IProps, IState> {
    state = {
        channels: [],
        messages: [],
        addChannel: "",
    }

    messageBuffer: number = 200;

    client: ChatClient;

    constructor(props: object) {
        super(props);


        this.client = new ChatClient({ connection: { type: "websocket", secure: true } });

        this.client.on("ready", () => console.log("Successfully connected to chat"));
        this.client.on("close", (error: any) => {
            if (error != null) {
                console.error("Client closed due to error", error);
            }
        });

        this.client.on("PRIVMSG", (msg) => {
            this.setState({
                messages: [...this.state.messages.slice(this.state.messages.length - this.messageBuffer - 1), msg],
            });
        });

        this.client.connect();

        setTimeout(() => {
            this.setState({
                addChannel: "gempir"
                // addChannel: "twitchmedia_qs_10"
            }, this.addChannel);
        }, 1000);
    }

    render() {
        return (
            <View style={styles.container} >
                {this.state.channels.length > 0 && <FlatList inverted data={this.state.messages.reverse()} renderItem={({ item }) => <ChatMessage message={item} />}
                    keyExtractor={(item: PrivmsgMessage) => item.messageID} style={styles.scrollView}></FlatList>}
                {this.state.channels.length === 0 && <>
                    <TextInput placeholder="channel" onChangeText={this.handleAddChannelChange} style={styles.textInput} value={this.state.addChannel} />
                    <Button title="Add channel" onPress={this.addChannel} />
                </>}
            </View>
        );
    }

    addChannel = () => {
        if (this.state.addChannel === "") {
            return;
        }

        this.client.join(this.state.addChannel);
        this.setState({
            channels: [...this.state.channels, this.state.addChannel],
            addChannel: "",
        });
    }

    handleAddChannelChange = (text: string) => {
        this.setState({
            addChannel: text,
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emote: {
        width: 28,
        height: 28,
    },
    scrollView: {
        width: "100%",
    },
    chatMessage: {
        padding: 3,
    },
    textInput: {
        borderColor: 'gray',
        borderWidth: 1,
        width: "80%",
        padding: 10,
        marginBottom: 20
    },
});
