import { GroupParticipant, WASocket } from "baileys";
import { fancyText, formatMessage } from "../utils/index.js";
import { demoteMessage } from "../utils/messages.js";

export const demoteHandler = async (
  socket: WASocket,
  remoteJid: string,
  userJid: GroupParticipant
) => {
  if (!remoteJid || !userJid) return;

  const message = formatMessage(demoteMessage, {
    user:
      userJid.name ||
      `@${userJid?.phoneNumber?.split("@")[0]}` ||
      `@${userJid.id.split("@")[0]}`,
  });

  await socket.sendMessage(remoteJid, {
    text: fancyText(message),
  });
};
