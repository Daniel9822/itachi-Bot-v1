import InvalidParameterError from "../errors/invalidParameterError.js";
import { hasTypeOrCommand, verifyPrefix } from "../middlewares/index.js";
import { checkPermission } from "../middlewares/checkPermission.js";
import WarningError from "../errors/warningError.js";
import DangerError from "../errors/dangerError.js";
import { findCommandImport } from "./index.js";
import { PREFIX } from "../config.js";
import { ICommonFunctionsReturn } from "../interface/index.js";

export const dynamicCommand = async (paramsHandler: ICommonFunctionsReturn) => {
  const {
    commandName,
    prefix,
    sendWarningReply,
    sendErrorReply,
    commandWithPrefix,
    isGroup,
    remoteJid,
  } = paramsHandler;

  // ...existing code...
  const { type, command } = await findCommandImport(commandName!);

  if (commandWithPrefix?.length === 1 && commandWithPrefix === PREFIX) {
    await sendWarningReply(
      `La forma de escribir un comando es: ${prefix}comando`
    );
  }

  console.log({isGroup})
  console.log({remoteJid})

  if (command?.onlyGroup && !isGroup) {
    sendErrorReply("Este comando solo es permitido en grupos");
    return
  }

  if (!verifyPrefix(prefix!) || !hasTypeOrCommand({ type, command })) {
    return;
  }

  if (!command) {
    await sendWarningReply("❌ Comando no encontrado.");
    return;
  }

  if (!(await checkPermission({ type, ...paramsHandler }))) {
    return sendErrorReply(
      "🔒 No tienes permiso para ejecutar este comando! 🔒"
    );
  }

  try {
    if (typeof command.handle !== "function") {
      await sendErrorReply("Algo salio mal al llamar a la funcion");
      return;
    }
    await command.handle({ ...paramsHandler, type });
  } catch (error) {
    console.log("ERROR: ", error);

    if (error instanceof InvalidParameterError) {
      await sendWarningReply(`Parametros invalidos! ${error.message}`);
    } else if (error instanceof WarningError) {
      await sendWarningReply(`${error.message}`);
    } else if (error instanceof DangerError) {
      await sendErrorReply(`${error.message}`);
    } else {
      // usar access seguro al nombre del comando
      const cmdName = command?.name || commandName || "desconocido";
      const errorMessage =
        (error instanceof Error && error.message) ||
        (typeof error === "object" &&
        error &&
        "message" in error &&
        typeof (error as any).message === "string"
          ? (error as any).message
          : "Error desconocido");
      await sendErrorReply(
        `Ocurrio un error ejecutando el comando "${cmdName}!"
        
📝 *Detalles*: ${errorMessage}
        `
      );
    }
  }
};
