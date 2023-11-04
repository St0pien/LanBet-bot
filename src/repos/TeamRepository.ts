import { ensureTable } from '../infrasturcture/db';
import { Singleton } from './Singleton';
import Database from 'bun:sqlite';

export interface Team {
    id?: number;
    name: string;
    logo: string; // URL in reality
}

@Singleton
export class TeamRepository {
    constructor(private readonly _db: Database) {
        ensureTable(
            this._db,
            'teams',
            `CREATE TABLE teams(id INTEGER PRIMARY KEY, name VARCHAR(128) NOT NULL, logo TEXT NOT NULL)`
        );
    }

    addTeam(team: Team) {
        const insert = this._db.prepare(
            `INSERT INTO teams (name, logo) VALUES (?, ?)`
        );
        insert.run(team.name, team.logo);
    }

    listTeams(): Team[] {
        const result: Team[] = this._db
            .query('SELECT * FROM teams')
            .all() as Team[];
        return result;
    }

    deleteTeam(id: number) {
        const del = this._db.prepare(`DELETE FROM teams WHERE id=?`);
        del.run(id);
    }

    getTeam(id: number): Team {
        const q = this._db.query(`SELECT * FROM teams WHERE id = ?`);
        return q.get(id) as Team;
    }
}
