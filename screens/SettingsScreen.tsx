import AsyncStorage from '@react-native-community/async-storage';
import React from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Text, View } from "../components/Themed";
import { ChatConfig, ChatConfigs } from "../models/Configs";
import addChat from "../store/actions/addChat";
import setConfigs from "../store/actions/setConfigs";
import Colors from '../constants/Colors';
import { useThemeColor } from "../components/Themed";

interface IProps {
    dispatch: Dispatch
    chatClient: any
    chatConfigs: ChatConfigs
}

interface IState {
    addChannel: string,
}

const Input = (props: any) => {
    return (
        <TextInput placeholder="channel" onChangeText={props.handleAddChannelChange} style={{ ...styles.textInput, color: useThemeColor({}, "text") }} value={props.addChannel} />
    )
}

class SettingsScreen extends React.Component<IProps, IState> {
    state = {
        addChannel: "",
    }

    render() {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {this.props.chatConfigs.toArray().map(cfg => <Text key={cfg.channel}>{cfg.channel}</Text>)}
            <Input handleAddChannelChange={this.handleAddChannelChange} addChannel={this.state.addChannel} />
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
            // await AsyncStorage.removeItem('@chatConfigs')
            const jsonValue = await AsyncStorage.getItem('@chatConfigs')
            const result = jsonValue != null ? JSON.parse(jsonValue) : [];
            if (result && result.configs) {
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