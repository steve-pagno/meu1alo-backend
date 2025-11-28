import { Validator, ValidatorFunction } from './Validator';
import { FieldLengthError, FieldMaxLengthError, FieldMinLengthError } from './ValidatorErrors';

export class ValidatorString extends Validator<string> {
    constructor(name: string) {
        super(name, 'string');
    }

    public length(lengthValue: number): ValidatorString {
        const name = super.getName();

        super.addFunction(new class implements ValidatorFunction<string> {
            execute(value: string): void {
                if(value.length === lengthValue) {
                    throw new FieldLengthError(name, lengthValue);
                }
            }
        });

        return this;
    }

    public lengthMin(minValue: number): ValidatorString {
        const name = super.getName();

        super.addFunction(new class implements ValidatorFunction<string> {
            execute(value: string): void {
                if(value.length < minValue) {
                    throw new FieldMinLengthError(name, minValue);
                }
            }
        });

        return this;
    }

    public lengthMax(maxValue: number): ValidatorString {
        const name = super.getName();

        super.addFunction(new class implements ValidatorFunction<string> {
            execute(value: string): void {
                if(value.length > maxValue) {
                    throw new FieldMaxLengthError(name, maxValue);
                }
            }
        });

        return this;
    }
}
