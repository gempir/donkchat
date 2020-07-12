import { TouchableOpacity, Text } from "react-native";
import { useThemeColor } from "./Themed";
import React from "react";

export default (props: any) => {

    return (
        <TouchableOpacity style={{ backgroundColor: useThemeColor("tint"), flex: 1, justifyContent: "center", alignItems: "center", borderRadius: 3, ...props.style }} onPress={props.onPress}>
            <Text style={{ color: "white" }}>{props.children}</Text>
        </TouchableOpacity>
    );
}
