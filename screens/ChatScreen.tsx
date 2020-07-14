import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import * as React from 'react';
import { FlatList } from 'react-native';
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { View } from '../components/Themed';
import { ChatConfig } from '../models/Configs';
import ChatMessage from "./../components/ChatMessage";
import ChatClient from "./../twitch/ChatClient";
import { ThirdPartyEmotes } from "../store/store";
import loadThirdPartyEmotes from "../store/actions/loadThirdPartyEmotes";

interface IProps {
    chatClient: ChatClient;
    chatConfig: ChatConfig;
    thirdPartyEmotes: ThirdPartyEmotes;
    dispatch: Dispatch<any>;
}

interface IState {
    buffer: Array<PrivmsgMessage>;
}

class ChatScreen extends React.Component<IProps, IState> {
    state = {
        buffer: [],
    }

    handlerId: string = "";
    BUFFER_LIMIT: number = 100;

    componentDidMount() {
        this.handlerId = this.props.chatClient.addEventHandler(this.handleMessage);
    }

    componentWillUnmount() {
        this.props.chatClient.removeEventHandler(this.handlerId);
    }

    handleMessage = (msg: PrivmsgMessage) => {
        if (msg.channelName === this.props.chatConfig.channel) {
            if (!this.props.thirdPartyEmotes.has(msg.channelID)) {
                this.props.dispatch(loadThirdPartyEmotes(msg.channelID))
            }

            const newBuffer: Array<PrivmsgMessage> = this.state.buffer.slice();
            if (newBuffer.length >= this.BUFFER_LIMIT) {
                newBuffer.pop();
            }
            newBuffer.unshift(msg);
            this.setState({
                buffer: newBuffer,
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
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
        thirdPartyEmotes: state.thirdPartyEmotes,
    };
})(ChatScreen);
