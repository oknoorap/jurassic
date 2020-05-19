import { LoggerOptions } from "../@types/common.d.ts";

enum LogColor {
  Cyan = 36,
  Yellow = 33,
  Red = 31,
  Green = 32,
}

export const empty = () => {
  console.log("");
};

export const chalk = (color: LogColor = LogColor.Cyan) =>
  `\x1b[${color}m%s\x1b[0m`;

export const log = (messages: any[], options: LoggerOptions) => {
  let { type = "info", label, padding = true } = options;
  let color;
  let logger = console.log;

  if (!label) {
    label = type;
  }

  switch (type) {
    case "info":
      color = LogColor.Cyan;
      logger = console.log;
      break;
    case "warn":
      color = LogColor.Yellow;
      logger = console.warn;
      break;
    case "error":
      color = LogColor.Red;
      logger = console.error;
      break;
    case "success":
      color = LogColor.Green;
      break;
  }

  if (padding) {
    empty();
  }
  logger(chalk(color), `[${label}]`);
  logger(...messages);
};

export const info = (...messages: any[]) => {
  log(messages, { type: "info" });
};

export const warn = (...messages: any[]) => {
  log(messages, { type: "warn" });
};

export const error = (...messages: any[]) => {
  log(messages, { type: "error" });
};

export const success = (...messages: any[]) => {
  log(messages, { type: "success" });
};

export const line = () => {
  console.log(Array.from({ length: 20 }).join("-"));
};
