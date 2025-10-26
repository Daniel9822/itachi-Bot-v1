import pino from "pino";
import figlet from "figlet";
import gradient from "gradient-string";

export function animateBanner() {
  const text = figlet.textSync("ITACHI BOT", { font: "Big" });
  const rainbow = gradient.rainbow.multiline(text);
  console.log(rainbow);
}

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      levelFirst: true,
      translateTime: true,
      colorize: true,
    }
  }
});



export { logger };