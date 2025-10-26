import { PREFIX } from "../config.js";

export const verifyPrefix = (prefix: string) => {
  return prefix === PREFIX;
};

export const hasTypeOrCommand = ({ type, command }) => type && command;
