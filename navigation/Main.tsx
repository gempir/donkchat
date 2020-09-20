import * as React from "react";
import { Dimensions } from "react-native";
import { TabBar, TabView } from 'react-native-tab-view';
import { useSelector } from "react-redux";
import { useThemeColor } from "../components/Themed";
import usePersistedConfigs from "../hooks/usePersistedConfigs";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { ReduxStore } from "../store/store";
import { ChatConfig } from "./../models/Configs";

const initialLayout = { width: Dimensions.get('window').width };

type route = { title: string, key: string, cfg?: ChatConfig };
type routes = Array<route>;

const ThemedTabBar = (props: any) => {
    return <TabBar
        {...props}
        labelStyle={{ color: useThemeColor("text") }}
        indicatorStyle={{ backgroundColor: useThemeColor("tint") }}
        style={{ backgroundColor: useThemeColor("background") }}
    />;
}

export default (props: any) => {
    usePersistedConfigs();

    const chatClient = useSelector((state: ReduxStore) => state.chatClient);
    React.useEffect(() => {
        try {
            chatClient.connect();
        } catch (err) {
            console.log(err);
        }
    })


    const [index, setIndex] = React.useState(0);

    const routes: routes = [];

    const chatConfigs = useSelector((state: ReduxStore) => state.chatConfigs);
    for (const cfg of chatConfigs.toArray()) {
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
            renderTabBar={(props: any) => {
                return <ThemedTabBar {...props} />
            }}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
        />
    );
}