#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { Command } from 'commander';
import { generateHtml } from '../src/generate.js';
import { addEntry, loadHistory, getEntry, readEntryHtml } from '../src/history.js';
import { login, requireApiKey } from '../src/auth.js';
import { LOGO } from '../src/config.js';

const DEFAULT_LIMIT = 30;

function formatEntry(e) {
  const shortPrompt = e.prompt.length > 50 ? e.prompt.slice(0, 50) + '...' : e.prompt;
  return `[${e.id}] ${shortPrompt}  →  ${e.outputPath}`;
}

function pager(text) {
  return new Promise((resolve) => {
    if (!process.stdout.isTTY) {
      process.stdout.write(text);
      resolve();
      return;
    }
    const proc = spawn(process.env.PAGER || 'less', ['-R'], {
      stdio: ['pipe', 'inherit', 'inherit'],
    });
    proc.stdin.write(text);
    proc.stdin.end();
    proc.on('close', resolve);
  });
}

console.log(LOGO);

const program = new Command();

program
  .name('geminidesign')
  .description('Gemini 3 Flash でHTMLデザインを生成するCLIツール')
  .version('1.0.0');

program
  .command('login')
  .description('Gemini APIキーを設定')
  .action(async () => {
    await login();
  });

program
  .command('gen <prompt>')
  .description('プロンプトからHTMLを生成')
  .option('-o, --output <path>', '出力先ファイルパス')
  .action(async (prompt, opts) => {
    const apiKey = await requireApiKey();
    try {
      console.log('生成中...');
      const html = await generateHtml(prompt, apiKey);
      const entry = await addEntry(prompt, html, opts.output);
      console.log(`生成完了: ID=${entry.id}`);
      console.log(`保存先: ${entry.outputPath}`);
    } catch (err) {
      console.error(`エラー: ${err.message}`);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('生成履歴の一覧を表示')
  .option('-n, --limit <number>', '表示件数', String(DEFAULT_LIMIT))
  .action(async (opts) => {
    const entries = await loadHistory();
    if (entries.length === 0) {
      console.log('履歴はありません。');
      return;
    }
    const limit = Number(opts.limit);
    const target = entries.slice(-limit);
    const lines = target.map(formatEntry).join('\n');

    if (entries.length > limit) {
      const header = `(${entries.length}件中 最新${target.length}件を表示)\n\n`;
      await pager(header + lines + '\n');
    } else {
      await pager(lines + '\n');
    }
  });

program
  .command('show <id>')
  .description('指定IDの生成結果を表示')
  .action(async (id) => {
    const entry = await getEntry(Number(id));
    if (!entry) {
      console.error(`ID ${id} は見つかりません。`);
      process.exit(1);
    }
    console.error(`ID: ${entry.id}`);
    console.error(`Prompt: ${entry.prompt}`);
    console.error(`保存先: ${entry.outputPath}`);
    console.error(`生成日時: ${entry.createdAt}`);
    console.error('---');
    const html = await readEntryHtml(entry);
    process.stdout.write(html);
  });

program
  .command('regen <id>')
  .description('指定IDのプロンプトで再生成')
  .option('-o, --output <path>', '出力先ファイルパス')
  .action(async (id, opts) => {
    const apiKey = await requireApiKey();
    const entry = await getEntry(Number(id));
    if (!entry) {
      console.error(`ID ${id} は見つかりません。`);
      process.exit(1);
    }
    try {
      console.log(`再生成中 (元プロンプト: "${entry.prompt}")...`);
      const html = await generateHtml(entry.prompt, apiKey);
      const newEntry = await addEntry(entry.prompt, html, opts.output);
      console.log(`再生成完了: ID=${newEntry.id}`);
      console.log(`保存先: ${newEntry.outputPath}`);
    } catch (err) {
      console.error(`エラー: ${err.message}`);
      process.exit(1);
    }
  });

program.parse();
