import { GoogleGenAI } from '@google/genai';
import { MODEL_NAME } from './config.js';

export async function generateHtml(prompt, apiKey) {
  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `あなたはWebデザインの専門家です。ユーザーの要望に基づいて、完全なHTMLファイルを1つ生成してください。
- CSSはHTML内に<style>タグで含めてください。
- JavaScriptが必要な場合は<script>タグで含めてください。
- 外部ライブラリは使わず、単体で動作するHTMLにしてください。
- HTMLコードのみを返してください。説明文は不要です。`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { systemInstruction },
  });

  let html = response.text;

  // マークダウンのコードブロックで囲まれている場合は除去
  html = html.replace(/^```html\s*\n?/i, '').replace(/\n?```\s*$/i, '');

  return html.trim();
}
