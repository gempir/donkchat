export class ChatConfig {
    public readonly channel: string;

    constructor(channel: string) {
        this.channel = channel.toLowerCase();
    }
}

export class ChatConfigs {
    private configs: { [key: string]: ChatConfig } = {};

    constructor(configs: Array<ChatConfig> = []) {
        for (const cfg of configs) {
            this.configs[cfg.channel] = cfg;
        }
    }

    get length() {
        return Object.values(this.configs).length;
    }

    createNewWith(cfg: ChatConfig) {
        this.configs[cfg.channel] = cfg;

        return new ChatConfigs(this.toArray());
    }

    remove(cfg: ChatConfig) {
        delete this.configs[cfg.channel];
    }

    toArray() {
        return Object.values(this.configs);
    }
}