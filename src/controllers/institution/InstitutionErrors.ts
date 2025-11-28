import { BadRequestError, ConflictError, NotFoundError } from '../../helpers/http/AbstractHttpErrors';

export class NotFoundInstitutionError extends NotFoundError {
    constructor() {
        super('Nenhuma Instituição encontrada', 'Not Found all');
    }
}

export class NotFoundOneInstitutionError extends NotFoundError {
    constructor() {
        super('Não foi possivel recuperar a instituição', 'Not Found one');
    }
}

export class InstitutionTypeError extends BadRequestError {
    constructor(message: string) {
        super('Ocorreu um erro ao tentar criar o usuario', message);
    }
}

export class DuplicateInstitutionError extends ConflictError {
    constructor(message: string) {
        super('Já existe um usuario com esse login', message);
    }
}
