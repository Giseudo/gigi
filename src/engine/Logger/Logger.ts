enum LoggerLevel {
  Error = 0,
  Warn = 1,
  Info = 2,
  Debug = 3
}

class Logger {
  static Level: LoggerLevel = LoggerLevel.Error

  public static Error(message: string): void {
    console.error(message)

    throw new Error(message)
  }

  public static Warn(message: string): void {
    if (Logger.Level < LoggerLevel.Warn) return

    console.warn(message)
  }

  public static Info(message: string): void {
    if (Logger.Level < LoggerLevel.Info) return

    console.log(message)
  }

  public static Debug(message: string): void {
    if (Logger.Level < LoggerLevel.Debug) return

    console.log('Debug:', message)
  }

  public static Log(_: string): void { }
}

export default Logger
