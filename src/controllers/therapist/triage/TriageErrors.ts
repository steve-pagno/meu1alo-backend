import { NotFoundError } from '../../../helpers/http/AbstractHttpErrors';

export class NotFoundOneTriageError extends NotFoundError {
    constructor() {
        super('Não foi possível recuperar a triage', 'Not Found one');
    }
}
