import { ConflictError, NotFoundError } from '../../helpers/http/AbstractHttpErrors';

export class OnFindTherapistError extends ConflictError {
    constructor(message: string) {
        super('Já existe um usuário com esse login', message);
    }
}

export class NotFoundTherapistError extends NotFoundError {
    constructor(message: string) {
        super('Usuário não encontrado!', message);
    }
}
