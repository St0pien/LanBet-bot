import {
    ActionRowBuilder,
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
    .setDescription('Delete team!');

const handler = async (interaction: ChatInputCommandInteraction) => {
    const teamRepo = new TeamRepository(db);

    const options = teamRepo
        .listTeams()
        .map(team =>
            new StringSelectMenuOptionBuilder()
                .setLabel(team.name)
                .setValue(team.id!.toString())
        );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('delete-select')
            .setPlaceholder('Select team to delete!')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(...options)
    );

    const res = await interaction.reply({
        content: 'Select the team!',
        components: [row]
    });

    try {
        const answer = await res.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            time: 60_000
        });

        const [id] = answer.values;
        teamRepo.deleteTeam(parseInt(id));
        answer.update({
            content: 'Team deleted!',
            components: []
        });
    } catch {
        await interaction.deleteReply();
    }
};

export const command = {
    builder,
    handler
};
