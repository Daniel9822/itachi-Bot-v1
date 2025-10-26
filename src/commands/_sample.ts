import { PREFIX } from "../config.js";
import { ICommonFunctionsReturn } from "../interface/index.js";

const sample = {
  name: "command",
  description: "Command description",
  commands: ["command1", "command2"],
  usage: `${PREFIX}command`,
  handle: async ({}: ICommonFunctionsReturn) => {
    //cody
  },
};

export default sample;
