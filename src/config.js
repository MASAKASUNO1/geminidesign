import path from 'node:path';
import os from 'node:os';

export const HISTORY_DIR = '.geminidesign';
export const HISTORY_FILE = 'history.json';
export const DEFAULT_MODEL = 'gemini-3-flash-preview';
export const AVAILABLE_MODELS = {
  'gemini-3-flash': 'gemini-3-flash-preview',
  'gemini-3-pro': 'gemini-3-pro-preview',
};

export const GLOBAL_CONFIG_DIR = path.join(os.homedir(), '.config', 'geminidesign');
export const API_KEY_FILE = path.join(GLOBAL_CONFIG_DIR, 'credentials.json');

export const LOGO = `
\x1b[36m     ██████╗ ███████╗███╗   ███╗██╗███╗   ██╗██╗
    ██╔════╝ ██╔════╝████╗ ████║██║████╗  ██║██║
    ██║  ███╗█████╗  ██╔████╔██║██║██╔██╗ ██║██║
    ██║   ██║██╔══╝  ██║╚██╔╝██║██║██║╚██╗██║██║
    ╚██████╔╝███████╗██║ ╚═╝ ██║██║██║ ╚████║██║
     ╚═════╝ ╚══════╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝\x1b[0m
\x1b[33m        ⚡ D E S I G N  G E N E R A T O R ⚡\x1b[0m
\x1b[90m        ─────────────────────────────────────\x1b[0m
`;
