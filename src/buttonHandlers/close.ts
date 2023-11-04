import { ButtonInteraction } from 'discord.js';
import { GameRepository } from '../repos/GameRepository';
import { db } from '../infrasturcture/db';

export async function closeHandler(
    interaction: ButtonInteraction,
    args: any[]
) {
    const [game, user] = args as [number, string];

    if (user != interaction.user.id) {
        interaction.reply({
            content: `You cannot do this!`,
            ephemeral: true
        });
        return;
    }

    const gameRepo = new GameRepository(db);
    gameRepo.closeGame(game);
    await interaction.message.delete();

    const gameInfo = gameRepo.getGame(game);
    await interaction.reply({
        content: `Game ${gameInfo.team1.name} vs ${gameInfo.team2.name} has been closed`
    });
}
