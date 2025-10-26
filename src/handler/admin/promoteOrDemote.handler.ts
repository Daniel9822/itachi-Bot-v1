import DangerError from "../../errors/dangerError.js";
import InvalidParameterError from "../../errors/invalidParameterError.js";
import { ICommonFunctionsReturn } from "../../interface/index.js";
import { fancyText, formatPhoneNumber, toUserJidOrLid } from "../../utils/index.js";

type Props = {
  commonParams: ICommonFunctionsReturn;
  option: "promote" | "demote";
};
export const promoteOrDemote = async ({ option, commonParams }: Props) => {
  const {
    socket,
    userJid,
    remoteJid,
    sendSuccessReact,
    isReply,
    replyJid,
    args,
  } = commonParams;

  if (!remoteJid || !userJid) return;

  if (!isReply && !args[0]) {
    throw new InvalidParameterError(
      fancyText(`Debes responder a un mensage
o enviar un numero        
`)
    );
  }

  let memberToPromote: string | null = null;

  if (isReply) {
    memberToPromote = replyJid;
  } else {
    memberToPromote =  toUserJidOrLid(formatPhoneNumber(args[0])!);
  }

  try {
    await socket.groupParticipantsUpdate(remoteJid, [memberToPromote!], option);
    await sendSuccessReact();
  } catch (error) {
    console.log(error)
    throw new DangerError(fancyText("Algo salio mal"));
  }
};
