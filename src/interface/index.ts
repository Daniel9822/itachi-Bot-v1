import { MiscMessageGenerationOptions, WAMessage, WASocket } from "baileys";

export interface IExtractedMessageData {
  remoteJid: string | null | undefined;
  userJid: string | undefined | null;
  prefix: string | null;
  commandName: string | null;
  isReply: boolean | null;
  replyJid: string | null;
  commandWithPrefix: string | null;
  args: string[];
}

export interface ICommonFunctionsReturn {
  socket: WASocket;
  remoteJid: string | null | undefined;
  userJid: string | null | undefined;
  prefix: string | null | undefined;
  commandName: string | null | undefined;
  args: string[];
  isReply: boolean | null;
  isImage: boolean;
  isVideo: boolean;
  isSticker: boolean;
  replyJid: string | null;
  webMessage: WAMessage;
  commandWithPrefix: string | null;

  // 📨 Funciones de envío
  sendText: (text: string) => Promise<unknown>;
  sendReply: (text: string) => Promise<unknown>;
  sendStickerFromFile: (file: string) => Promise<unknown>;
  sendImageFromFile: (file: string) => Promise<unknown>;
  sendImageWithCaption: (
    pathImage: string,
    text: string,
    options: MiscMessageGenerationOptions
  ) => Promise<unknown>;

  // 😊 Reacciones
  sendReact: (emoji: string) => Promise<unknown>;
  sendSuccessReact: () => Promise<unknown>;
  sendWaitReact: () => Promise<unknown>;
  sendWarningReact: () => Promise<unknown>;
  sendErrorReact: () => Promise<unknown>;

  // 💬 Respuestas con reacciones
  sendErrorReply: (text: string) => Promise<unknown>;
  sendSuccessReply: (text: string) => Promise<unknown>;
  sendWaitReply: (text?: string) => Promise<unknown>;
  sendWarningReply: (text: string) => Promise<unknown>;

  // 📥 Descargas
  downloadImage: (webMessage: WAMessage, filename: string) => Promise<unknown>;
  downloadSticker: (
    webMessage: WAMessage,
    filename: string
  ) => Promise<unknown>;
  downloadVideo: (webMessage: WAMessage, filename: string) => Promise<unknown>;
  isGroup: boolean;
}

export interface ICommandModule {
  name: string;
  description: string;
  commands: string[];
  usage: string;
  handle: (args: Record<string, unknown> & ICommonFunctionsReturn) => Promise<void> | void;
  onlyGroup?: boolean;
}

export interface IFindCommandImportResult {
  type: string;
  command: ICommandModule | null;
}
