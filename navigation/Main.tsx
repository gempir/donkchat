import * as React from "react";
import { connect } from "react-redux";
import { ChatConfigs } from "./../models/Configs";
import ChatClient from "./../twitch/ChatClient";
import TabViewContainer from "./TabViewContainer";
import { loadGlobalBadges } from "../store/actions/loadBadges";

class Main extends React.Component<{ chatConfigs: ChatConfigs, chatClient: ChatClient, colorScheme: string, dispatch: React.Dispatch<object> }> {
    componentDidMount() {
        this.props.dispatch(loadGlobalBadges());
        try {
            const client: ChatClient = this.props.chatClient;
            client.connect();
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return <TabViewContainer chatConfigs={this.props.chatConfigs} />;
    }
}

export default connect((state: any) => ({
    chatConfigs: state.chatConfigs,
    chatClient: state.chatClient,
}))(Main);

