import { ChatClient, PrivmsgMessage } from "dank-twitch-irc";
import * as React from 'react';
import { FlatList } from 'react-native';
import { connect } from "react-redux";
import { View } from '../components/Themed';
import { ChatConfig } from '../models/Configs';
import ChatMessage from "./../components/ChatMessage";

interface IProps {
    chatClient: ChatClient;
    chatConfig: ChatConfig;
}

interface IState {
    buffer: Array<PrivmsgMessage>;
}

class ChatScreen extends React.Component<IProps, IState> {
    state = {
        buffer: [],
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
                <FlatList
                    inverted
                    data={this.state.buffer.reverse()}
                    renderItem={({ item }) => <ChatMessage message={item} />}
                    keyExtractor={(item: PrivmsgMessage) => item.messageID} />
            </View>
        );
    }
}

export default connect((state: any) => {
    return {
        chatClient: state.chatClient,
    };
})(ChatScreen);
