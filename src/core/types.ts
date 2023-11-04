import { CacheType, Interaction, SlashCommandBuilder } from 'discord.js';

export interface SlashCommand {
    builder: SlashCommandBuilder;
    handler: (interaction: Interaction<CacheType>) => Promise<void>;
}
