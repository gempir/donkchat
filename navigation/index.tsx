import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { ChatClient, PrivmsgMessage } from "dank-twitch-irc";
import * as React from "react";
import Toast from 'react-native-easy-toast';
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { connect } from "react-redux";
import thunk from "redux-thunk";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { createInitialState, reducer } from "../store/store";
import { ChatConfig, ChatConfigs } from "./../models/Configs";

const Tab = createMaterialTopTabNavigator();
const store = createStore(reducer, createInitialState(), applyMiddleware(thunk));

interface IProps {
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

class Navigation extends React.Component {
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
    }

    render() {
        const channelTabs = [];

        for (const cfg of this.props.chatConfigs.toArray()) {
            channelTabs.push(
                <Tab.Screen name={cfg.channel} key={cfg.channel}>
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
                <Toast ref={this.toast} />
            </NavigationContainer>
        );
    }
}

const ConnectedNavigation = connect((state: any) => {
    return {
        chatConfigs: state.chatConfigs,
    };
})(Navigation);