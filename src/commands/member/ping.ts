import { PREFIX } from "../../config.js";
import { ICommonFunctionsReturn } from "../../interface/index.js";

export default {
  name: "ping",
  description: "Verificar si el bot esta online",
  commands: ["ping"],
  usage: `${PREFIX}ping`,
  handle: async ({ sendReply, sendReact }: ICommonFunctionsReturn) => {
    //cody
    await sendReact("🏓");
    await sendReply("Pong!");
  },
};
