import fs from "fs";
import path from "path";
import { LowSync, JSONFileSync } from "lowdb/lib";

enum Level {
  trace,
  debug,
  info,
  warn,
  error,
}

enum Color {
  trace = "#909399",
  debug = "#409eff",
  info = "#67c23a",
  warn = "#e6a23c",
  error = "#f56c6c",
}

export class Log {
  static defaultLevel: Level = Level.trace;

  static setDefaultLevel(level: Level): void {
    Log.defaultLevel = level;
  }

  static getLogger(name: string, level?: number): Log {
    return new Log(name, level);
  }

  private static getCss(color: Color): string {
    return `background-color:${color};color:white;border-radius:4px`;
  }

  name: string;
  level: Level | undefined;
  constructor(name: string, level?: Level) {
    this.name = name;
    this.level = level;
  }

  trace(template: string, ...args: unknown[]): void {
    if ((this.level || Log.defaultLevel) <= 0) {
      console.log(
        "%c trace %c [%s] " + template,
        Log.getCss(Color.trace),
        "",
        this.name,
        ...args
      );
    }
  }
  debug(template: string, ...args: unknown[]): void {
    if ((this.level || Log.defaultLevel) <= 1) {
      console.log(
        "%c debug %c [%s] " + template,
        Log.getCss(Color.debug),
        "",
        this.name,
        ...args
      );
    }
  }
  info(template: string, ...args: unknown[]): void {
    if ((this.level || Log.defaultLevel) <= 2) {
      console.log(
        "%c info  %c [%s] " + template,
        Log.getCss(Color.info),
        "",
        this.name,
        ...args
      );
    }
  }
  warn(template: string, ...args: unknown[]): void {
    if ((this.level || Log.defaultLevel) <= 3) {
      console.log(
        "%c warn  %c [%s] " + template,
        Log.getCss(Color.warn),
        "",
        this.name,
        ...args
      );
    }
  }
  error(template: string, ...args: unknown[]): void {
    if ((this.level || Log.defaultLevel) <= 4) {
      console.log(
        "%c error %c [%s] " + template,
        Log.getCss(Color.error),
        "",
        this.name,
        ...args
      );
    }
  }
}

export function createDirIfNotExists(dir: string): void {
  if (fs.existsSync(dir)) return;
  createDirIfNotExists(path.dirname(dir));
  fs.mkdirSync(dir);
}

export function loadDB<T>(jsonPath: string, defaultData: T): LowSync<T> {
  createDirIfNotExists(path.dirname(jsonPath));
  const db = new LowSync<T>(new JSONFileSync<T>(jsonPath));
  db.read();
  if (db.data === null) {
    db.data = defaultData;
    db.write();
  }
  return db;
}
