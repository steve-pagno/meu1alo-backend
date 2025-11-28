import { BadRequestError } from '../http/AbstractHttpErrors';

export class FieldRequiredError extends BadRequestError {
    constructor(fieldName: string) {
        super(`O campo ${fieldName} é obrigatório`, `Field is required, field: ${fieldName}`);
    }
}

export class FieldMinError extends BadRequestError {
    constructor(fieldName: string, min: number) {
        super(`O campo ${fieldName} não pode ser menor que ${min}`, `Field is less then min, field: ${fieldName}, min: ${min}`);
    }
}

export class FieldMaxError extends BadRequestError {
    constructor(fieldName: string, max: number) {
        super(`O campo ${fieldName} não pode ser maior que ${max}`, `Field is greater then max, field: ${fieldName}, min: ${max}`);
    }
}

export class FieldLengthError extends BadRequestError {
    constructor(fieldName: string, length: number) {
        super(`O campo ${fieldName} deve ter ${length} caracteres`, `Field has incorrect length, field: ${fieldName}, length: ${length}`);
    }
}

export class FieldMinLengthError extends BadRequestError {
    constructor(fieldName: string, length: number) {
        super(`O campo ${fieldName} não pode ter menos que ${length} caracteres`, `Field has incorrect length, field: ${fieldName}, length: ${length}`);
    }
}

export class FieldMaxLengthError extends BadRequestError {
    constructor(fieldName: string, length: number) {
        super(`O campo ${fieldName} não pode ter mais que ${length} caracteres`, `Field has incorrect length, field: ${fieldName}, length: ${length}`);
    }
}
