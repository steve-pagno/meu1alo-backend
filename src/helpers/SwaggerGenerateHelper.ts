export default class SwaggerGenerateHelper {
    public getBaseSwagger(path: object) {
        let host = process.env.SERVER_HOST;
        const port = Number(process.env.SERVER_PORT || 80);
        if (port !== 80) {
            host += ':' + port;
        }

        return {
            basePath: '/',
            consumes: ['application/json'],
            definitions: {},
            host,
            info: {
                description: '',
                title: process.env.SERVER_NAME,
                version: '3.0.0'
            },
            paths: path,
            schemes: ['http'],
            securityDefinitions: {
                apiKeyAuth: {
                    description: 'Bearer jwt token',
                    in: 'header',
                    name: 'authorization',
                    type: 'apiKey'
                },
                basicApiKeyAuth: {
                    description: 'Basic Base64(register:senha)',
                    in: 'header',
                    name: 'authorization',
                    type: 'apiKey'
                }
            },
            swagger: '2.0'
        };
    }

    public createRouteDocs(description: string, paramsSchema: object, tagPrefix: string, withJWT: boolean, withAuthHeader?: boolean, responseType?: string) {
        const aux: any = {
            description: description,
            parameters: paramsSchema,
            produces: [responseType || 'application/json'],
            responses: {
                200: {
                    description: 'successful operation',
                },
            },
            tags: [tagPrefix]
        };

        if(withJWT) {
            aux.security = [{ apiKeyAuth: [] }];
        } else if(withAuthHeader) {
            aux.security = [{ basicApiKeyAuth: [] }];
        }
        return aux;
    }
}
