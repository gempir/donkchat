import AsyncStorage from '@react-native-community/async-storage';
import { ChatClient, PrivmsgMessage } from "dank-twitch-irc";
import * as React from 'react';
import { Button, FlatList, StyleSheet, TextInput } from 'react-native';
import { View } from '../components/Themed';
import ChatMessage from '../components/ChatMessage';
import Toast, { DURATION } from 'react-native-easy-toast'

interface IProps {
}

interface IState {
    messages: Array<PrivmsgMessage>;
    channels: Array<string>;
    addChannel: string;
}

export default class ChatScreen extends React.Component<IProps, IState> {
    state = {
        channels: [],
        messages: [],
        addChannel: "",
    }

    messageBuffer: number = 200;
    toast: React.RefObject<any> = React.createRef();

    client: ChatClient;

    constructor(props: object) {
        super(props);

        this.client = new ChatClient({ connection: { type: "websocket", secure: true } });
    }

    componentDidMount() {
        this.client.on("ready", () => this.toast.current.show("connected to chat"));
        this.client.on("close", (error: any) => {
            if (error != null) {
                this.toast.current.show("chat connection closed due to error", error);
            }
        });

        this.client.on("PRIVMSG", (msg) => {
            this.setState({
                messages: [...this.state.messages.slice(this.state.messages.length - this.messageBuffer - 1), msg],
            });
        });

        this.client.connect();

        this.getChannels().then(channels => {
            for (const channel of channels) {
                this.client.join(channel);
            }

            this.setState({
                channels: channels,
            });
        });
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

                <Toast ref={this.toast}
                    // @ts-ignore 
                    position={"top"}
                />
            </View>
        );
    }

    addChannel = () => {
        if (this.state.addChannel === "") {
            return;
        }

        const channels = [...this.state.channels, this.state.addChannel];

        this.saveSetting("@channels", channels);
        this.client.join(this.state.addChannel);
        this.setState({
            channels: channels,
            addChannel: "",
        });
    }

    handleAddChannelChange = (text: string) => {
        this.setState({
            addChannel: text,
        });
    }

    saveSetting = async (key: string, value: object) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value))
        } catch (e) {
            console.error(e);
        }
    }

    getChannels = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@channels')
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error(e);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        width: "100%",
    },
    textInput: {
        borderColor: 'gray',
        borderWidth: 1,
        width: "80%",
        padding: 10,
        marginBottom: 20
    },
});
