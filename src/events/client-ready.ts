import { Events } from 'discord.js';
import { Logger } from '../infrasturcture/Logger';

async function handler() {
    Logger.info('Bot is running');
}

export default {
    name: Events.ClientReady,
    once: true,
    handler
};
