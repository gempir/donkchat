import AsyncStorage from '@react-native-community/async-storage';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { ChatClient, PrivmsgMessage } from "dank-twitch-irc";
import * as React from "react";
import Toast from 'react-native-easy-toast';
import { Provider } from "react-redux";
import { createStore } from "redux";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { createInitialState, reducer } from "../store/store";
import { ChatConfig, ChatConfigs } from "./../models/Configs";

const Tab = createMaterialTopTabNavigator();

const store = createStore(reducer, createInitialState());

interface IProps {
}

interface IState {
    buffers: { [key: string]: Array<PrivmsgMessage> };
    chatConfigs: ChatConfigs;
    addChannel: string;
}
export default class Navigation extends React.Component<IProps, IState> {

    toast: React.RefObject<any> = React.createRef();

    componentDidMount() {
        const client: ChatClient = store.getState().chatClient;
        client.on("ready", () => this.toast.current.show("connected to chat"));
        client.on("close", (error: any) => {
            if (error != null) {
                this.toast.current.show("chat connection closed due to error", error);
            }
        });

        client.connect();

        this.getConfigs().then(cfgs => {
            for (const cfg of cfgs.toArray()) {
                client.join(cfg.channel);
            }

            this.setState({
                chatConfigs: cfgs,
            });
        });
    }

    render() {
        return (
            <Provider store={store}>
                <NavigationContainer theme={this.props.colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                    <Tab.Navigator initialRouteName="Settings">
                        <Tab.Screen name="Chat" component={() => <ChatScreen chatConfig={new ChatConfig("gempir")} />} />
                        <Tab.Screen name="Settings" component={SettingsScreen} />
                    </Tab.Navigator>
                    <Toast ref={this.toast} />
                </NavigationContainer>
            </Provider>
        );
    }

    saveConfig = async (cfg: ChatConfig) => {
        try {
            await AsyncStorage.setItem("@chatConfigs", JSON.stringify(this.state.chatConfigs.createNewWith(cfg)))
        } catch (e) {
            console.error(e);
        }
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
}
