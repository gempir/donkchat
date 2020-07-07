import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import * as React from "react";
import { connect, Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { createInitialState, reducer } from "../store/store";
import { ChatConfigs } from "./../models/Configs";
import ChatClient from "./../twitch/ChatClient";

const Tab = createMaterialTopTabNavigator();
// @ts-ignore
const store = createStore(reducer, createInitialState(), applyMiddleware(thunk));

interface IProps {
    colorScheme: string
}

interface IState {
    buffers: { [key: string]: Array<PrivmsgMessage> };
    chatConfigs: ChatConfigs;
    addChannel: string;
}
export default class App extends React.Component<IProps, IState> {

    render() {
        return (
            <Provider store={store}>
                <ConnectedNavigation colorScheme={this.props.colorScheme} />
            </Provider>
        );
    }
}

class Navigation extends React.Component<{ chatConfigs: ChatConfigs, colorScheme: string }> {
    componentDidMount() {
        // @ts-ignore
        const client: ChatClient = store.getState().chatClient;
        client.connect();
    }

    render() {
        const channelTabs = [];

        for (const cfg of this.props.chatConfigs.toArray()) {
            channelTabs.push(
                <Tab.Screen name={cfg.channel} key={cfg.channel} >
                    {() => <ChatScreen chatConfig={cfg} />}
                </Tab.Screen>
            );
        }

        return (
            <NavigationContainer theme={this.props.colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <Tab.Navigator initialRouteName="Settings">
                    {channelTabs}
                    <Tab.Screen name="Settings" component={SettingsScreen} />
                </Tab.Navigator>
            </NavigationContainer>
        );
    }
}

const ConnectedNavigation = connect((state: any) => {
    return {
        chatConfigs: state.chatConfigs,
    };
})(Navigation);