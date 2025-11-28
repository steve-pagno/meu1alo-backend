import { Validator, ValidatorFunction } from './Validator';
import { FieldMaxError, FieldMinError } from './ValidatorErrors';

export class ValidatorNumber extends Validator<number> {
    constructor(name: string) {
        super(name, 'number');
    }

    public min(minValue: number): ValidatorNumber {
        const name = super.getName();

        super.addFunction(new class implements ValidatorFunction<number> {
            execute(value: number): void {
                if(value < minValue) {
                    throw new FieldMinError(name, minValue);
                }
            }
        });

        return this;
    }

    public max(maxValue: number): ValidatorNumber {
        const name = super.getName();

        super.addFunction(new class implements ValidatorFunction<number> {
            execute(value: number): void {
                if(value > maxValue) {
                    throw new FieldMaxError(name, maxValue);
                }
            }
        });

        return this;
    }
}
