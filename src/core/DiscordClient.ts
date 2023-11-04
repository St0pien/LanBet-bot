import { Client, ClientOptions, Collection } from 'discord.js';
import { SlashCommand } from './types';

export class DiscordClient extends Client {
    commands: Collection<string, SlashCommand>;

    constructor(
        commands: Collection<string, SlashCommand>,
        options: ClientOptions
    ) {
        super(options);
        this.commands = commands;
    }
}