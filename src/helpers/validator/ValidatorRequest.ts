import { Validator } from './Validator';
import { ValidatorObject } from './ValidatorObject';
import { SchemaType } from './ValidatorSchemaTypes';

export type ValidatorObjectType = ValidatorObject | Validator<object>;

export class ValidatorRequest {
    private readonly body: ValidatorObjectType | undefined;
    private readonly query: ValidatorObjectType | undefined;
    private readonly params: ValidatorObjectType | undefined;

    constructor(body?: ValidatorObjectType, query?: ValidatorObjectType, params?: ValidatorObjectType) {
        this.body = body;
        this.query = query;
        this.params = params;
    }

    public execute<T>(body: any, query: any, params: any): T {
        const bodyResult = this.body?.execute(body) || {};
        const queryResult = this.query?.execute(query) || {};
        const paramsResult = this.params?.execute(params) || {};

        return { ...body, ...query, ...params, ...bodyResult, ...queryResult, ...paramsResult } as T;
    }

    public getSchema(): SchemaType[] {
        const result: SchemaType[] = [];
        if(this.body) {
            result.push({
                in: 'body',
                name: 'body',
                ...(this.body.getSchema()[0]),
            });
        }
        if(this.query) {
            result.push(...this.query.getSchema().map((s: SchemaType) => ({ in: 'query', ...s } as SchemaType)));
        }
        if(this.params) {
            result.push(...this.params.getSchema().map((s: SchemaType) => ({ in: 'path', ...s } as SchemaType)));
        }
        return result;
    }
}
