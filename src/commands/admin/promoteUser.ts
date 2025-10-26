import { PREFIX } from "../../config.js";
import DangerError from "../../errors/dangerError.js";
import InvalidParameterError from "../../errors/invalidParameterError.js";
import { promoteOrDemote } from "../../handler/admin/promoteOrDemote.handler.js";
import {
  ICommandModule,
  ICommonFunctionsReturn,
} from "../../interface/index.js";
import { fancyText, formatPhoneNumber, toUserJid } from "../../utils/index.js";

const promoteUser: ICommandModule = {
  name: "promote",
  description: "Promover a un usuario a admin",
  commands: ["promote", "promover", "admin"],
  usage: `${PREFIX}promote (numero)`,
  onlyGroup: true,
  handle: ({...params}) => promoteOrDemote({option: 'promote', commonParams: params})
}
export default promoteUser;
