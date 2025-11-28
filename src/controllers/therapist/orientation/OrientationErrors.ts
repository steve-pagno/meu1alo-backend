import { InternalServerErrorError } from '../../../helpers/http/AbstractHttpErrors';

export class NotFoundOrientationError extends InternalServerErrorError {
    constructor(message: string) {
        super('Orientação não encontrada!', message);
    }
}
