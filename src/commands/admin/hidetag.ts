import { PREFIX } from "../../config.js";
import DangerError from "../../errors/dangerError.js";
import InvalidParameterError from "../../errors/invalidParameterError.js";
import {
  ICommandModule,
  ICommonFunctionsReturn,
} from "../../interface/index.js";
import { fancyText } from "../../utils/index.js";

const hidetag: ICommandModule = {
  name: "hidetag",
  description: "Marcar a todos de forma oculta",
  commands: ["hidetag", "tagall"],
  onlyGroup: true,
  usage: `${PREFIX}hidetag`,
  handle: async ({
    socket,
    sendText,
    args,
    remoteJid,
    isBotAdmin,
    sendReact,
  }: ICommonFunctionsReturn) => {
    if (!args.length || !remoteJid) {
      throw new InvalidParameterError(fancyText("Debes enviar un texto"));
    }
    const isAdmin = await isBotAdmin(socket, remoteJid);

    if (!isAdmin) {
      throw new DangerError(fancyText("No soy admin"));
    }

    if (!remoteJid) {
      return;
    }

    await sendReact("📣");
    const groupMetadata = await socket.groupMetadata(remoteJid);

    const participantsId = groupMetadata.participants.map(({ id }) => id);

    await sendText(fancyText(args.join(" ")), participantsId);
  },
};

export default hidetag;
