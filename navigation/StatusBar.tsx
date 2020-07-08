import React from 'react';
import { View, StatusBar } from 'react-native';

const statusBar = (props: any) => (
    <View>
        <StatusBar translucent backgroundColor={{ backgroundColor: "green" }} {...props} />
    </View>
);
export default statusBar;