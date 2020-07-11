import * as React from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { createInitialState, reducer } from "../store/store";
import Main from "./Main";

const store = createStore(reducer, createInitialState(), applyMiddleware(thunk));

export default class App extends React.Component<{ colorScheme: string }> {

    render() {
        return (
            <Provider store={store}>
                <StatusBar />
                <Main colorScheme={this.props.colorScheme} />
            </Provider>
        );
    }
}
