import { WASocket } from "baileys";

type Props = {
  type: string;
  socket: WASocket;
  userJid: string | null | undefined;
  remoteJid: string | null | undefined;
};

export const checkPermission = async ({
  type,
  socket,
  userJid,
  remoteJid,
}: Props) => {
  if (type === "member") {
    return true;
  }

  const { participants, owner } = await socket.groupMetadata(remoteJid!);
  const participant = participants.find((p) => p.id === userJid);

  if (!participant) {
    return false;
  }

  const isOwner =
    participant.id === owner || participant.admin === "superadmin";

  const isAdmin = participant.admin === "admin";

  if (type === "admin") {
    return isOwner || isAdmin;
  }

  if (type === "owner") {
    return isOwner;
  }

  return false;
};
