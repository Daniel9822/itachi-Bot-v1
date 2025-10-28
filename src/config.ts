import { config } from "dotenv";
config();
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TIMEOUT_BY_EVENT = 500;

export const PREFIX = "!";
export const BOT_EMOJI = "🫡";
export const BOT_NAME = "Itachi Bot";
export const BOT_NUMBER = "13656526343";
export const CONNECTION_TYPE: "QR" | "NUMBER" = "QR"; // "NUMBER" (si quier usar el número para login)
// export const PHONE_NUMBER = "13656526343"; // +55 (68) 9200-0000 -> 556892000000 (formato para número)
export const USE_LASTEST_VERSION = true;

export const COMMANDS_DIR = path.resolve(__dirname, "commands");
export const DIST_COMMANDS = path.resolve(__dirname, "..", "dist", "commands");
export const IMAGE_DIR = path.resolve(__dirname, "..", "assets", "images");
export const MUSIC_DIR = path.resolve(__dirname, "..", "assets", "music");

export const TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const YOUTUBE_API = process.env.YOUTUBE_API;

export const isDev = true;
export const basePath = isDev
  ? path.resolve(COMMANDS_DIR)
  : path.resolve(DIST_COMMANDS);
