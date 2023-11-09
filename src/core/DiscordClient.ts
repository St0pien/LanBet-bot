import { join } from 'path';
import { Client, Collection, Events } from 'discord.js';
import { DiscordEvent, SlashCommand } from './types';
import { loadResources } from './loadResources';

export class DiscordClient extends Client {
    commands: Collection<string, SlashCommand> = new Collection();
    events: Collection<string, DiscordEvent<any>> = new Collection();

    async fetchResources() {
        this.commands = await loadResources<SlashCommand>(
            join(__dirname, '..', 'commands')
        );
        this.events = await loadResources<DiscordEvent<any>>(
            join(__dirname, '..', 'events')
        );
    }
}
