import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useSelector } from "react-redux";
import { View } from '../components/Themed';
import { ChatConfig } from '../models/Configs';
import ChatMessage from "./../components/ChatMessage";
import { ReduxStore } from "../store/store";

interface IProps {
    chatConfig: ChatConfig;
}

const bufferLimit: number = 100;

export default (props: IProps) => {
    const [buffer, setBuffer] = useState<Array<PrivmsgMessage>>([]);

    const handleMessage = (msg: PrivmsgMessage) => {
        if (msg.channelName === props.chatConfig.channel) {
            const newBuffer: Array<PrivmsgMessage> = buffer.slice();
            if (newBuffer.length >= bufferLimit) {
                newBuffer.pop();
            }
            newBuffer.unshift(msg);
            setBuffer(newBuffer);
            console.log(newBuffer);
        }
    }
 
    const chatClient = useSelector((state: ReduxStore) => state.chatClient);
    useEffect(() => {
        chatClient.addEventHandler(handleMessage);
    }, []);

    return (
        <View style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
            <FlatList
                updateCellsBatchingPeriod={0}
                maxToRenderPerBatch={1}
                inverted
                style={{ height: 100 }}
                data={buffer}
                renderItem={({ item }) => <ChatMessage message={item} />}
                keyExtractor={(item: PrivmsgMessage) => item.messageID} />
        </View>
    );
}