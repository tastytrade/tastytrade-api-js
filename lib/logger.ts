import _ from 'lodash'

export default interface Logger {
  error(...data: any[]): void;
  info(...data: any[]): void;
  warn(...data: any[]): void;
}

export enum LogLevel {
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class TastytradeLogger implements Logger {
  public logLevel: LogLevel
  private logger: Logger | null = null

  constructor(logger?: Logger, logLevel?: LogLevel) {
    this.logger = logger ?? null
    this.logLevel = logLevel ?? LogLevel.ERROR
  }

  error(...data: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.logger!.error(...data)
    }
  }

  info(...data: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.logger!.info(...data)
    }
  }

  warn(...data: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.logger!.warn(...data)
    }
  }

  private shouldLog(level: LogLevel) {
    if (_.isNil(this.logger)) {
      return false
    }
    return LogLevel[level] >= LogLevel[this.logLevel]
  }
}