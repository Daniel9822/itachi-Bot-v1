import { PREFIX } from "../../config.js";
import { handleMenu } from "../../handler/member/menu.handler.js";

export default {
  name: "menu",
  description: "Mustra el menu",
  commands: ["menu", "help"],
  usage: `${PREFIX}menu`,
  handle: handleMenu
};
