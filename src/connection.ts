import makeWASocket, {
  Browsers,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  WASocket,
} from "baileys";
import path from "path";
import { fileURLToPath } from "url";
import { animateBanner, logger } from "./utils/logger.js";
import qrcode from "qrcode-terminal";
import {
  BOT_NAME,
  CONNECTION_TYPE,
  BOT_NUMBER,
  USE_LASTEST_VERSION,
} from "./config.js";
import pino from "pino";


// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const connect = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "..", "assets", "auth", "baileys")
  );

  const { version, isLatest } = await fetchLatestBaileysVersion();

  if (USE_LASTEST_VERSION) {
    logger.info(
      `Version atual de WaWeb: ${version.join(".")} | ${
        isLatest ? "Version maas reciente" : "Esta desactualizado"
      }`
    );
  }

  const socket: WASocket = makeWASocket({
    auth: state,
    browser:
      CONNECTION_TYPE === "NUMBER"
        ? Browsers.ubuntu("Chrome")
        : Browsers.appropriate("Desktop"),
    printQRInTerminal: false,
    version: USE_LASTEST_VERSION ? version : undefined,
    defaultQueryTimeoutMs: undefined,
    logger: pino({ level: "silent" }),
  });

  animateBanner()
  if (CONNECTION_TYPE === "NUMBER" && !socket.authState.creds.registered) {
    try {
      const code = await socket.requestPairingCode(BOT_NUMBER);
      logger.info(`Codigo de emparejamiento: ${code}`);
    } catch (error) {
      logger.error(`Error al obtener el codigo: ${error}`);
    }
  }

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    logger.info(
      `Socket Connection Update: ${connection || ""} ${lastDisconnect || ""}`
    );

    if (qr !== undefined && CONNECTION_TYPE === "QR") {
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      logger.error("Conexion failed");
      if (!lastDisconnect?.error) return;
      const shouldReconnect =
        "output" in lastDisconnect.error &&
        lastDisconnect?.error.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        setTimeout(() => {
          connect();
        }, 500);
      }
    }

    if (connection === "open") {
      logger.info(`${BOT_NAME} is conected`);
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
};
