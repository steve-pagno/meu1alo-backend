import { ConflictError } from '../helpers/http/AbstractHttpErrors';

export class DuplicateEmail extends ConflictError {
    constructor(message: string) {
        super('Este email já está sendo utilizado', message);
    }
}

export class DuplicatePhone extends ConflictError {
    constructor(message: string) {
        super('Este número de telefone já está sendo utilizado', message);
    }
}
