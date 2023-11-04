import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ComponentType
} from 'discord.js';
import { GameRepository } from '../repos/GameRepository';
import { db } from '../infrasturcture/db';

const builder = new SlashCommandBuilder()
    .setName('summary')
    .setDescription('Sums up the game');

const handler = async (interaction: ChatInputCommandInteraction) => {
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

    const answer = await res.awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        time: 60_000
    });

    const game = games[parseInt(answer.values[0])];

    const summary = gameRepo.summup(game.id);

    await answer.reply(
        `Jackpot: ${summary.fullStake}, single bet: ${
            game.stake
        }, every winner gets: ${summary.fullStake / summary.winners.length}`
    );

    await answer.channel.send('Winners: ');

    await answer.channel.send(
        summary.winners.map(winner => `* ${winner.username}`).join('\n')
    );

    await answer.channel.send('Losers: ');

    await answer.channel.send(
        summary.losers.map(loser => `* ${loser.username}`).join('\n')
    );

    await interaction.deleteReply();
};

export const command = {
    builder,
    handler
};
