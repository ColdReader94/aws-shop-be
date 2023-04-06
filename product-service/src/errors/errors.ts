import { HttpStatusCodes } from "../models/httpStatusCodes.model";

export class HttpError extends Error {
    public statusCode: number;

    constructor(message, statusCode) {
      super(message);
      this.name = 'HttpError';
      this.statusCode = statusCode;
    }
}

export class NotFoundError extends HttpError {
    constructor(message) {
        super(`${message} not found`, HttpStatusCodes.NOT_FOUND);
    }
}
