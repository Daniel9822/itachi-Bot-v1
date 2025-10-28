import path from 'path'
import { IMAGE_DIR, PREFIX } from "../../config.js";
import {
  ICommandModule,
  ICommonFunctionsReturn,
} from "../../interface/index.js";
import { readdirSync } from "fs";
import { fancyText, getImagePath, pickRandomIndex } from "../../utils/index.js";
import DangerError from '../../errors/dangerError.js';
import { GroupParticipant } from 'baileys';

const sample: ICommandModule = {
  name: "invocar",
  description: "Invocar a todos los participantes",
  commands: ["invocar", "llamar", "anuncio"],
  onlyGroup: true,
  usage: `${PREFIX}invocar`,
  handle: async ({
    socket,
    remoteJid,
    sendReact,
    isBotAdmin
  }: ICommonFunctionsReturn) => {
    if (!remoteJid) return;

    if(!isBotAdmin) {
        throw new DangerError(fancyText('Necesito admin para invocar'))
    }
    const pathUrl = path.resolve(IMAGE_DIR, "invoke");

    const files = readdirSync(pathUrl);
    const ramdomFile = files[pickRandomIndex(files.length)];

    const { participants } = await socket.groupMetadata(remoteJid);

    const participantsPhone = participants.filter((p) => p.phoneNumber);

    const pushNameOrNumber = (p: GroupParticipant) => p.name ? p.name : `@${p.phoneNumber?.split('@')[0]}`
    await sendReact('📢')
    const caption = `
💫 ${fancyText("*Invocación Shinobi*")} 💫

🌀 *Participantes invocados:*
${participantsPhone.map((p, i) => `⚡ ${i + 1}. ${pushNameOrNumber(p)}`).join("\n")}

🔥 ${fancyText('*Chakra sincronizado.*')} 🔥
`;

    await socket.sendMessage(remoteJid, {
      image: {
        url: getImagePath(pathUrl ,ramdomFile),
      },
      caption,
      mentions: participantsPhone.map((p) => p.id), // Para mencionarlos correctamente
    }, );
  },
};

export default sample;
