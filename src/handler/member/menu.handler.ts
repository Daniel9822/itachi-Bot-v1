import { readdirSync } from "fs";
import { ICommonFunctionsReturn } from "../../interface/index.js";
import { getImagePath, pickRandomIndex } from "../../utils/index.js";
import { menuMessage } from "../../utils/messages.js";
import { IMAGE_DIR } from "../../config.js";

export const handleMenu = async ({
  sendImageWithCaption,
  sendSuccessReact,
  webMessage,
}: ICommonFunctionsReturn) => {
  const files = readdirSync(IMAGE_DIR);
  const randomFilePath = files[pickRandomIndex(files.length)];

  await sendSuccessReact();
  await sendImageWithCaption(getImagePath(IMAGE_DIR, randomFilePath), menuMessage(), {
    quoted: webMessage,
  });
};
