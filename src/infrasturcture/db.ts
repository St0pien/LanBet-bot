import Database from 'bun:sqlite';

export const db = new Database('data/bookmaker.sqlite3');

export function ensureTable(db: Database, table: string, stmt: string) {
    const result = db.prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
    );

    if (!result.get(table)) {
        db.run(stmt);
    }
}
