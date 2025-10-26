import { WASocket } from "baileys";
import { TIMEOUT_BY_EVENT } from "./config.js";
import { onMessagesUpsert } from "./middlewares/onMessagesUpsert.js";
import { welcomeHandle } from "./handler/welcomeHandler.js";
import { removeHandle } from "./handler/removeHandle.js";
import { demoteHandler } from "./handler/demoteHandler.js";
import { promoteHandle } from "./handler/promoteHandle.js";

export const load = (socket: WASocket) => {
  socket.ev.on("messages.upsert", ({ messages }) => {
    setTimeout(() => {
      onMessagesUpsert({ socket, messages });
    }, TIMEOUT_BY_EVENT);
  });

  socket.ev.on("group-participants.update", async (update) => {
    const { id, participants, action } = update;

    const metadata = await socket.groupMetadata(id);

    const user = participants[0];

    if (action === "add") {
      await welcomeHandle(socket, id, metadata, user);
      return;
    }

    if (action === "remove") {
      await removeHandle(socket, id, participants, user);
      return;
    }

    if (action === "demote") {
      await demoteHandler(socket, id, user);
    }

    if (action === "promote") {
      await promoteHandle(socket, id, user);
    }
  });
};
