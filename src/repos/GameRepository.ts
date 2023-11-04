import Database from 'bun:sqlite';
import { ensureTable } from '../infrasturcture/db';
import { Singleton } from './Singleton';
import { Team } from './TeamRepository';

export interface Game {
    id?: number;
    team1: Team;
    team2: Team;
    stake: number;
    active: boolean;
    winner?: number;
}

@Singleton
export class GameRepository {
    constructor(private readonly _db: Database) {
        ensureTable(
            this._db,
            'games',
            `CREATE TABLE games (id INTEGER PRIMARY KEY, team1 INTEGER NOT NULL REFERENCES teams(id), team2 INTEGER NOT NULL REFERENCES teams(id), stake REAL NOT NULL, active INTEGER, winner INTEGER REFERENCES teams(id))`
        );
    }

    addGame(firstTeamId: number, secondTeamId: number, stake: number) {
        const insert = this._db.prepare(
            `INSERT INTO games (team1, team2, stake, active) VALUES (?, ?, ?, ?)`
        );

        insert.run(firstTeamId, secondTeamId, stake, false);
    }

    listGames(): Game[] {
        const rows = this._db
            .query(
                'SELECT games.id, t1.id as id1, t1.name as name1, t1.logo as logo1, t2.id as id2, t2.name as name2, t2.logo as logo2, stake, active, winner FROM games	LEFT JOIN  teams AS t1 ON t1.id = games.team1 LEFT JOIN teams AS t2 ON t2.id = games.team2'
            )
            .all();

        return rows.map(GameRepository.deserialize);
    }

    getGame(game: number): Game {
        const row = this._db.query(
            `SELECT games.id, t1.id as id1, t1.name as name1, t1.logo as logo1, t2.id as id2, t2.name as name2, t2.logo as logo2, stake, active, winner FROM games	LEFT JOIN  teams AS t1 ON t1.id = games.team1 LEFT JOIN teams AS t2 ON t2.id = games.team2 WHERE games.id = ?`
        );
        return GameRepository.deserialize(row.get(game));
    }

    openGame(id: number) {
        const update = this._db.prepare(
            `UPDATE games SET active = 1 WHERE id=?`
        );
        update.run(id);
    }

    closeGame(id: number) {
        const update = this._db.prepare(
            `UPDATE games SET active = 0 WHERE id=?`
        );
        update.run(id);
    }

    endGame(id: number, winner: number) {
        const update = this._db.prepare(
            `UPDATE games SET active = 2, winner=? WHERE id=?`
        );
        update.run(winner, id);
    }

    summup(id: number) {
        const fullStake = (
            this._db
                .query(
                    `SELECT COUNT(*) * stake as full FROM bets inner join games on games.id = bets.game where game = ?`
                )
                .get(id) as { full: number }
        ).full;

        const game = this.getGame(id);
        const winners = this._db
            .query(`SELECT username FROM bets WHERE game = ? AND team = ?`)
            .all(id, game.winner);
        const losers = this._db
            .query(`SELECT username FROM bets WHERE game = ? AND team = ?`)
            .all(
                id,
                game.team1.id == game.winner ? game.team2.id : game.team1.id
            );

        return {
            winners,
            losers,
            fullStake
        } as {
            winners: { username: string }[];
            losers: { username: string }[];
            fullStake: number;
        };
    }

    static deserialize({
        id,
        id1,
        name1,
        logo1,
        id2,
        name2,
        logo2,
        stake,
        active,
        winner
    }: any): Game {
        return {
            id,
            team1: {
                id: id1,
                name: name1,
                logo: logo1
            },
            team2: {
                id: id2,
                name: name2,
                logo: logo2
            },
            stake,
            active,
            winner
        };
    }
}
