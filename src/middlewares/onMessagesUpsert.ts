import { WAMessage, WASocket } from "baileys";
import { dynamicCommand } from "../utils/dynamicCommand.js";
import { loadCommonFuntions } from "../utils/loadCommonFuntions.js";

interface OnMessagesUpsertArgs {
  socket: WASocket;
  messages: WAMessage[];
}

export const onMessagesUpsert = async ({
  socket,
  messages,
}: OnMessagesUpsertArgs) => {
  if (!messages?.length) {
    return;
  }

  // intentar encontrar el primer mensaje con payload válido
  const webMessage = messages.find((m) => m?.message && m?.key) || messages[0];

  // si no tiene message (eventos protocol, etc) salir
  if (!webMessage?.message) return;

  // evitar procesar mensajes enviados por el propio cliente (opcional)
  if (webMessage.key?.fromMe) return;

  const commonFuntions = loadCommonFuntions({ socket, webMessage });

  await dynamicCommand(commonFuntions);
};
