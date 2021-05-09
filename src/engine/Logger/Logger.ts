export class Logger {
  public static Error(message: string): void {
    console.error(message)
  }

  public static Warn(message: string): void {
    console.warn(message)
  }

  public static Info(message: string): void {
    console.log(message)
  }
}
