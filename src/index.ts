import { BaseInteraction, Events, GatewayIntentBits } from 'discord.js';
import { TOKEN } from './env';
import { DiscordClient } from './core/DiscordClient';
import { loadCommands } from './core/loadCommands';
import { Logger } from './infrasturcture/Logger';
import { betHandler } from './buttonHandlers/bet';
import { ButtonType } from './buttonHandlers/types';
import { closeHandler } from './buttonHandlers/close';

(async () => {
    const commands = await loadCommands('commands');
    const client = new DiscordClient(commands, {
        intents: [GatewayIntentBits.Guilds]
    });

    const buttonHandlers = {
        [ButtonType.Bet]: betHandler,
        [ButtonType.Close]: closeHandler
    };

    client.once(Events.ClientReady, () => {
        Logger.info('Bot is running');
    });

    client.on(
        Events.InteractionCreate,
        async (interaction: BaseInteraction) => {
            if (interaction.isButton()) {
                const data = JSON.parse(interaction.customId) as any[];
                const action = data.shift() as number;
                Logger.info(`Button interaction received type: ${action}`);
                buttonHandlers[action](interaction, data);
            }

            if (!interaction.isChatInputCommand()) return;

            Logger.info(
                `${interaction.commandName}#${interaction.id} | Received command interaction`
            );

            const { handler } = client.commands.get(interaction.commandName);

            try {
                await handler(interaction);
                Logger.success(
                    `${interaction.commandName}#${interaction.id} | handled successfully`
                );
            } catch (e) {
                Logger.error(
                    `${interaction.commandName}#${interaction.id} | Error occurred during handling command: ${e}`
                );
            }
        }
    );

    client.login(TOKEN);
})();
