import AbstractRoutes from './AbstractRoutes';
import { Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { ValidatorRequest } from '../validator/ValidatorRequest';

export interface RouteConfig {
    path: string,
    method: string,
    description: string,
    params: ValidatorRequest,
    withJWT: boolean,
    withAuthHeader?: boolean,
    resultType?: string,
}

export interface ResponseHttpController {
    httpStatus: number,
    result: any
}

export interface SubRoute {
    path: string,
    router: AbstractRoutes,
    tag: string
}

export type HttpFunction<T> = (params: T, headers: IncomingHttpHeaders)=> Promise<ResponseHttpController>;

export type ReqResFunction = (req: Request, res: Response)=> Promise<Response>;
