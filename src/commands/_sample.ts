import { PREFIX } from "../config.js";
import { ICommandModule, ICommonFunctionsReturn } from "../interface/index.js";

const sample: ICommandModule = {
  name: "command",
  description: "Command description",
  commands: ["command1", "command2"],
  onlyGroup: false,
  usage: `${PREFIX}command`,
  // eslint-disable-next-line no-empty-pattern
  handle: async ({}: ICommonFunctionsReturn) => {
    //cody
  },
};

export default sample;
