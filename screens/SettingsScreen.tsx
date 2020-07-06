import React from "react";
import { Text, View } from "../components/Themed";
import { ChatConfig, ChatConfigs } from "../models/Configs";
import { TextInput, Button, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import setConfigs from "../store/actions/setConfigs";
import { ChatClient } from "dank-twitch-irc";
import AsyncStorage from '@react-native-community/async-storage';
import addChat from "../store/actions/addChat";

interface IProps {
    dispatch: Dispatch
    chatClient: ChatClient
    chatConfigs: ChatConfigs
}

interface IState {
    addChannel: string,
}

class SettingsScreen extends React.Component<IProps, IState> {
    state = {
        addChannel: "",
    }

    render() {
        return <View>
            {this.props.chatConfigs.toArray().map(cfg => <Text key={cfg.channel}>{cfg.channel}</Text>)}
            <TextInput placeholder="channel" onChangeText={this.handleAddChannelChange} style={styles.textInput} value={this.state.addChannel} />
            <Button title="Add channel" onPress={this.addChannel} />
        </View>;
    }

    componentDidMount() {
        this.getConfigs().then(cfgs => {
            for (const cfg of cfgs.toArray()) {
                this.props.chatClient.join(cfg.channel);
            }

            this.props.dispatch(setConfigs(cfgs));
        });
    }

    getConfigs = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@chatConfigs')
            const result = jsonValue != null ? JSON.parse(jsonValue) : [];
            if (result) {
                return new ChatConfigs(Object.values(result.configs));
            } else {
                return new ChatConfigs();
            }
        } catch (e) {
            console.error(e);

            return new ChatConfigs();
        }
    }


    addChannel = () => {
        if (this.state.addChannel === "") {
            return;
        }

        const cfg = new ChatConfig(this.state.addChannel);

        this.props.dispatch(addChat(cfg));

        this.setState({
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
        chatConfigs: state.chatConfigs,
    };
})(SettingsScreen);

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