import { NotFoundError } from '../../../helpers/http/AbstractHttpErrors';

export class NotFoundCityError extends NotFoundError {
    constructor() {
        super('cidade não encontrada', 'ID não encontrado');
    }
}
