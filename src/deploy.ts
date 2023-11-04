import { REST, Routes } from 'discord.js';
import { CLIENT_ID, GUILD_ID, TOKEN } from './env';
import { loadCommands } from './core/loadCommands';
import { Logger } from './infrasturcture/Logger';

(async () => {
    const commands = (await loadCommands('commands')).map(com =>
        com.builder.toJSON()
    );

    const rest = new REST().setToken(TOKEN);

    const res = await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        {
            body: commands
        }
    );

    Logger.info(`${commands.length} commands deployed`);
})();
