
import readline from "readline";
import {
  basePath,
  isDev,
  PREFIX,
  TEMP_DIR,
} from "../config.js";
import { downloadContentFromMessage, GroupParticipant, WAMessage } from "baileys";
import path from "path";
import { writeFile } from "fs/promises";
import { readdirSync } from "fs";
import { createRequire } from "module";
import {
  ICommandModule,
  IExtractedMessageData,
  IFindCommandImportResult,
} from "../interface/index.js";
import { pathToFileURL } from "url";
import { randomBytes } from "crypto";
const require = createRequire(import.meta.url);

export const question = (message) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    return rl.question(message, resolve);
  });
};

export const onlyNumbers = (text: string) => text.replace(/[^0-9]/g, "");

export const toUserJid = (number: string) => `${formatPhoneNumber(number)}@s.whatsapp.net`;

export const extractDataMessage = (
  webMessage: WAMessage
): IExtractedMessageData => {
  const textMessage = webMessage.message?.conversation;
  const extendedTextMessage = webMessage.message?.extendedTextMessage;
  const extendedTextMessageText = extendedTextMessage?.text;
  const imageTextMessage = webMessage.message?.imageMessage?.caption;
  const videoTextMessage = webMessage.message?.videoMessage?.caption;

  const fullMessage =
    textMessage ||
    extendedTextMessageText ||
    imageTextMessage ||
    videoTextMessage;

  if (!fullMessage) {
    return {
      remoteJid: null,
      userJid: null,
      prefix: null,
      commandName: null,
      isReply: null,
      replyJid: null,
      commandWithPrefix: null,
      args: [],
    };
  }

  const isReply =
    !!extendedTextMessage && !!extendedTextMessage.contextInfo?.quotedMessage;

  const replyJid =
    !!extendedTextMessage && !!extendedTextMessage.contextInfo?.participant
      ? extendedTextMessage.contextInfo.participant
      : null;

  const userJid = webMessage?.key?.participant?.replace(
    /:[0-9][0-9]|:[0-9]/g,
    ""
  );

  const [command, ...args] = fullMessage.split(" ");
  const prefix = command.charAt(0);

  const commandWithoutPrefix = command.replace(new RegExp(`^[${PREFIX}]+`), "");

  return {
    remoteJid: webMessage?.key?.remoteJid,
    prefix,
    userJid,
    replyJid,
    isReply,
    commandName: formateCommand(commandWithoutPrefix),
    args: splitByCharacters(args.join(" "), ["\\", "|", "/"]),
    commandWithPrefix: command,
  };
};

export const splitByCharacters = (str: string, characters: string[]) => {
  characters = characters.map((char) => (char === "\\" ? "\\\\" : char));
  const regex = new RegExp(`[${characters.join("")}]`);

  return str
    .split(regex)
    .map((str) => str.trim())
    .filter(Boolean);
};

export const formateCommand = (text) => {
  return onlyLettersAndNumbers(
    removeAccentsAndSpecialCharacters(text?.toLocaleLowerCase()?.trim())
  );
};

export const onlyLettersAndNumbers = (text) => {
  return text.replace(/[^a-zA-Z0-9]/g, "");
};

export const removeAccentsAndSpecialCharacters = (text) => {
  if (!text) return "";

  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const baileysIs = (webMessage: WAMessage, context: string) => {
  return !!getContent(webMessage, context);
};

export const getContent = (webMessage: WAMessage, context: string) => {
  return (
    webMessage.message?.[`${context}Message`] ||
    webMessage?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[
      `${context}Message`
    ]
  );
};

export const dowload = async (
  webMessage: WAMessage,
  filename: string,
  context: string,
  extension: string
): Promise<string | null> => {
  const content = getContent(webMessage, context);

  if (!content) {
    return null;
  }

  const stream = await downloadContentFromMessage(content, context as "image");

  let buffer = Buffer.from([]);

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  const filePath = path.resolve(TEMP_DIR, `${filename}.${extension}`);

  await writeFile(filePath, buffer);

  return filePath;
};

export const findCommandImport = async (
  commandName: string
): Promise<IFindCommandImportResult> => {
  const command = await readCommandImport();

  let typeReturn = "";
  let targetCommandReturn: ICommandModule | null = null;
  let onlyGroup = false;

  for (const [type, commands] of Object.entries(command)) {
    if (!Array.isArray(commands)) {
      continue;
    }
    if (!commands?.length) {
      continue;
    }

    const targetCommand = commands?.find((cmd) =>
      cmd.commands
        .map((cmd) => formateCommand(cmd))
        ?.includes(formateCommand(commandName))
    );

    if (targetCommand) {
      typeReturn = type;
      targetCommandReturn = targetCommand;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onlyGroup = targetCommand.onlyGroup ?? false;
      break;
    }
  }

  console.log({ typeReturn, targetCommandReturn });
  return {
    type: typeReturn,
    command: targetCommandReturn,
  };
};

export const readCommandImport = async (): Promise<
  Record<string, ICommandModule[]>
> => {
  const subDirectories = readdirSync(basePath, { withFileTypes: true })
    .filter((directory) => directory.isDirectory())
    .map((directory) => directory.name);

  const commandImports: Record<string, ICommandModule[]> = {};

  for (const subdir of subDirectories) {
    const subdirectoryPath = path.join(basePath, subdir);
    const files = readdirSync(subdirectoryPath).filter(
      (file) =>
        !file.startsWith("_") && (file.endsWith(".js") || file.endsWith(".ts"))
    );

    const importedFiles = await Promise.all(
      files.map(async (file) => {
        const fullPath = path.join(subdirectoryPath, file);

        const mod = isDev
          ? await import(pathToFileURL(fullPath).href)
          : require(fullPath);

        return mod?.default || mod;
      })
    );

    commandImports[subdir] = importedFiles as ICommandModule[];
  }

  return commandImports;
};

export const readMore = () => {
  const invisibleBreak = "\u200B".repeat(950);
  return invisibleBreak;
};

export function getImagePath(dir: string, filename: string) {
  return path.join(dir, filename);
}

export function toUserJidOrLid(userArg: string) {
  if (!userArg) {
    return null;
  }

  const cleanArg = userArg.replace("@", "");
  return cleanArg.length >= 14
    ? `${cleanArg}@lid`
    : `${cleanArg}@s.whatsapp.net`;
}

export const isSameUser = (a: GroupParticipant, jid: string, phone: string) =>
  a.id === jid || a.phoneNumber === phone;

export function formatMessage(
  template: string,
  replacements: Record<string, string>
) {
  return template.replace(
    /{(\w+)}/g,
    (_, key) => replacements[key] ?? `{${key}}`
  );
}

export function fancyText(text: string, style = "bolditalic") {
  const styles = {
    // Cursiva elegante
    script: {
      a: "𝓪",
      b: "𝓫",
      c: "𝓬",
      d: "𝓭",
      e: "𝓮",
      f: "𝓯",
      g: "𝓰",
      h: "𝓱",
      i: "𝓲",
      j: "𝓳",
      k: "𝓴",
      l: "𝓵",
      m: "𝓶",
      n: "𝓷",
      o: "𝓸",
      p: "𝓹",
      q: "𝓺",
      r: "𝓻",
      s: "𝓼",
      t: "𝓽",
      u: "𝓾",
      v: "𝓿",
      w: "𝔀",
      x: "𝔁",
      y: "𝔂",
      z: "𝔃",
      A: "𝓐",
      B: "𝓑",
      C: "𝓒",
      D: "𝓓",
      E: "𝓔",
      F: "𝓕",
      G: "𝓖",
      H: "𝓗",
      I: "𝓘",
      J: "𝓙",
      K: "𝓚",
      L: "𝓛",
      M: "𝓜",
      N: "𝓝",
      O: "𝓞",
      P: "𝓟",
      Q: "𝓠",
      R: "𝓡",
      S: "𝓢",
      T: "𝓣",
      U: "𝓤",
      V: "𝓥",
      W: "𝓦",
      X: "𝓧",
      Y: "𝓨",
      Z: "𝓩",
    },

    // Gótico / Blackletter
    gothic: {
      a: "𝔞",
      b: "𝔟",
      c: "𝔠",
      d: "𝔡",
      e: "𝔢",
      f: "𝔣",
      g: "𝔤",
      h: "𝔥",
      i: "𝔦",
      j: "𝔧",
      k: "𝔨",
      l: "𝔩",
      m: "𝔪",
      n: "𝔫",
      o: "𝔬",
      p: "𝔭",
      q: "𝔮",
      r: "𝔯",
      s: "𝔰",
      t: "𝔱",
      u: "𝔲",
      v: "𝔳",
      w: "𝔴",
      x: "𝔵",
      y: "𝔶",
      z: "𝔷",
      A: "𝔄",
      B: "𝔅",
      C: "ℭ",
      D: "𝔇",
      E: "𝔈",
      F: "𝔉",
      G: "𝔊",
      H: "ℌ",
      I: "ℑ",
      J: "𝔍",
      K: "𝔎",
      L: "𝔏",
      M: "𝔐",
      N: "𝔑",
      O: "𝔒",
      P: "𝔓",
      Q: "𝔔",
      R: "ℜ",
      S: "𝔖",
      T: "𝔗",
      U: "𝔘",
      V: "𝔙",
      W: "𝔚",
      X: "𝔛",
      Y: "𝔜",
      Z: "ℨ",
    },

    // Burbuja
    bubble: Object.fromEntries(
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        .split("")
        .map((ch, i) => [
          ch,
          String.fromCodePoint(i < 26 ? 0x24d0 + i : 0x24b6 + (i - 26)),
        ])
    ),

    // Monoespaciado
    monospace: Object.fromEntries(
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        .split("")
        .map((ch, i) => [
          ch,
          String.fromCodePoint(i < 26 ? 0xff41 + i : 0xff21 + (i - 26)),
        ])
    ),

    // Negrita cursiva moderna
    bolditalic: {
      a: "𝙖",
      b: "𝙗",
      c: "𝙘",
      d: "𝙙",
      e: "𝙚",
      f: "𝙛",
      g: "𝙜",
      h: "𝙝",
      i: "𝙞",
      j: "𝙟",
      k: "𝙠",
      l: "𝙡",
      m: "𝙢",
      n: "𝙣",
      o: "𝙤",
      p: "𝙥",
      q: "𝙦",
      r: "𝙧",
      s: "𝙨",
      t: "𝙩",
      u: "𝙪",
      v: "𝙫",
      w: "𝙬",
      x: "𝙭",
      y: "𝙮",
      z: "𝙯",
      A: "𝘼",
      B: "𝘽",
      C: "𝘾",
      D: "𝘿",
      E: "𝙀",
      F: "𝙁",
      G: "𝙂",
      H: "𝙃",
      I: "𝙄",
      J: "𝙅",
      K: "𝙆",
      L: "𝙇",
      M: "𝙈",
      N: "𝙉",
      O: "𝙊",
      P: "𝙋",
      Q: "𝙌",
      R: "𝙍",
      S: "𝙎",
      T: "𝙏",
      U: "𝙐",
      V: "𝙑",
      W: "𝙒",
      X: "𝙓",
      Y: "𝙔",
      Z: "𝙕",
    },
  };

  const map = styles[style] || styles.script;
  return text
    .split("")
    .map((ch) => map[ch] || ch)
    .join("");
}

export function pickRandomIndex(length: number) {
  if (length <= 0) return 0;
  return Math.floor(Math.random() * length);
}

export function formatPhoneNumber(raw: string): string | null {
  // Elimina todo excepto dígitos
  const digits = raw.replace(/\D/g, "");

  // Solo números razonables (10-15 dígitos)
  if (digits.length >= 10 && digits.length <= 15) {
    return digits;
  }

  return null;
}

export function generateRamdomText() {
  const length = 8;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?";
  const bytes = randomBytes(length);
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[bytes[i] % chars.length];
  }

  return password;
}
