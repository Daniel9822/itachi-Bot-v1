import { GroupParticipant, WASocket } from "baileys";
import {
  fancyText,
  formatMessage,
  getImagePath,
  pickRandomIndex,
} from "../utils/index.js";
import { demoteMessages } from "../utils/messages.js";
import { IMAGE_DIR } from "../config.js";
import { readdirSync } from "fs";

export const demoteHandler = async (
  socket: WASocket,
  remoteJid: string,
  userJid: GroupParticipant
) => {
  if (!remoteJid || !userJid) return;

  let userImgUrl: string | undefined;
  try {
    userImgUrl = await socket.profilePictureUrl(userJid.id, "image");
  } catch (err) {
    console.log("No tiene foto de perfil, se usará imagen random", err);
  }

  const files = readdirSync(IMAGE_DIR);
  const randomFile = files[pickRandomIndex(files.length)];

  const indexMessageDemote = pickRandomIndex(demoteMessages.length);

  const message = formatMessage(demoteMessages[indexMessageDemote], {
    demoted: userJid.name || `@${userJid.phoneNumber?.split("@")[0]} ` || "",
  });

  await socket.sendMessage(remoteJid, {
    image: {
      url: userImgUrl || getImagePath(IMAGE_DIR, randomFile),
    },
    caption: fancyText(message),
    mentions: [userJid.id],
  });
};

//
