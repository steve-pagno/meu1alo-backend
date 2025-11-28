export interface SchemaType {
    name?: string,
    in?: 'body' | 'query' | 'path',
    required?: boolean,
    description?: string,
    type?: string,
    example?: any,
    schema?: {
        type?: string,
        properties?: object,
    },
}
