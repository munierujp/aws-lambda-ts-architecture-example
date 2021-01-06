export interface Executable<Result> {
  execute: () => Promise<Result>
}
