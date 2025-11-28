import { NotFoundError, UnauthorizedError } from '../../helpers/http/AbstractHttpErrors';

export class AuthUserError extends UnauthorizedError{
    constructor() {
        super('Usuario não autorizado, contate um administrador', 'Base64 Token Auth not found');
    }
}

export class NotFoundUserError extends NotFoundError {
    constructor() {
        super('Usuário não encontrado, login ou senha incorreto', 'Not Fount');
    }
}
