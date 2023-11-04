import { ButtonInteraction } from 'discord.js';
import { BetRepository } from '../repos/BetRepository';
import { db } from '../infrasturcture/db';
import { TeamRepository } from '../repos/TeamRepository';

export async function betHandler(
    interaction: ButtonInteraction,
    args: number[]
) {
    const betRepo = new BetRepository(db);
    const teamRepo = new TeamRepository(db);
    const [game, teamId] = args;

    const team = teamRepo.getTeam(teamId);

    try {
        betRepo.bet(game, teamId, interaction.user.displayName);
        interaction.reply({
            content: `Your bet on ${team.name} has been registered`,
            ephemeral: true
        });
    } catch (e) {
        if (e instanceof Error) {
            interaction.reply({
                content: `Error: ${e.message}`,
                ephemeral: true
            });
        }
    }
}
