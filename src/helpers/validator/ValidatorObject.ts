import { Validator, ValidatorFunction } from './Validator';
import { SchemaType } from './ValidatorSchemaTypes';

export class ValidatorObject extends Validator<object>{
    private readonly fields: Validator<any>[];

    constructor(name: string, fields: Validator<any>[]) {
        super(name, 'object');
        this.fields = fields;

        super.addFunction(new class implements ValidatorFunction<object> {
            execute(value: any): void {
                for (const field of fields) {
                    let valueObj = undefined;
                    try {
                        valueObj = value[field.getName()];
                    } catch (ignore) { /* empty */ }
                    field.execute(valueObj);
                }
            }
        });
    }

    public getSchema(): SchemaType[] {
        let name = this.getName();

        if(name === 'query' || name === 'path' || name === 'params') {
            return this.fields.map(field => field.getSchema()[0]);
        }

        if(name === 'body') {
            name = 'schema';
        }

        const valuesSchema: any = {};
        for (const field of this.fields) {
            valuesSchema[field.getName()] = field.getSchema()[0];
        }

        return [
            {
                [name]: {
                    properties: valuesSchema,
                    type: 'object'
                }
            } as unknown as SchemaType
        ];
    }
}
