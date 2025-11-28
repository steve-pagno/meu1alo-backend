import { ReqResFunction, RouteConfig } from './AbstractRoutesTypes';
import { Router } from 'express';
import { JwtAuth } from '../JwtAuth';

export class MethodMapping {
    private readonly router: Router;
    constructor(router: Router) {
        this.router = router;
    }
    public setRoute(config: RouteConfig, funcGeneric: ReqResFunction) {
        let mapping: any;
        if(config.withJWT) {
            mapping = new MethodMappingJWT();
        } else {
            mapping = new MethodMappingNoJWT();
        }
        mapping[config.method](this.router, config, funcGeneric);
    }
}

class MethodMappingJWT {
    get = (router: Router, config: RouteConfig, funcGeneric: ReqResFunction) => {
        router.get(config.path, new JwtAuth().verifyJWTMiddleware, funcGeneric);
    };
    post = (router: Router, config: RouteConfig, funcGeneric: ReqResFunction) => {
        router.post(config.path, new JwtAuth().verifyJWTMiddleware, funcGeneric);
    };
    put = (router: Router, config: RouteConfig, funcGeneric: ReqResFunction) => {
        router.put(config.path, new JwtAuth().verifyJWTMiddleware, funcGeneric);
    };
    patch = (router: Router, config: RouteConfig, funcGeneric: ReqResFunction) => {
        router.patch(config.path, new JwtAuth().verifyJWTMiddleware, funcGeneric);
    };
    delete = (router: Router, config: RouteConfig, funcGeneric: ReqResFunction) => {
        router.delete(config.path, new JwtAuth().verifyJWTMiddleware, funcGeneric);
    };
}

class MethodMappingNoJWT {
    get = (router: Router, config: RouteConfig, funcGeneric: ReqResFunction) => {
        router.get(config.path, funcGeneric);
    };
    post = (router: Router, config: RouteConfig, funcGeneric: ReqResFunction) => {
        router.post(config.path, funcGeneric);
    };
    put = (router: Router, config: RouteConfig, funcGeneric: ReqResFunction) => {
        router.put(config.path, funcGeneric);
    };
    patch = (router: Router, config: RouteConfig, funcGeneric: ReqResFunction) => {
        router.patch(config.path, funcGeneric);
    };
    delete = (router: Router, config: RouteConfig, funcGeneric: ReqResFunction) => {
        router.delete(config.path, funcGeneric);
    };
}

