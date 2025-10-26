import { GroupParticipant, WASocket } from "baileys";
import {
  fancyText,
  formatMessage,
  getImagePath,
  pickRandomIndex,
} from "../utils/index.js";
import { demoteMessages } from "../utils/messages.js";

export const removeHandle = async (
  socket: WASocket,
  remoteJid: string,
  participants: GroupParticipant[],
  user: GroupParticipant
) => {
  const indexParticipant = pickRandomIndex(participants.length);
  const indexMessageDemote = pickRandomIndex(demoteMessages.length);
  const randomUser = participants[indexParticipant];

  const message = formatMessage(demoteMessages[indexMessageDemote], {
    user: randomUser.name || `@${randomUser.id?.split("@")[0]}` || '',
    demoted: user.name || `@${user.id?.split("@")[0]} ` || '',
  });

  const imgUrl = await socket.profilePictureUrl(user.id, 'image')

  try {
    await socket.sendMessage(remoteJid, {
      image: {
        url: imgUrl || getImagePath("itachi.jpg"),
      },
      caption: fancyText(message),
      mentions: [randomUser?.id ?? ''],
    });
  } catch (error) {
    console.log(error);
  }
};
