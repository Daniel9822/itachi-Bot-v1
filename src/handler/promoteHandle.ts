import { GroupParticipant, WASocket } from "baileys";
import { readdirSync } from "fs";
import {
  fancyText,
  formatMessage,
  getImagePath,
  pickRandomIndex,
} from "../utils/index.js";
import { IMAGE_DIR } from "../config.js";
import { promoteMessage } from "../utils/messages.js";

export const promoteHandle = async (
  socket: WASocket,
  remoteJid: string,
  userJid: GroupParticipant
) => {
  let userImgUrl: string | undefined;

  try {
    userImgUrl = await socket.profilePictureUrl(userJid.id, "image");
  } catch (err) {
    console.log("No tiene foto de perfil, se usará imagen random");
  }

  // Si no hay foto, elige una random de tu carpeta
  const files = readdirSync(IMAGE_DIR);
  const randomFile = files[pickRandomIndex(files.length)];

  const message = formatMessage(promoteMessage, {
    user:
      userJid.name ||
      `@${userJid?.phoneNumber?.split("@")[0]}` ||
      `@${userJid.id.split("@")[0]}`,
  });

  try {
    await socket.sendMessage(remoteJid, {
      image: {
        url: userImgUrl || getImagePath(randomFile),
      },
      caption: fancyText(message),
      mentions: [userJid.id],
    });
  } catch (error) {}
};
