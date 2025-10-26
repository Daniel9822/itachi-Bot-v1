// import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config.js";

export const gpt = async (text: string) => {
  if (!OPENAI_API_KEY) {
    throw new Error("La api key no esta definida");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", text }],
    }),
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  });

  const data = await response.json();

  if (data?.error.type === "insufficient_quota") {
    throw new Error("Servicio no disponible");
  }

  return data.choices[0].message.content;
};
