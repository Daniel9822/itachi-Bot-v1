import { PREFIX } from "../../config.js";
import { ICommandModule, ICommonFunctionsReturn } from "../../interface/index.js";

const createGroup: ICommandModule = {
  name: "createGroup",
  description: "Crear un grupo con participantes",
  commands: ["create-group", "new-group"],
  onlyGroup: false,
  usage: `${PREFIX}command`,
  // eslint-disable-next-line no-empty-pattern
  handle: async ({}: ICommonFunctionsReturn) => {
    //cody

    console.log('Llego aqui')
  },
};

export default createGroup;
