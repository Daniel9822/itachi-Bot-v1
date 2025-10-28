import { GroupParticipant, WASocket } from "baileys";
import {
  fancyText,
  formatMessage,
  getImagePath,
  pickRandomIndex,
} from "../utils/index.js";
import { removeMessages } from "../utils/messages.js";
import { IMAGE_DIR } from "../config.js";

export const removeHandle = async (
  socket: WASocket,
  remoteJid: string,
  participants: GroupParticipant[],
  user: GroupParticipant
) => {
  // const indexParticipant = pickRandomIndex(participants.length);
  const indexMessageDemote = pickRandomIndex(removeMessages.length);
  // const randomUser = participants[indexParticipant];

  const message = formatMessage(removeMessages[indexMessageDemote], {
    // user: randomUser.name || `@${randomUser.id?.split("@")[0]}` || '',
    removed:
      user.name ||
      `@${user?.phoneNumber?.split("@")[0]}` ||
      `@${user.id.split("@")[0]}`,
  });

  const imgUrl = await socket.profilePictureUrl(user.id, "image");

  try {
    await socket.sendMessage(remoteJid, {
      image: {
        url: imgUrl || getImagePath(IMAGE_DIR, "itachi.jpg"),
      },
      caption: fancyText(message),
      // mentions: [randomUser?.id ?? ''],
    });
  } catch (error) {
    console.log(error);
  }
};
