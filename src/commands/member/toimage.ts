import path from "path";
import { PREFIX, TEMP_DIR } from "../../config.js";
import InvalidParameterError from "../../errors/invalidParameterError.js";
import { unlinkSync } from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { ICommonFunctionsReturn } from "../../interface/index.js";

ffmpeg.setFfmpegPath(ffmpegPath.path);

const toimgageCommand = {
  name: "toimage",
  description: "Transforma un sticker en imagen",
  commands: ["toimage", "toimg"],
  usage: `${PREFIX}toimage manda o responde a un sticker`,
  handle: async ({
    sendImageFromFile,
    webMessage,
    isSticker,
    downloadSticker,
    sendSuccessReact,
    sendErrorReply,
  }: ICommonFunctionsReturn) => {
    if (!isSticker) {
      throw new InvalidParameterError("Debes enviar o responder a un sticker");
    }

    const inputPath = await downloadSticker(webMessage, "input");
    const outputPath = path.resolve(TEMP_DIR, "output.png");

    ffmpeg(inputPath)
      .save(outputPath)
      .on("end", async () => {
        await sendSuccessReact();
        await sendImageFromFile(outputPath);
        unlinkSync(inputPath as string);
        unlinkSync(outputPath);
      })
      .on("error", (error) => {
        unlinkSync(inputPath as string);
        sendErrorReply(error.message);
      });
  },
};

export default toimgageCommand;
