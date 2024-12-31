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

// 其他代码保持不变，直到控制台输出部分

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
