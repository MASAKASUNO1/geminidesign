import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { HISTORY_DIR, HISTORY_FILE } from './config.js';

function historyDir() {
  return path.resolve(HISTORY_DIR);
}

function historyFilePath() {
  return path.join(historyDir(), HISTORY_FILE);
}

async function ensureDir() {
  await mkdir(historyDir(), { recursive: true });
}

export async function loadHistory() {
  try {
    const data = await readFile(historyFilePath(), 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveHistory(entries) {
  await ensureDir();
  await writeFile(historyFilePath(), JSON.stringify(entries, null, 2));
}

export async function addEntry(prompt, html, outputPath) {
  const entries = await loadHistory();
  const id = entries.length > 0 ? Math.max(...entries.map(e => e.id)) + 1 : 1;

  const defaultPath = path.join(HISTORY_DIR, `${id}.html`);
  const finalPath = outputPath || defaultPath;

  await ensureDir();
  await writeFile(finalPath, html);

  const entry = {
    id,
    prompt,
    outputPath: finalPath,
    createdAt: new Date().toISOString(),
  };
  entries.push(entry);
  await saveHistory(entries);
  return entry;
}

export async function getEntry(id) {
  const entries = await loadHistory();
  return entries.find(e => e.id === id) || null;
}

export async function readEntryHtml(entry) {
  return readFile(entry.outputPath, 'utf-8');
}
