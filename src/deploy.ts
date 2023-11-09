import { REST, Routes } from 'discord.js';
import { CLIENT_ID, GUILD_ID, TOKEN } from './env';
import { loadResources } from './core/loadResources';
import { Logger } from './infrasturcture/Logger';
import { join } from 'path';
import { SlashCommand } from './core/types';

(async () => {
    const commands = (
        await loadResources<SlashCommand>(join(__dirname, 'commands'))
    ).map(com => com.builder.toJSON());

    const rest = new REST().setToken(TOKEN);

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commands
    });

    Logger.info(`${commands.length} commands deployed`);
})();
