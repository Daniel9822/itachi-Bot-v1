import { gpt } from "../../services/gpt.js";
import { PREFIX } from "../../config.js";
import DangerError from "../../errors/dangerError.js";
import { ICommonFunctionsReturn } from "../../interface/index.js";

const gptCommand = {
  name: "gpt",
  description: "Comando para hablar con chat gpt",
  commands: ["gpt", "itachi"],
  usage: `${PREFIX}gpt Hola como estas?`,
  handle: async ({
    sendSuccessReply,
    sendErrorReply,
    sendWaitReply,
    args,
  }: ICommonFunctionsReturn) => {
    const text = args[0];

    if (!text) {
      await sendErrorReply(`Para usar este comando debes agregar un text

Ejemplo: ${gptCommand.usage}
`);
      return;
    }

    try {
      await sendWaitReply();

      const response = await gpt(text);
      await sendSuccessReply(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            String((error as any).message)
          : "Error desconocido";

      throw new DangerError(errorMessage);
    }
  },
};

export default gptCommand;
