import { TOKEN } from './env';
import { DiscordClient } from './core/DiscordClient';
import { GatewayIntentBits } from 'discord.js';
import { TeamRepository } from './repos/TeamRepository';
import { db } from './infrasturcture/db';

(async () => {
    const repo = new TeamRepository(db);

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
