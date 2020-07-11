import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import { parseTwitchMessage } from "dank-twitch-irc/dist/message/parser/twitch-message";
import { PingMessage } from "dank-twitch-irc/dist/message/twitch-types/connection/ping";

export type EventHandler = (message: PrivmsgMessage) => void;

export default class ChatClient {
    ws: WebSocket | undefined;
    eventHandlers: Map<string, EventHandler> = new Map();
    msgQueue: Array<string> = [];
    joinedChannels: Array<string> = [];

    addEventHandler = (channel: string, handler: EventHandler) => {
        this.eventHandlers.set(channel, handler);
    };

    removeEventHandler = (channel: string) => {
        this.eventHandlers.delete(channel);
    }

    connect = () => {
        this.ws = new WebSocket("wss://irc-ws.chat.twitch.tv");

        this.ws.onopen = this.onOpen;
        this.ws.onmessage = this.onMessage;
        this.ws.onerror = this.onError;
        this.ws.onclose = this.onClose;
    };

    onOpen = () => {
        console.log("open ws");
        this.send("CAP REQ :twitch.tv/commands twitch.tv/tags");
        this.send("NICK justinfan123123");

        for (const msg of this.msgQueue) {
            this.send(msg);
        }
        for (const channel of this.joinedChannels) {
            this.join(channel);
        }
    };

    join = (channel: string) => {
        const sent = this.send(`JOIN #${channel}`);

        if (sent) {
            this.joinedChannels.push(channel);
        }
    };

    onMessage = (message: MessageEvent) => {
        try {
            const msg = parseTwitchMessage(message.data);

            if (msg instanceof PrivmsgMessage) {
                this.eventHandlers.forEach((value: EventHandler, key: string) => {
                    if (key === msg.channelName) {
                        value(msg);
                    }
                });
            }
            if (msg instanceof PingMessage) {
                this.send("PONG :tmi.twitch.tv");
            }
        } catch (err) {
            console.log(err);
        }
    };

    onError = (event: Event) => {
        console.log(event);
        this.connect();
    };

    onClose = (event: WebSocketCloseEvent) => {
        console.log(event);
        this.connect();
    };

    send = (message: string) => {
        if (typeof this.ws === "undefined") {
            this.msgQueue.push(message);
            return false;
        }

        try {
            this.ws.send(message);
            return true;
        } catch (err) {
            this.msgQueue.push(message);
            return false;
        }
    };
}