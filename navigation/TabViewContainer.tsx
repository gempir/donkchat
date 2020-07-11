import * as React from "react";
import { Dimensions } from "react-native";
import { TabBar, TabView } from 'react-native-tab-view';
import { useThemeColor } from "../components/Themed";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
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

const renderTabBar = (props: any) => {
    return <ThemedTabBar {...props} />
};


export default (props: any) => {
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
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
        />
    );
}