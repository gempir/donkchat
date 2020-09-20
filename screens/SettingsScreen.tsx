import React, { useState } from "react";
import { TextInput } from "react-native";
import { useDispatch } from "react-redux";
import { useThemeColor, View } from "../components/Themed";
import ThemedButton from '../components/ThemedButton';
import { ChatConfig } from "../models/Configs";
import { addChat } from "../store/actions/Configs";

export default () => {
    const [channel, setChannel] = useState("");

    const dispatch = useDispatch();
    const addChannel = () => {
        dispatch(addChat(new ChatConfig(channel)));
        setChannel("");
    }

    return <View style={{ height: "100%" }}>
        <View style={{ flexDirection: 'row', padding: 20, alignItems: 'stretch' }}>
            <TextInput placeholder="channel" autoCorrect={false} onChangeText={setChannel} style={{
                borderColor: 'gray',
                width: "80%",
                borderWidth: 1,
                padding: 10,
                marginRight: 10,
                color: useThemeColor("text")
            }} value={channel} />
            <ThemedButton style={{ width: "20%" }} onPress={addChannel}>Add</ThemedButton>
        </View>
    </View>
}