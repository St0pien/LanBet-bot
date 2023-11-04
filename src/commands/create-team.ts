import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder
} from 'discord.js';
import { TeamRepository } from '../repos/TeamRepository';
import { db } from '../infrasturcture/db';

const builder = new SlashCommandBuilder()
    .setName('create-team')
    .setDescription('Create team which will take part in play-offs.')
    .addStringOption(option =>
        option
            .setName('team')
            .setDescription('Name of the team')
            .setRequired(true)
            .setMaxLength(128)
    )
    .addAttachmentOption(option =>
        option.setName('logo').setDescription('Team logo').setRequired(true)
    );

const handler = async (interaction: ChatInputCommandInteraction) => {
    const teamRepo = new TeamRepository(db);
    const name = interaction.options.getString('team');
    const logo = interaction.options.getAttachment('logo').url;

    teamRepo.addTeam({
        name,
        logo
    });

    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(name)
                .setDescription('Created succesfully!')
                .setImage(logo)
        ]
    });
};

export const command = {
    builder,
    handler
};
