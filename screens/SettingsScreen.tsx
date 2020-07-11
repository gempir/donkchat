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
        <TextInput placeholder="channel" onChangeText={props.handleAddChannelChange} style={{
            borderColor: 'gray',
            borderWidth: 1,
            width: "80%",
            padding: 10,
            marginBottom: 20,
            color: useThemeColor("text")
        }} value={props.addChannel} />
    )
}

class SettingsScreen extends React.Component<IProps, IState> {
    state = {
        addChannel: "",
    }

    render() {
        return <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', padding: 20, alignItems: 'stretch' }}>
                <View style={{ height: 55, width: "80%" }}>
                    <Input autoCorrect={false} handleAddChannelChange={this.handleAddChannelChange} addChannel={this.state.addChannel} />
                </View>
                <View style={{ width: "20%" }}>
                    <Button title="Add" onPress={this.addChannel} />
                </View>
            </View>
            <View style={{ padding: 20 }}>
                {this.props.chatConfigs.toArray().map(cfg => <Text key={cfg.channel} style={{ fontSize: 24, paddingBottom: 20 }} onPress={() => this.removeChannel(cfg)}>{cfg.channel}</Text>)}
            </View>
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

    removeChannel = async (cfg: ChatConfig) => {
        try {
            const jsonValue = await AsyncStorage.getItem('@chatConfigs')
            const result = jsonValue != null ? JSON.parse(jsonValue) : [];
            if (result && result.configs) {
                const toSave = [];
                for (const config of Object.values(result.configs)) {
                    if (config.channel !== cfg.channel) {
                        toSave.push(config);
                    }
                }

                this.props.dispatch(setConfigs(new ChatConfigs(toSave)));
                await AsyncStorage.setItem("@chatConfigs", JSON.stringify(toSave));
            }
        } catch (err) {
            console.log(err);
        }
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