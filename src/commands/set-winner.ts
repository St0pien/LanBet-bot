import {
    ChatInputCommandInteraction,
    ComponentType,
    SlashCommandBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} from 'discord.js';
import { Game, GameRepository } from '../repos/GameRepository';
import { db } from '../infrasturcture/db';
import { Team } from '../repos/TeamRepository';

export const builder = new SlashCommandBuilder()
    .setName('set-winner')
    .setDescription('Set winner of the game!');

export const handler = async (interaction: ChatInputCommandInteraction) => {
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
            .setCustomId('endgame')
            .setPlaceholder('Choose game to end')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(...options)
    );

    const res = await interaction.reply({
        content: 'Select game',
        components: [row]
    });

    let first = true;
    let game: Game;

    const col = res.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 60_000
    });

    col.on('collect', async i => {
        if (first) {
            await interaction.deleteReply();
            first = false;
            game = games[parseInt(i.values[0])];

            const finalRow =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('winner')
                        .setPlaceholder('winner')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions(
                            new StringSelectMenuOptionBuilder()
                                .setValue('team1')
                                .setLabel(game.team1.name),
                            new StringSelectMenuOptionBuilder()
                                .setValue('team2')
                                .setLabel(game.team2.name)
                        )
                );

            await i.reply({
                content: 'Select winner',
                components: [finalRow]
            });
        } else {
            const winner: Team = game[i.values[0]];

            gameRepo.endGame(game.id, winner.id);
            await i.reply(
                `Winner selected of ${game.team1.name} vs ${game.team2.name}: ${winner.name}`
            );
            await i.message.delete();
        }
    });
};

export const command = {
    builder,
    handler
};
