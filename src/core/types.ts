import {
    CacheType,
    ClientEvents,
    Interaction,
    SlashCommandBuilder
} from 'discord.js';

export interface SlashCommand {
    builder: SlashCommandBuilder;
    handler: (interaction: Interaction<CacheType>) => Promise<void>;
}

export interface DiscordEvent<T extends keyof ClientEvents> {
    once?: boolean;
    handler: (...args: ClientEvents[T]) => Promise<void>;
}
