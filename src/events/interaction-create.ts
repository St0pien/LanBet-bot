import { BaseInteraction, Events } from 'discord.js';
import { Logger } from '../infrasturcture/Logger';
import { ButtonType } from '../buttonHandlers/types';
import { betHandler } from '../buttonHandlers/bet';
import { closeHandler } from '../buttonHandlers/close';
import { DiscordClient } from '../core/DiscordClient';

const buttonHandlers: { [key in ButtonType]: (...args: any) => Promise<void> } =
    {
        [ButtonType.Bet]: betHandler,
        [ButtonType.Close]: closeHandler
    };

async function handler(interaction: BaseInteraction) {
    const client = interaction.client as DiscordClient;

    if (interaction.isButton()) {
        const data = JSON.parse(interaction.customId) as any[];
        const action = data.shift() as ButtonType;
        Logger.info(`Button interaction received type: ${action}`);
        buttonHandlers[action](interaction, data);
    }

    if (interaction.isAutocomplete()) {
        const { autocomplete } = client.commands.get(interaction.commandName)!;

        if (!!autocomplete) {
            try {
                await autocomplete(interaction);
                Logger.success(
                    `${interaction.commandName}#${interaction.id} | Autocomplete succesfull`
                );
            } catch (e) {
                Logger.error(
                    `${interaction.commandName}#${interaction.id} | Error occurred during handling autocomplete: ${e}`
                );
            }
        }
    }

    if (interaction.isChatInputCommand()) {
        Logger.info(
            `${interaction.commandName}#${interaction.id} | Received command interaction`
        );

        const { handler } = client.commands.get(interaction.commandName)!;

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
}

export default {
    name: Events.InteractionCreate,
    handler
};
