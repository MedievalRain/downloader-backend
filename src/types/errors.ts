export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class IdParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IdParsingError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class FileNotExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileNotExistsError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class VideoNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = " VideoNotFoundError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
