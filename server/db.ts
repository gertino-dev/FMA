import fs from 'node:fs/promises';
import path from 'node:path';
import { DbShape, PublicDb } from './types';

const DB_PATH = path.resolve(process.cwd(), 'data', 'db.json');

let writeChain: Promise<void> = Promise.resolve();

export async function readDb(): Promise<DbShape> {
  const raw = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(raw) as DbShape;
}

export async function writeDb(next: DbShape): Promise<void> {
  // Serialize writes to avoid concurrent truncation/corruption
  writeChain = writeChain.then(async () => {
    const tmp = `${DB_PATH}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(next, null, 2), 'utf8');
    await fs.rename(tmp, DB_PATH);
  });
  return writeChain;
}

export async function getPublicDb(): Promise<PublicDb> {
  const db = await readDb();
  const { competitions, results, news, athletes, sponsors, media } = db;
  return { competitions, results, news, athletes, sponsors, media };
}

