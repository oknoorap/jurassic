type Logger = "info" | "warn" | "error" | "success";

type LoggerOptions = {
  label?: string;
  padding?: boolean;
  type: Logger;
};
