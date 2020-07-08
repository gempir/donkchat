import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import { parseTwitchMessage } from "dank-twitch-irc/dist/message/parser/twitch-message";

export type EventHandler = (message: PrivmsgMessage) => void;

export default class ChatClient {
    ws: WebSocket | undefined;
    eventHandlers: Map<string, EventHandler> = new Map();
    msgQueue: Array<string> = [];

    addEventHandler = (channel: string, handler: EventHandler) => {
        this.eventHandlers.set(channel, handler);
    };

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
    };

    join = (channel: string) => {
        this.send(`JOIN #${channel}`);
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
        } catch (err) {
            console.error(err);
        }
    };

    onError = (event: Event) => {
        console.error(event);
    };

    onClose = (event: WebSocketCloseEvent) => {
        console.error(event);
    };

    send = (message: string) => {
        if (typeof this.ws === "undefined") {
            this.msgQueue.push(message);
            return;
        }

        try {
            this.ws.send(message);
        } catch (err) {
            this.msgQueue.push(message);
        }
    };
}