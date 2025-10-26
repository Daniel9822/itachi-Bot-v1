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
  `😂 {demoted} perdió su corona...
ahora es del montón otra vez.`,

  `😏 {demoted} quiso mandar mucho
y terminó sin rango.`,

  `🤡 {demoted} bajó más rápido
que el precio del dólar.`,

  `🔥 {demoted} ya no tiene poder,
pero sigue con el mismo ego.`,

  `🙃 {demoted} fue degradado con estilo,
bueno... con lo poco que le quedaba.`,

  `😒 {demoted} se quedó sin admin
y sin respeto también.`,

  `🤭 {demoted} ya no es admin,
ahora solo puede mirar y llorar.`,

  `💀 {demoted} cayó del trono,
y de paso se rompió el orgullo.`,

  `😤 {demoted} perdió el poder,
pero ganó experiencia en humillaciones.`,

  `👋 {demoted} fue despedido como admin,
sin carta, sin aviso, sin dignidad.`
];



export const demoteMessage = `
⚠️ Atencion, al sujeto {user}
sele quito el cargo de admin
que fracaso 🤐
`;

// export const promoteMessage = `${BOT_EMOJI} Atencion, acaban de
// promover a admin a {user}.
// 🤐 tengan cuidado.
// `

export const promoteMessages = [
  `👑 {user} subió de nivel...
espero que no se le suba también el ego.`,

  `🔥 {user} ahora es admin,
pero sigue siendo el mismo desastre.`,

  `😏 Felicidades {user},
ahora puedes oprimir al pueblo.`,

  `😂 {user} ascendió...
aunque nadie sabe por qué.`,

  `💼 {user} tiene poder,
pero no sabe usar ni el WhatsApp.`,

  `🚀 {user} ahora es admin,
el grupo está oficialmente en peligro.`,

  `🤡 {user} con poder... 
¿qué podría salir mal?`,

  `🙌 {user} fue promovido,
ya se siente CEO del grupo.`,

  `😎 {user} ahora manda,
aunque nadie lo respete.`,

  `💥 {user} acaba de obtener admin,
prepárense para el caos.`
];

export const removeMessages = [
  `👋 {removed} fue expulsado
como si nunca hubiera existido.`,

  `💨 {removed} salió volando del grupo,
sin despedirse ni nada.`,

  `😂 {removed} eliminado con estilo...
bueno, con un toque de humillación.`,

  `🚫 {removed} ya no forma parte del grupo,
y nadie lo va a extrañar.`,

  `🔥 {removed} fue removido del mapa,
descansa en paz (del grupo).`,

  `😈 {removed} fuera del grupo,
una decisión sabia, por fin.`,

  `🤭 {removed} expulsado sin anestesia,
justicia poética.`,

  `🧹 {removed} fue barrido del grupo,
como la basura del lunes.`,

  `😤 {removed} ya no está...
y el grupo respira mejor.`,

  `💀 {removed} fue eliminado,
y el drama bajó un 80%.`
];
