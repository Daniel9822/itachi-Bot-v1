import { MUSIC_DIR, PREFIX } from "../../config.js";
import {
  ICommandModule,
  ICommonFunctionsReturn,
} from "../../interface/index.js";
import { fancyText } from "../../utils/index.js";
import { searchVideo } from "../../services/youtubeSearch.js";
import InvalidParameterError from "../../errors/invalidParameterError.js";
import { downloadYt } from "../../services/downloadYt.js";
import path from "path";
import { unlinkSync } from "fs";
// import InvalidParameterError from "../../errors/invalidParameterError.js";

const ytCommand: ICommandModule = {
  name: "play",
  commands: ["yt", "youtube", "song", "play"],
  usage: `${PREFIX}yt <nombre del video o canción>`,
  description: "Busca canciones o videos en YouTube",
  handle: async ({
    socket,
    remoteJid,
    args,
    sendWaitReply,
    userJid,
    sendAudio,
  }: ICommonFunctionsReturn) => {
    const query = args.join(" ");

    if (!query) {
      throw new InvalidParameterError(
        fancyText("Debes proporciornar el nombre de la cancion")
      );
    }

    await sendWaitReply(fancyText("Estoy buscando atento... 🧐"));
    const video = await searchVideo(query);

    if (!video?.url) {
      await socket.sendMessage(remoteJid!, {
        text: fancyText("😕 No encontré ningún video."),
      });
      return;
    }

    const msg = {
      image: { url: video.thumbnail },
      caption: fancyText(`🎵 *Resultado de búsqueda:*
🎬 *Título:* ${video.title}
📝 *Descripcion:* ${video.description}
📺 *Canal:* ${video.author.name}
🕒 *Duración:* ${video.timestamp}
👀 *Vistas:* ${video.views.toLocaleString()}
📅 *Publicado:* ${video.ago}
🔗 *Enlace:* ${video.url}

Descargando
`),
    };

    await socket.sendMessage(remoteJid!, msg);

    // console.log({ input });
    console.log(video.videoId);
    const input = await downloadYt(video.videoId);

    if (!input) return;

    const outputPath = path.join(MUSIC_DIR, input);
    console.log({ outputPath });
    await sendAudio(socket, remoteJid!, userJid!, outputPath, video.title);
    unlinkSync(outputPath);
  },
};

export default ytCommand;
