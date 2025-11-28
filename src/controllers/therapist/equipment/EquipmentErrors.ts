import { InternalServerErrorError } from '../../../helpers/http/AbstractHttpErrors';

export class NotFoundEquipmentError extends InternalServerErrorError {
    constructor(message: string) {
        super('Equipamento não encontrado!', message);
    }
}
