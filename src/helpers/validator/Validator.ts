import { FieldRequiredError } from './ValidatorErrors';
import { SchemaType } from './ValidatorSchemaTypes';

export abstract class Validator<T> {
    private pipeline: ValidatorFunction<T>[];
    private readonly name: string;
    private readonly type: string;
    private isRequired = false;
    private example: any | undefined;
    private description: string | undefined;

    protected constructor(name: string, type: string) {
        this.pipeline = [];
        this.name = name;
        this.type = type;
    }

    protected addFunction(func: ValidatorFunction<T>): void {
        this.pipeline.push(func);
    }

    public required(isRequired: boolean): Validator<T> {
        this.isRequired = isRequired;
        return this;
    }

    public withExample(example: any): Validator<T> {
        this.example = example;
        return this;
    }

    public withDescription(description: string): Validator<T> {
        this.description = description;
        return this;
    }

    public execute(value: any): T {
        value = value as T | undefined;
        if(value) {
            this.pipeline.forEach(func => func.execute(value));
        } else {
            if(this.isRequired) {
                throw new FieldRequiredError(this.description || this.name);
            }
        }
        return value;
    }

    public getName(): string {
        return this.name;
    }

    public getSchema(): SchemaType[] {
        return [
            {
                description: this.description,
                example: this.example,
                name: this.name,
                required: this.isRequired,
                type: this.type,
            }
        ];
    }
}

export interface ValidatorFunction<T> {
    execute(value: T): void;
}
