import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import * as React from 'react';
import { FlatList } from 'react-native';
import { connect } from "react-redux";
import { View } from '../components/Themed';
import { ChatConfig } from '../models/Configs';
import ChatMessage from "./../components/ChatMessage";
import ChatClient from "./../twitch/ChatClient";

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
        this.props.chatClient.addEventHandler(this.props.chatConfig.channel, (msg: PrivmsgMessage) => {
            if (msg.channelName === this.props.chatConfig.channel) {
                this.setState({
                    buffer: [msg, ...this.state.buffer.slice(this.state.buffer.length - this.BUFFER_LIMIT - 1)],
                });
            }
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    updateCellsBatchingPeriod={0}
                    maxToRenderPerBatch={1}
                    inverted
                    style={{ height: 100 }}
                    data={this.state.buffer}
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
