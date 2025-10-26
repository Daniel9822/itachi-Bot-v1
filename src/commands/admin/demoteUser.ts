import { PREFIX } from "../../config.js";
import { promoteOrDemote } from "../../handler/admin/promoteOrDemote.handler.js";
import { ICommandModule } from "../../interface/index.js";

const demoteUser: ICommandModule = {
  name: "promote",
  description: "Promover a un usuario a admin",
  commands: ["demote"],
  usage: `${PREFIX}demote (numero)`,
  onlyGroup: true,
  handle: ({ ...params }) =>
    promoteOrDemote({ option: "demote", commonParams: params }),
};
export default demoteUser;
