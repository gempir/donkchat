import { PrivmsgMessage } from "dank-twitch-irc/dist/message/twitch-types/privmsg";
import { parseTwitchMessage } from "dank-twitch-irc/dist/message/parser/twitch-message";
import { PingMessage } from "dank-twitch-irc/dist/message/twitch-types/connection/ping";

export type EventHandler = (message: PrivmsgMessage) => void;

export default class ChatClient {
    ws: WebSocket | undefined;
    eventHandlers: Map<string, EventHandler> = new Map();
    msgQueue: Array<string> = [];
    joinedChannels: Array<string> = [];
    connected: boolean = false;

    addEventHandler = (handler: EventHandler) => {
        const handlerId = Math.random().toString(36).substring(7);

        this.eventHandlers.set(handlerId, handler);

        return handlerId;
    };

    removeEventHandler = (handlerId: string) => {
        this.eventHandlers.delete(handlerId);
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
        this.connected = true;

        for (const msg of this.msgQueue) {
            this.send(msg);
        }
        for (const channel of this.joinedChannels) {
            this.join(channel);
        }
    };

    join = (channel: string) => {
        console.log("Joining", channel);
        const sent = this.send(`JOIN #${channel}`);

        if (sent) {
            this.joinedChannels.push(channel);
        }
    };

    onMessage = (message: MessageEvent) => {
        try {
            console.log(message.data);
            const msg = parseTwitchMessage(message.data);

            if (msg instanceof PrivmsgMessage) {
                this.eventHandlers.forEach((value: EventHandler) => {
                    value(msg);
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
        this.connected = false;
        this.connect();
    };

    onClose = (event: WebSocketCloseEvent) => {
        console.log(event);
        this.connected = false;
        this.connect();
    };

    send = (message: string) => {
        if (typeof this.ws === "undefined" || !this.connected) {
            this.msgQueue.push(message);
            return false;
        }

        try {
            this.ws.send(message);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };
}