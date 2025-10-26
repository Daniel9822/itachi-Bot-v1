import { baileysIs, dowload, extractDataMessage } from "./index.js";
import { BOT_EMOJI } from "../config.js";
import { readFileSync } from "fs";
import { waitMessage } from "./messages.js";
import { WAMessage, WASocket, MiscMessageGenerationOptions } from "baileys";
import { ICommonFunctionsReturn } from "../interface/index.js";

interface OnMessagesUpsertArgs {
  socket: WASocket;
  webMessage: WAMessage;
}

export const loadCommonFuntions = ({
  socket,
  webMessage,
}: OnMessagesUpsertArgs): ICommonFunctionsReturn => {
  const {
    remoteJid,
    prefix,
    commandName,
    args,
    userJid,
    isReply,
    replyJid,
    commandWithPrefix,
  } = extractDataMessage(webMessage);

  const isImage = baileysIs(webMessage, "image");
  const isVideo = baileysIs(webMessage, "video");
  const isSticker = baileysIs(webMessage, "sticker");

  // const checkIsAdmin = async (
  //   socket: WASocket,
  //   remoteJid: string,
  //   userJid: string
  // ) => {
  //   const metadata = await socket.groupMetadata(remoteJid);
  //   if (!metadata.participants?.length) return;
  //   const user = metadata.participants.find((e) => e.id === userJid);
  //   return user?.isAdmin;
  // };

  const isGroup = remoteJid?.split("@").pop() === "g.us";

  const downloadImage = async (
    webMessage: WAMessage,
    filename: string
  ): Promise<string | null> => {
    return await dowload(webMessage, filename, "image", "png");
  };

  const downloadSticker = async (webMessage: WAMessage, filename: string) => {
    return await dowload(webMessage, filename, "sticker", "webp");
  };

  const downloadVideo = async (webMessage: WAMessage, filename: string) => {
    return await dowload(webMessage, filename, "video", "mp4");
  };

  const sendText = async (text: string) => {
    if (!remoteJid) return;
    return await socket.sendMessage(remoteJid, {
      text: `${BOT_EMOJI} ${text}`,
    });
  };

  const sendImageWithCaption = async (
    imagePath: string,
    text: string,
    options?: MiscMessageGenerationOptions
  ) => {
    if (!remoteJid) return;
    return await socket.sendMessage(
      remoteJid,
      {
        image: {
          url: imagePath,
        },
        caption: text,
      },
      options
    );
  };

  const sendReply = async (text: string) => {
    if (!remoteJid) return;
    return await socket.sendMessage(
      remoteJid,
      { text: `${text}` },
      { quoted: webMessage }
    );
  };

  const sendReact = async (emoji: string) => {
    if (!remoteJid) return;
    return await socket.sendMessage(remoteJid, {
      react: {
        text: emoji,
        key: webMessage.key,
      },
    });
  };

  const sendSuccessReact = async () => {
    return await sendReact("✅");
  };

  const sendWaitReact = async () => {
    return await sendReact("⏳");
  };

  const sendWarningReact = async () => {
    return await sendReact("⚠️");
  };

  const sendErrorReact = async () => {
    return await sendReact("❌");
  };

  const sendSuccessReply = async (text: string) => {
    await sendSuccessReact();
    return await sendReply(`✅ ${text}`);
  };

  const sendWaitReply = async (text?: string) => {
    await sendWaitReact();
    return await sendReply(`${text || waitMessage}`);
  };

  const sendWarningReply = async (text: string) => {
    await sendWarningReact();
    return await sendReply(`⚠️ ${text}`);
  };

  const sendErrorReply = async (text: string) => {
    await sendErrorReact();
    return await sendReply(`❌ ${text}`);
  };

  const sendStickerFromFile = async (file: string) => {
    if (!remoteJid) return;
    return await socket.sendMessage(
      remoteJid,
      {
        sticker: readFileSync(file),
      },
      { quoted: webMessage }
    );
  };

  const sendImageFromFile = async (file: string) => {
    if (!remoteJid) return;
    return await socket.sendMessage(
      remoteJid,
      {
        image: readFileSync(file),
      },
      { quoted: webMessage }
    );
  };

  return {
    socket,
    remoteJid,
    userJid,
    prefix,
    commandName,
    args,
    isReply,
    isImage,
    isVideo,
    isSticker,
    replyJid,
    webMessage,
    commandWithPrefix,
    isGroup,
    sendText,
    sendReply,
    sendStickerFromFile,
    sendImageFromFile,
    sendReact,
    sendSuccessReact,
    sendWaitReact,
    sendWarningReact,
    sendErrorReact,
    sendErrorReply,
    sendSuccessReply,
    sendWaitReply,
    sendWarningReply,
    downloadImage,
    downloadSticker,
    downloadVideo,
    sendImageWithCaption,
  };
};
