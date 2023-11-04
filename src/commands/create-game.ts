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
import { GameRepository } from '../repos/GameRepository';

const builder = new SlashCommandBuilder()
    .setName('create-game')
    .setDescription('Create game on which people can bet')
    .addNumberOption(option =>
        option
            .setMinValue(0)
            .setName('stake')
            .setDescription('How much single bet costs?')
            .setRequired(true)
    );

const handler = async (interaction: ChatInputCommandInteraction) => {
    const teamRepo = new TeamRepository(db);
    const gameRepo = new GameRepository(db);

    const stake = await interaction.options.getNumber('stake');

    const options = teamRepo
        .listTeams()
        .map(team =>
            new StringSelectMenuOptionBuilder()
                .setLabel(team.name)
                .setValue(team.id!.toString())
        );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('game-select')
            .setPlaceholder('Select teams which will play')
            .setMinValues(2)
            .setMaxValues(2)
            .addOptions(...options)
    );

    const res = await interaction.reply({
        content: 'Select teams which will play',
        components: [row],
        ephemeral: true
    });

    const answer = await res.awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        time: 60_000
    });

    const [team1, team2] = answer.values.map(id => parseInt(id));
    gameRepo.addGame(team1, team2, stake);
    await interaction.editReply({
        content: 'Game created',
        components: []
    });
};

export const command = {
    builder,
    handler
};
