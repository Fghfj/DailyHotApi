import { config } from "../config.js";
import { createLogger, format, transports } from "winston";
import path from "path";
import chalk from "chalk";

let pathOption: any[] = [];

// 日志输出目录
if (config.USE_LOG_FILE) {
  try {
    pathOption = [
      new transports.File({
        filename: path.resolve("logs/error.log"),
        level: "error",
        maxsize: 1024 * 1024,
        maxFiles: 1,
      } as any),
      new transports.File({
        filename: path.resolve("logs/logger.log"),
        maxsize: 1024 * 1024,
        maxFiles: 1,
      } as any),
    ];
  } catch (error) {
    console.error("Failed to initialize log files. Logging to a file will be skipped.", error);
    pathOption = [];
  }
}

// 定义不同日志级别的彩色块
const levelColors: { [key: string]: string } = {
  error: chalk.bgRed(" ERROR "),
  warn: chalk.bgYellow(" WARN "),
  info: chalk.bgBlue(" INFO "),
  debug: chalk.bgGreen(" DEBUG "),
  default: chalk.bgWhite(" LOG "),
};

// 自定义控制台日志输出格式
const consoleFormat = format.printf(({ level, message, timestamp, stack }) => {
  // 获取原始日志级别
  const originalLevel = Object.keys(levelColors).find((lvl) => level.includes(lvl)) || "default";
  const colorLevel = levelColors[originalLevel] || levelColors.default;

  let logMessage = `${colorLevel} [${timestamp}] ${message}`;
  if (stack) {
    logMessage += `\n${stack}`;
  }
  return logMessage;
});

// 创建 logger 实例
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: pathOption,
});

// 控制台输出
if (process.env.NODE_ENV !== "production") {
  try {
    logger.add(
      new transports.Console({
        format: format.combine(format.colorize(), consoleFormat),
      } as any),
    );
  } catch (error) {
    console.error("Failed to add console transport. Console logging will be skipped.", error);
  }
}

export default logger;
