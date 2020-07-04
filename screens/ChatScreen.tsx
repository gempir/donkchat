import AsyncStorage from '@react-native-community/async-storage';
import { ChatClient, PrivmsgMessage } from "dank-twitch-irc";
import * as React from 'react';
import { Button, Dimensions, StyleSheet, TextInput } from 'react-native';
import Toast from 'react-native-easy-toast';
import { SceneMap, TabView } from 'react-native-tab-view';
import { Text, View } from '../components/Themed';
import { ChatConfig, ChatConfigs } from '../models/Configs';

interface IProps {
}

interface IState {
    buffers: { [key: string]: Array<PrivmsgMessage> };
    chatConfigs: ChatConfigs;
    addChannel: string;
}

export default class ChatScreen extends React.Component<IProps, IState> {
    state = {
        chatConfigs: new ChatConfigs(),
        buffers: {},
        addChannel: "",
    }

    BUFFER_LIMIT: number = 200;
    toast: React.RefObject<any> = React.createRef();

    client: ChatClient;

    constructor(props: object) {
        super(props);

        this.client = new ChatClient({ connection: { type: "websocket", secure: true } });
    }

    componentDidMount() {
        this.client.on("ready", () => this.toast.current.show("connected to chat"));
        this.client.on("close", (error: any) => {
            if (error != null) {
                this.toast.current.show("chat connection closed due to error", error);
            }
        });

        this.client.on("PRIVMSG", (msg) => {
            const buffer = this.state.buffers[msg.channelName];
            if (typeof buffer !== "undefined") {
                this.setState({
                    buffers: { ...this.state.buffers, [msg.channelName]: [...buffer.slice(buffer.length - this.BUFFER_LIMIT - 1), msg] },
                });
            } else {
                this.setState({
                    buffers: { ...this.state.buffers, [msg.channelName]: [msg] },
                });
            }
        });

        this.client.connect();

        this.getConfigs().then(cfgs => {
            for (const cfg of cfgs.toArray()) {
                console.log(cfg);
                this.client.join(cfg.channel);
            }

            this.setState({
                chatConfigs: cfgs,
            });
        });
    }

    render() {
        return (
            <View>
                <ChatTabView cfgs={this.state.chatConfigs} />
                <View style={styles.container} >
                    {this.state.chatConfigs.length === 0 && <>
                        <TextInput placeholder="channel" onChangeText={this.handleAddChannelChange} style={styles.textInput} value={this.state.addChannel} />
                        <Button title="Add channel" onPress={this.addChannel} />
                    </>}
                </View>
                <Toast ref={this.toast}
                    // @ts-ignore 
                    position={"top"}
                />
            </View>
        );
    }

    addChannel = () => {
        if (this.state.addChannel === "") {
            return;
        }

        const cfg = new ChatConfig(this.state.addChannel);

        this.saveConfig(cfg);
        this.client.join(cfg.channel);
        this.setState({
            chatConfigs: this.state.chatConfigs.createNewWith(cfg),
            addChannel: "",
        });
    }

    handleAddChannelChange = (text: string) => {
        this.setState({
            addChannel: text,
        });
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


const Chat = ({ cfg }) => (
    <View style={{ width: "100%", height: "100%", backgroundColor: '#ff4081' }} />
);

function ChatTabView({ cfgs }: { [key: string]: ChatConfigs }) {
    const [index, setIndex] = React.useState(0);

    const states = [];
    for (const cfg of cfgs.toArray()) {
        states.push({ title: cfg.channel, key: cfg.channel });
    }
    console.log(states);

    const [routes] = React.useState(states);

    const sceneMap: { [key: string]: React.ComponentType } = {};
    for (const cfg of cfgs.toArray()) {
        sceneMap[cfg.channel] = <Chat cfg={cfg} />;
    }

    {/* {this.state.chatConfigs.length > 0 && <FlatList inverted data={this.state.buffers['gempir'].reverse()} renderItem={({ item }) => <ChatMessage message={item} />} */ }
    {/* keyExtractor={(item: PrivmsgMessage) => item.messageID} style={styles.scrollView}></FlatList>} */ }

    return (
        <TabView
            style={{ height: "100%" }}
            navigationState={{ index, routes }}
            renderScene={SceneMap(sceneMap)}
            onIndexChange={setIndex}
        />
    );
}