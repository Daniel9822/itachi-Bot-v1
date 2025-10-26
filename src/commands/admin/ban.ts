import { BOT_NUMBER, PREFIX } from "../../config.js";
import DangerError from "../../errors/dangerError.js";
import InvalidParameterError from "../../errors/invalidParameterError.js";
import { ICommonFunctionsReturn } from "../../interface/index.js";
import { isSameUser, toUserJid, toUserJidOrLid } from "../../utils/index.js";

const banCommand = {
  name: "ban",
  onlyGroup: true,
  description: "Elimina a un usuario del grupo",
  commands: ["ban", "kick", "remove", "del"],
  usage: `${PREFIX}ban @usuario 
o responde un mensaje del usuario que quieres eliminar`,

  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    userJid,
    webMessage,
    sendErrorReply,
    sendSuccessReact,
    sendReply,
  }: ICommonFunctionsReturn) => {
    if (!args?.length && !isReply) {
      throw new InvalidParameterError(`Debes mencionar o responder un mensaje

Ejemplo: ${banCommand.usage}`);
    }

    console.log(webMessage);
    const botJid = toUserJid(BOT_NUMBER); // @s.whatsapp.net
    const groupMetadata = await socket.groupMetadata(remoteJid!);
    const userId = toUserJidOrLid(args[0]);
    const memberToRemoveJid = isReply ? replyJid : userId;

    const ownerJid = groupMetadata.owner;
    const ownerPhone = groupMetadata.participants.find(
      (e) => e.id === ownerJid
    )?.phoneNumber;

    const isOwner = groupMetadata.participants.find((e) =>
      isSameUser(e, memberToRemoveJid!, userId!)
    );

    if (
      isOwner?.isSuperAdmin ||
      isOwner?.id === ownerJid ||
      ownerPhone === isOwner?.phoneNumber
    ) {
      await sendErrorReply("No tienes poder para eliminar al dueño 😎");
      const participant = webMessage.key.participant;
      if (participant === ownerJid) return;
      await sendReply("Te vas tu por el 😂");
      await socket.groupParticipantsUpdate(
        remoteJid!,
        [participant!],
        "remove"
      );
      return;
    }

    const isIam = groupMetadata?.participants.find((e) =>
      isSameUser(e, userId!, userId!)
    )?.phoneNumber;
    // 3️⃣ Buscar al bot en el grupo usando phoneNumber
    const botParticipant = groupMetadata.participants.find((p) =>
      isSameUser(p, replyJid!, botJid)
    );

    const isBotAdmin = botParticipant?.admin != null;
    if (!isBotAdmin) {
      throw new DangerError(
        "No soy admin en este grupo, no puedo eliminar usuarios"
      );
    }

    if (
      !memberToRemoveJid ||
      !groupMetadata.participants.some((e) =>
        isSameUser(e, memberToRemoveJid, memberToRemoveJid)
      )
    ) {
      throw new InvalidParameterError("Este numero no forma parte del grupo!");
    }

    if (!memberToRemoveJid) {
      throw new InvalidParameterError("Número inválido");
    }

    // Validaciones adicionales
    if (memberToRemoveJid === userJid || isIam === memberToRemoveJid) {
      throw new DangerError("No te puedes auto eliminar 😒");
    }

    if (
      memberToRemoveJid === botJid ||
      memberToRemoveJid === botParticipant?.id
    ) {
      throw new DangerError("No puedo eliminarme a mí mismo desde el comando");
    }

    try {
      await socket.groupParticipantsUpdate(
        remoteJid!,
        [memberToRemoveJid],
        "remove"
      );
      // await sendSuccessReply("Usuario removido correctamente");
      await sendSuccessReact();
    } catch (error) {
      console.log(error);
      throw new DangerError(
        "❌ No se pudo eliminar al usuario. Verifica que sigo siendo admin."
      );
    }
  },
};

export default banCommand;
