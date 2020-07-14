import AsyncStorage from '@react-native-community/async-storage';
import React from "react";
import { TextInput } from "react-native";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Text, useThemeColor, View } from "../components/Themed";
import ThemedButton from '../components/ThemedButton';
import { ChatConfig, ChatConfigs } from "../models/Configs";
import addChat from "../store/actions/addChat";
import setConfigs from "../store/actions/setConfigs";

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
        <TextInput placeholder="channel" autoCorrect={false} onChangeText={props.handleAddChannelChange} style={{
            borderColor: 'gray',
            width: "80%",
            borderWidth: 1,
            padding: 10,
            marginRight: 10,
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
                <Input addChannel={this.state.addChannel} handleAddChannelChange={this.handleAddChannelChange} />
                <ThemedButton style={{ width: "20%" }} onPress={this.addChannel}>Add</ThemedButton>
            </View>
            <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                <Text>Click channel to remove</Text>
            </View>
            <View style={{ flexDirection: 'row', padding: 10, paddingTop: 10, alignItems: 'stretch' }}>
                {this.props.chatConfigs.toArray().map(cfg => <ThemedButton style={{ height: 40, marginRight: 10, marginLeft: 10 }} key={cfg.channel} onPress={() => this.removeChannel(cfg)}>{cfg.channel}</ThemedButton>)}
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
                    // @ts-ignore
                    if (config.channel !== cfg.channel) {
                        toSave.push(config);
                    }
                }
                // @ts-ignore
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