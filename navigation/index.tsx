import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import * as React from "react";
import { Dimensions, StatusBar } from "react-native";
import { SceneMap, TabView } from 'react-native-tab-view';
import { connect, Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { createInitialState, reducer } from "../store/store";
import { ChatConfigs, ChatConfig } from "./../models/Configs";
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
                <StatusBar />
                <ConnectedNavigation colorScheme={this.props.colorScheme} />
            </Provider>
        );
    }
}

class Navigation extends React.Component<{ chatConfigs: ChatConfigs, colorScheme: string }> {
    componentDidMount() {
        // @ts-ignore
        try {
            const client: ChatClient = store.getState().chatClient;
            client.connect();
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return <TabViewContainer chatConfigs={this.props.chatConfigs} />;
    }
}

const ConnectedNavigation = connect((state: any) => {
    return {
        chatConfigs: state.chatConfigs,
    };
})(Navigation);

const initialLayout = { width: Dimensions.get('window').width };

type route = { title: string, key: string, cfg?: ChatConfig };
type routes = Array<route>;

const TabViewContainer = (props: any) => {
    const [index, setIndex] = React.useState(0);

    const routes: routes = [];

    const sceneMap: { [key: string]: any } = {
        settings: SettingsScreen,
    };

    for (const cfg of props.chatConfigs.toArray()) {
        routes.push({ key: cfg.channel, title: cfg.channel, cfg: cfg });
    }
    routes.push({ key: 'settings', title: 'Settings' });

    const renderScene = ({ route, jumpTo }: { route: route, jumpTo: (key: string) => void }) => {
        if (route.key === "settings") {
            return <SettingsScreen />
        }
        if (typeof route.cfg === "undefined") {
            return null;
        }

        return <ChatScreen chatConfig={route.cfg} />
    };

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
        />
    );
}
