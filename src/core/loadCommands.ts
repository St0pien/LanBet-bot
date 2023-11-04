import { join } from 'path';
import { readdirSync } from 'fs';
import { SlashCommand } from './types';
import { Collection } from 'discord.js';
import { Logger } from '../infrasturcture/Logger';

export async function loadCommands(
    base: string
): Promise<Collection<string, SlashCommand>> {
    const commands = new Collection<string, SlashCommand>();
    const dirPath = join(__dirname, '..', base);
    const files = readdirSync(dirPath)
        .filter(file => file.endsWith('.ts'))
        .map(async file => {
            const { command }: { command: SlashCommand } = await import(
                join(dirPath, file)
            );
            commands.set(command.builder.name, command);
        });
    await Promise.all(files);
    Logger.info('commands fetched');

    return commands;
}
