import { PrivmsgMessage, ChatClient } from "dank-twitch-irc";
import * as React from 'react';
import { Button, StyleSheet, TextInput, FlatList } from 'react-native';
import { View } from '../components/Themed';
import { ChatConfig, ChatConfigs } from '../models/Configs';
import { connect } from "react-redux";
import ChatMessage from "./../components/ChatMessage";

interface IProps {
    chatClient: ChatClient;
    chatConfig: ChatConfig;
}

interface IState {
    buffer: Array<PrivmsgMessage>;
    addChannel: string;
}

class ChatScreen extends React.Component<IProps, IState> {
    state = {
        buffer: [],
        addChannel: "",
    }

    BUFFER_LIMIT: number = 200;

    componentDidMount() {
        this.props.chatClient.on("PRIVMSG", (msg: PrivmsgMessage) => {
            if (msg.channelName === this.props.chatConfig.channel) {
                this.setState({
                    buffer: [...this.state.buffer.slice(this.state.buffer.length - this.BUFFER_LIMIT - 1), msg],
                });
            }
        });
    }

    render() {
        return (
            <View>
                {/* <ChatTabView cfgs={this.state.chatConfigs} /> */}
                <View style={styles.container} >
                    <FlatList inverted data={this.state.buffer.reverse()} renderItem={({ item }) => <ChatMessage message={item} />}
                        keyExtractor={(item: PrivmsgMessage) => item.messageID} style={styles.scrollView}></FlatList>
                    <TextInput placeholder="channel" onChangeText={this.handleAddChannelChange} style={styles.textInput} value={this.state.addChannel} />
                    <Button title="Add channel" onPress={this.addChannel} />
                </View>
            </View>
        );
    }

    addChannel = () => {
        if (this.state.addChannel === "") {
            return;
        }

        const cfg = new ChatConfig(this.state.addChannel);

        // this.saveConfig(cfg);
        // this.client.join(cfg.channel);
        this.setState({
            // chatConfigs: this.state.chatConfigs.createNewWith(cfg),
            addChannel: "",
        });
    }

    handleAddChannelChange = (text: string) => {
        this.setState({
            addChannel: text,
        });
    }
}

export default connect((state: any) => {
    return {
        chatClient: state.chatClient,
    };
})(ChatScreen);

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