import { TOKEN } from './env';
import { DiscordClient } from './core/DiscordClient';
import { GatewayIntentBits } from 'discord.js';

(async () => {
    const client = new DiscordClient({
        intents: [GatewayIntentBits.Guilds]
    });

    await client.fetchResources();

    for (const [type, event] of client.events) {
        if (event.once) {
            client.once(type, event.handler);
        } else {
            client.on(type, event.handler);
        }
    }

    client.login(TOKEN);
})();
