import { PREFIX } from "../../config.js";
import DangerError from "../../errors/dangerError.js";
import InvalidParameterError from "../../errors/invalidParameterError.js";
import WarningError from "../../errors/warningError.js";
import { ICommonFunctionsReturn } from "../../interface/index.js";
import {
  fancyText,
  formatPhoneNumber,
  onlyNumbers,
  toUserJid,
} from "../../utils/index.js";

const addUserGroup = {
  name: "add",
  description: "Agrega un nuevo mienbro al grupo atraves de un numero",
  commands: ["add", "agregar"],
  usage: `${PREFIX}add +1859885474`,
  handle: async ({
    args,
    socket,
    remoteJid,
    userJid,
    sendWaitReact,
    sendWaitReply,
    sendSuccessReact,
    isReply,
  }: ICommonFunctionsReturn) => {
    if (!remoteJid) return;

    if (!args[0] && !isReply) {
      throw new InvalidParameterError(
        fancyText(`Parametros invalidos.

Uso: ${addUserGroup.usage}
`)
      );
    }

    if (isReply) {
      throw new WarningError(
        fancyText(`Para agregar a este usuario
debes usar el comando !add (numero)

*No respondiendo al mensaje*`)
      );
    }

    const number = formatPhoneNumber(args[0]);

    if (!number) {
      throw new InvalidParameterError(fancyText("Numero invalido"));
    }

    const member = toUserJid(onlyNumbers(number));

    await sendWaitReply();

    try {
      await socket.groupParticipantsUpdate(remoteJid, [member], "add");
      await sendSuccessReact();
    } catch (error) {
      throw new DangerError(
        fancyText(`No se pudo agregar al grupo.
revisa si el numero esta
bien escrito`)
      );
    }
  },
};

export default addUserGroup;
