import pino, { Logger, LoggerOptions } from "pino";

export class logger {
  p: Logger;

  /**
   * Save Parent Data Logger
   */
  _parent: any;

  constructor(c?: LoggerOptions) {
    this.p = pino({
      level: process.env.LOG_LEVEL || "debug"
    });
  }

  public parent(data: any) {
    this._parent = data;
  }

  info(data: object) {
    this.p.info({ ...this._parent, ...data });
  }

  error(data: any) {
    this.p.error({ ...this._parent, ...data });
  }

  warn(data: any) {
    this.p.warn({ ...this._parent, ...data });
  }

  debug(data: any) {
    this.p.debug({ ...this._parent, ...data });
  }

  trace(data: any) {
    this.p.trace({ ...this._parent, ...data });
  }
}

export const p = new logger();