import { HttpError, HttpStatus } from './AbstractHttpErrors';
import { HttpFunction, ResponseHttpController, RouteConfig, SubRoute } from './AbstractRoutesTypes';
import { Request, Response, Router } from 'express';
import GenericLogger from '../GenericLogger';
import SwaggerGenerateHelper from '../SwaggerGenerateHelper';
import { ValidatorRequest } from '../validator/ValidatorRequest';
import { MethodMapping } from './MethodMapping';

export default abstract class AbstractRoutes {
    private logger = new GenericLogger();
    private swaggerHelper = new SwaggerGenerateHelper();
    private routes: RouteConfig[] = [];
    private subRoutes: SubRoute[] = [];
    private readonly router = Router();

    public getRouter() {
        return this.router;
    }

    protected addSubRoute(path: string, tag: string, router: AbstractRoutes): void {
        this.subRoutes.push({ path, router, tag });
        this.router.use(path, router.getRouter());
    }

    protected addRoute<T>(config: RouteConfig, func: HttpFunction<T>): void {
        this.routes.push(config);

        const funcGeneric = async (req: Request, res: Response) => {
            const result = await this.genericProcess<T>(req, config.params, func);
            const responseStatus = res.status(result.httpStatus);

            if(config.resultType && result.httpStatus < 400) {
                return responseStatus.contentType(config.resultType).send(result.result);
            }

            return responseStatus.json(result.result);
        };

        new MethodMapping(this.router).setRoute(config, funcGeneric);
    }

    public getDocs(baseRoute: string, tagPrefix: string) {
        let result: any = {};
        this.routes.forEach(route => {
            let path: string = baseRoute+route.path;
            while(path.indexOf(':') !== -1) {
                path = path.replace(/\/:(\w+)/, '/{$1}');
            }

            if(!result[path]) {
                result[path] = {};
            }

            result[path][route.method] = this.swaggerHelper.createRouteDocs(
                route.description,
                route.params.getSchema(),
                tagPrefix,
                route.withJWT,
                route.withAuthHeader,
                route.resultType,
            );
        });

        this.subRoutes.forEach(suRoute => {
            result = { ...result, ...suRoute.router.getDocs(baseRoute+suRoute.path, tagPrefix+' '+suRoute.tag) };
        });
        return result;
    }

    private async genericProcess<T>(req: Request, validateParams: ValidatorRequest, onFinish: HttpFunction<T>): Promise<ResponseHttpController> {
        const path = this.clearPath(req.originalUrl);
        const userId = req.body.jwtObject?.id;
        const paramsLog = { body: req.body, params: req.params, query: req.query };

        let result: ResponseHttpController;
        try{
            const paramsFull = validateParams.execute<T>(req.body, req.query, req.params);
            result = await onFinish(paramsFull, req.headers);
        }catch (e: HttpError | any){
            if(e instanceof HttpError){
                result = { httpStatus: e.httpStatus, result: e.messages };
            } else {
                result = { httpStatus: HttpStatus.INTERNAL_SERVER_ERROR, result: { message: e.message } };
            }
            console.error(e);
            this.logger.request(path, userId, result.httpStatus, paramsLog, e.stack || e);
        }

        this.logger.request(path, userId, result.httpStatus, paramsLog, result.result);
        return result;
    }

    private clearPath(path: string): string {
        const pathIntIndex = path.indexOf('?');
        if(pathIntIndex > 0) {
            return path.substring(0, pathIntIndex);
        }
        return path;
    }
}
