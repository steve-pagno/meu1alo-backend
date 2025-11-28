export enum HttpStatus {
    OK = 200, //
    BAD_REQUEST = 400, // Client sent an invalid request — such as lacking required request body or parameter
    UNAUTHORIZED = 401, // Client failed to authenticate with the server
    FORBIDDEN = 403, // Client authenticated but does not have permission to access the requested resource
    NOT_FOUND  = 404, // The requested resource does not exist
    CONFLICT = 409, //  Duplicate resource or resource already exists
    PRECONDITION_FAILED  = 412, // One or more conditions in the request header fields evaluated to false
    INTERNAL_SERVER_ERROR = 500, // A generic error occurred on the server
    SERVICE_UNAVAILABLE = 503, // The requested services is not available
}

export abstract class HttpError extends Error {
    public readonly messages: { message: string, fancyMessage: string };
    public readonly httpStatus: HttpStatus;

    protected constructor(fancyMessage: string, message: string, httpStatus: HttpStatus) {
        super(message);
        this.messages = { fancyMessage, message };
        this.httpStatus = httpStatus;
    }
}

export abstract class BadRequestError extends HttpError {
    protected constructor(fancyMessage: string, message: string) {
        super(fancyMessage, message, HttpStatus. BAD_REQUEST);
    }
}

export abstract class UnauthorizedError extends HttpError {
    protected constructor(fancyMessage: string, message: string) {
        super(fancyMessage, message, HttpStatus. UNAUTHORIZED);
    }
}

export abstract class ForbiddenError extends HttpError {
    protected constructor(fancyMessage: string, message: string) {
        super(fancyMessage, message, HttpStatus. FORBIDDEN);
    }
}

export abstract class NotFoundError extends HttpError {
    protected constructor(fancyMessage: string, message: string) {
        super(fancyMessage, message, HttpStatus. NOT_FOUND);
    }
}

export abstract class ConflictError extends HttpError {
    protected constructor(fancyMessage: string, message: string) {
        super(fancyMessage, message, HttpStatus. CONFLICT);
    }
}

export abstract class PreconditionFailedError extends HttpError {
    protected constructor(fancyMessage: string, message: string) {
        super(fancyMessage, message, HttpStatus. PRECONDITION_FAILED);
    }
}

export abstract class InternalServerErrorError extends HttpError {
    protected constructor(fancyMessage: string, message: string) {
        super(fancyMessage, message, HttpStatus. INTERNAL_SERVER_ERROR);
    }
}

export abstract class ServiceUnavailableError extends HttpError {
    protected constructor(fancyMessage: string, message: string) {
        super(fancyMessage, message, HttpStatus. SERVICE_UNAVAILABLE);
    }
}
