import Database from 'bun:sqlite';
import { Singleton } from './Singleton';
import { ensureTable } from '../infrasturcture/db';

@Singleton
export class BetRepository {
    constructor(private readonly _db: Database) {
        ensureTable(
            this._db,
            'bets',
            `CREATE TABLE bets (id INTEGER PRIMARY KEY, username VARCHAR(32) NOT NULL, game INTEGER NOT NULL REFERENCES games(id), team INTEGER NOT NULL REFERENCES teams(id), UNIQUE(username, game))`
        );
    }

    bet(game: number, team: number, user: string) {
        const isActive = this._db.query(
            `SELECT active FROM games WHERE id = ?`
        );

        const { active } = isActive.get(game) as { active: number };

        if (active != 1) throw new Error('Bet closed');

        const bet = this._db.prepare(
            'INSERT INTO bets (username, game, team) VALUES(?, ?, ?)'
        );

        try {
            bet.run(user, game, team);
        } catch {
            throw new Error(`You've already bet!`);
        }
    }
}
