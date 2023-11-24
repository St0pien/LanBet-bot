import {
    ActionRowBuilder,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ComponentType,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import { TeamRepository } from '../repos/TeamRepository';
import { db } from '../infrasturcture/db';

const builder = new SlashCommandBuilder()
    .setName('delete-team')
    .setDescription('Delete team!')
    .addStringOption(option =>
        option
            .setName('team')
            .setDescription('Team to delete')
            .setRequired(true)
            .setAutocomplete(true)
    );

const handler = async (interaction: ChatInputCommandInteraction) => {
    const teamRepo = new TeamRepository(db);

    const input = interaction.options.getString('team')!;

    const team = teamRepo.findByName(input);

    if (team) {
        teamRepo.deleteTeam(team.id!);
        await interaction.reply(`Team ${team.name} deleted!`)
    } else {
        await interaction.reply('no such team exists');
    }
};

const autocomplete = async (interaction: AutocompleteInteraction) => {
    const input = interaction.options.getFocused();
    const teamRepo = new TeamRepository(db);

    const matchedTeams = teamRepo.filterTeams(input);

    await interaction.respond(
        matchedTeams.map(team => ({
            name: team.name,
            value: team.name
        }))
    );
};

export default {
    name: builder.name,
    builder,
    handler,
    autocomplete
};
