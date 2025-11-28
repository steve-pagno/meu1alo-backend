import { Validator } from './Validator';

export class ValidatorBoolean extends Validator<boolean> {
    constructor(name: string) {
        super(name, 'boolean');
    }
}
