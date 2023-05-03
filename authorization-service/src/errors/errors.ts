import { HttpStatusCodes } from '../models/httpStatusCodes.model';

export class HttpError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
      super(message);
      this.name = 'HttpError';
      this.statusCode = statusCode;
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string) {
        super(message, HttpStatusCodes.BAD_REQUEST);
    }
}

export class ServerError extends HttpError {
    constructor(message: string) {
        super(`Server error: ${message}`, HttpStatusCodes.SERVER_ERROR);
    }
}

export class UnauthorizedError extends HttpError {
    constructor() {
        super('Unauthorized.', HttpStatusCodes.UNAUTHORIZED);
    }
}

export class ForbiddenError extends HttpError {
    constructor() {
        super('Forbidden.', HttpStatusCodes.FORBIDDEN);
    }
}