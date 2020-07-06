import { parseTwitchMessage, PrivmsgMessage } from "dank-twitch-irc";

export type EventHandler = (message: PrivmsgMessage) => void;

export default class ChatClient {
    ws: WebSocket | undefined;
    eventHandlers: Map<string, EventHandler> = new Map();

    msgQueue: Array<string> = [];

    connect = () => {
        this.init();
    };

    addEventHandler = (channel: string, handler: EventHandler) => {
        this.eventHandlers.set(channel, handler);
    };

    init = () => {
        this.ws = new WebSocket("wss://irc-ws.chat.twitch.tv");

        this.ws.onopen = this.onOpen;
        this.ws.onmessage = this.onMessage;
        this.ws.onerror = this.onError;
        this.ws.onclose = this.onClose;
    };

    onOpen = () => {
        this.send("CAP REQ :twitch.tv/commands twitch.tv/tags");
        this.send("NICK justinfan123123");
        this.join("gempir");

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

    onError = (error) => {
        console.error(error);
    };

    onClose = (msg) => {
        console.info('Connection closed', msg);
    };

    send = (message) => {
        try {
            this.ws.send(message);
        } catch (err) {
            this.msgQueue.push(message);
        }
    };

    sendJson = (data) => {
        this.send(JSON.stringify(data));
    };
}