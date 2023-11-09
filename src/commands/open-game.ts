import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';
import { GameRepository } from '../repos/GameRepository';
import { db } from '../infrasturcture/db';
import { ButtonType } from '../buttonHandlers/types';

const builder = new SlashCommandBuilder()
    .setName('open-game')
    .setDescription('Open bets!');

const handler = async (interaction: ChatInputCommandInteraction) => {
    // Selecting game

    const gameRepo = new GameRepository(db);

    const games = gameRepo.listGames();

    const options = games.map((game, pos) =>
        new StringSelectMenuOptionBuilder()
            .setLabel(
                `[${game.id}] ${game.team1.name} vs ${game.team2.name}: ${game.stake}`
            )
            .setValue(pos.toString())
    );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('open-select')
            .setPlaceholder('Game to open')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(...options)
    );

    const res = await interaction.reply({
        components: [row]
    });

    const answer = await res.awaitMessageComponent({
        time: 60_000,
        componentType: ComponentType.StringSelect,
        filter: i => i.user.id == interaction.user.id
    });

    const chosenGame = games[parseInt(answer.values[0])];
    interaction.deleteReply();
    gameRepo.openGame(chosenGame.id!);

    // Creating and sending widget for betting

    const sameURL = `http://dummy.com/${chosenGame.id}`;

    await interaction.followUp({
        embeds: [
            new EmbedBuilder()
                .setURL(sameURL)
                .setTitle('Game')
                .addFields(
                    {
                        name: 'team 1',
                        value: chosenGame.team1.name,
                        inline: true
                    },
                    {
                        name: 'single bet',
                        value: chosenGame.stake.toString(),
                        inline: true
                    },
                    {
                        name: 'team 2',
                        value: chosenGame.team2.name,
                        inline: true
                    }
                )
                .setImage(chosenGame.team1.logo),
            new EmbedBuilder().setURL(sameURL).setImage(chosenGame.team2.logo)
        ],
        components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(
                        JSON.stringify([
                            ButtonType.Bet,
                            chosenGame.id,
                            chosenGame.team1.id
                        ])
                    )
                    .setLabel(chosenGame.team1.name)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(
                        JSON.stringify([
                            ButtonType.Close,
                            chosenGame.id,
                            interaction.user.id
                        ])
                    )
                    .setLabel('Close bets (Admin only)')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(
                        JSON.stringify([
                            ButtonType.Bet,
                            chosenGame.id,
                            chosenGame.team2.id
                        ])
                    )
                    .setLabel(chosenGame.team2.name)
                    .setStyle(ButtonStyle.Success)
            )
        ]
    });
};

export default {
    name: builder.name,
    builder,
    handler
};
