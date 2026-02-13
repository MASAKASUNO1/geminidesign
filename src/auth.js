import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline';
import { GLOBAL_CONFIG_DIR, API_KEY_FILE } from './config.js';

export async function loadApiKey() {
  // 環境変数が優先
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  try {
    const data = JSON.parse(await readFile(API_KEY_FILE, 'utf-8'));
    return data.apiKey || null;
  } catch {
    return null;
  }
}

async function saveApiKey(apiKey) {
  await mkdir(GLOBAL_CONFIG_DIR, { recursive: true });
  await writeFile(API_KEY_FILE, JSON.stringify({ apiKey }, null, 2), { mode: 0o600 });
}

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function login() {
  const existing = await loadApiKey();
  if (existing) {
    const masked = existing.slice(0, 6) + '...' + existing.slice(-4);
    console.log(`現在のAPIキー: ${masked}`);
    const answer = await prompt('新しいキーを設定しますか? (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      console.log('変更なし。');
      return;
    }
  }
  const key = await prompt('Gemini API Key: ');
  if (!key) {
    console.error('APIキーが入力されませんでした。');
    process.exit(1);
  }
  await saveApiKey(key);
  console.log(`APIキーを保存しました → ${API_KEY_FILE}`);
}

export async function requireApiKey() {
  const key = await loadApiKey();
  if (!key) {
    console.error('APIキーが設定されていません。まず `geminidesign login` を実行してください。');
    process.exit(1);
  }
  return key;
}
