import { BOT_EMOJI, BOT_NAME, PREFIX as prefix } from "../config.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const packageInfo = require("../../package.json");
import { readMore } from "./index.js";

export const waitMessage = "⏳ Cargando datos...";

export const menuMessage = () => {
  const date = new Date();

  return `
╭━⊱ ✨ 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐎 ✨ ⊱━
┃
┃ 🤖 Bot: ${BOT_NAME}
┃ 📅 Fecha: ${date.toLocaleDateString("es-DO")}
┃ ⏰ Hora: ${date.toLocaleTimeString("es-DO")}
┃ 🔣 Prefijo: ${prefix}
┃ 💫 Versión: ${packageInfo.version}
┃
╰━━━━━━━━━━━━━━━━━━━╯${readMore()}

╭━⊱ 👑 𝐃𝐔𝐄𝐍𝐎 ⊱━
┃
┃ ${prefix}set-prefix
┃ ${prefix}reiniciar
┃ ${prefix}modo-mantenimiento
┃
╰━━━━━━━━━━━━━━━━━━━╯

╭━⊱ 🛡️ 𝐀𝐃𝐌𝐈𝐍𝐒 ⊱━
┃
┃ ${prefix}abrir
┃ ${prefix}cerrar
┃ ${prefix}add-auto-responder
┃ ${prefix}expulsar
┃ ${prefix}promover
┃ ${prefix}degradar
┃
╰━━━━━━━━━━━━━━━━━━━╯

╭━⊱ 🚀 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐏𝐑𝐈𝐍𝐂𝐈𝐏𝐀𝐋𝐄𝐒 ⊱━
┃
┃ ${prefix}menu
┃ ${prefix}ping
┃ ${prefix}estado
┃ ${prefix}info
┃ ${prefix}ayuda
┃
╰━━━━━━━━━━━━━━━━━━━╯

╭━⊱ 💬 𝐈𝐍𝐅𝐎 ⊱━
┃
┃ 🪐 Gracias por usar *${BOT_NAME}*  
┃ 💌 Creador: wa.me/18293862747
┃ 🌐 Comunidad: galaxybots.dev
┃
╰━━━⊱ 🌟 𝐃𝐈𝐒𝐅𝐑𝐔𝐓𝐀 🌟 ⊱━━━╯
`;
};

export const welcomeMessage = `
  ${BOT_EMOJI} Hola {user} bienvenido a 
{groupName}.

Esparamos que sea de tu agrado
lee las reglas del grupo.

{des}

`;

export const demoteMessages = [
  `{user} Tal como querias, se fue 
ese ridiculo de {demoted} 😂`,

  `No hubo que acompa;ar a {user}
el solito se fue 😢`,
];

export const demoteMessage = `
⚠️ Atencion, al sujeto {user}
sele quito el cargo de admin
que fracaso 🤐
`;

export const promoteMessage = `${BOT_EMOJI} Atencion, acaban de
promover a admin a {user}.
🤐 tengan cuidado.
`