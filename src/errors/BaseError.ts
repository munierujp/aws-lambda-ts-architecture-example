/**
 * @see https://future-architect.github.io/typescript-guide/exception.html
 */
export class BaseError extends Error {
  constructor (message?: string) {
    super(message)
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
