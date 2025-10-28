import { GroupMetadata, GroupParticipant, WASocket } from "baileys";
import { welcomeMessage } from "../utils/messages.js";
import {
  fancyText,
  formatMessage,
  getImagePath,
  pickRandomIndex,
} from "../utils/index.js";
import { readdirSync } from "fs";
import { IMAGE_DIR } from "../config.js";

export const welcomeHandle = async (
  socket: WASocket,
  remoteJid: string,
  groupMetadata: GroupMetadata,
  user: GroupParticipant
) => {
  const message = formatMessage(welcomeMessage, {
    user: user.name || `@${user.phoneNumber?.split("@")[0]}`,
    groupName: groupMetadata.subject,
    des: groupMetadata.desc?.toString() || "",
  });

  // Intenta obtener la foto de perfil del usuario
  let userImgUrl: string | undefined;

  try {
    userImgUrl = await socket.profilePictureUrl(user.id, "image");
  } catch (err) {
    console.log("No tiene foto de perfil, se usará imagen random", err);
  }

  // Si no hay foto, elige una random de tu carpeta
  const files = readdirSync(IMAGE_DIR);
  const randomFile = files[pickRandomIndex(files.length)];
  // const fallbackImage = path.join(IMAGE_DIR, randomFile);

  try {
    await socket.sendMessage(remoteJid, {
      image: {
        url: userImgUrl || getImagePath(IMAGE_DIR, randomFile),
      },
      caption: fancyText(message),
      mentions: [user.id],
    });
  } catch (error) {
    console.log(error);
  }
};
