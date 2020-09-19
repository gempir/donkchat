import React from 'react';
import { StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Main from "./navigation/Main";
import { createInitialState, reducer } from "./store/store";

const store = createStore(reducer, createInitialState(), applyMiddleware(thunk));

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaProvider>
                <Provider store={store}>
                    <StatusBar />
                    <Main colorScheme={colorScheme} />
                </Provider>
            </SafeAreaProvider>
        );
    }
}
