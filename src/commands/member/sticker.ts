// import { exec } from "child_process";
import { TEMP_DIR } from "../../config.js";
import InvalidParameterError from "../../errors/invalidParameterError.js";
import { PREFIX } from "../../config.js";
import path from "path";
import { unlinkSync } from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { ICommonFunctionsReturn } from "../../interface/index.js";

ffmpeg.setFfmpegPath(ffmpegPath.path);

const stickerCommand = {
  name: "sticker",
  description: "Crear sticker desde un video, imagen o gif",
  commands: ["sticker", "s"],
  usage: `${PREFIX}sticker (enviando una imagen/gif/video) o ${PREFIX}sticker (respondiendo una imagen/gif/video) `,
  handle: async ({
    isImage,
    isVideo,
    downloadImage,
    downloadVideo,
    webMessage,
    sendErrorReply,
    sendSuccessReact,
    sendStickerFromFile,
    sendErrorReact,
  }: // sendWaitReact,
  ICommonFunctionsReturn) => {
    if (!isImage && !isVideo) {
      throw new InvalidParameterError(`Debes enviar o responder a una imagen`);
    }

    const outputPath: string = path.resolve(TEMP_DIR, "output.webp");

    if (isImage) {
      const inputPath = await downloadImage(webMessage, "input");

      ffmpeg(inputPath)
        .outputOptions([
          "-vcodec",
          "libwebp",
          "-vf",
          "scale=512:512:force_original_aspect_ratio=decrease",
        ])
        .save(outputPath)
        .on("end", async () => {
          await sendSuccessReact();
          await sendStickerFromFile(outputPath);
          unlinkSync(inputPath as string);
          unlinkSync(outputPath);
        })
        .on("error", async (error) => {
          console.error("❌ FFmpeg error:", error);
          unlinkSync(inputPath as string);
          await sendErrorReact();
          await sendErrorReply(error.message);
        });
    } else {
      const inputPath = await downloadVideo(webMessage, "input");

      const size = 10;
      const seconds =
        webMessage.message?.videoMessage?.seconds ||
        webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
          ?.videoMessage?.seconds;

      const haveSecondsRule = seconds! <= size;

      if (!haveSecondsRule) {
        unlinkSync(inputPath as string);
        await sendErrorReply(`El video debe tener menos de ${size} segundos`);
        return;
      }

      ffmpeg(inputPath)
        .outputOptions([
          "-vcodec",
          "libwebp",
          "-fs",
          "0.99M",
          "-filter_complex",
          "[0:v] scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000, fps=15, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
          "-f",
          "webp",
        ])
        .save(outputPath)
        .on("end", async () => {
          await sendSuccessReact();
          await sendStickerFromFile(outputPath);
          unlinkSync(inputPath as string);
          unlinkSync(outputPath);
        })
        .on("error", (error) => {
          console.error("❌ FFmpeg error:", error);
          unlinkSync(inputPath as string);
          throw new Error(error);
        });
    }
  },
};

export default stickerCommand;
