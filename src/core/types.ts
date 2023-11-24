import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ClientEvents,
    SlashCommandBuilder
} from 'discord.js';

export interface SlashCommand {
    builder: SlashCommandBuilder;
    handler: (interaction: ChatInputCommandInteraction) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export interface DiscordEvent<T extends keyof ClientEvents> {
    once?: boolean;
    handler: (...args: ClientEvents[T]) => Promise<void>;
}
