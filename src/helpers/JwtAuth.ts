import { HttpStatus } from './http/AbstractHttpErrors';
import { isArray } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export class JwtAuth {
    private static readonly SECRET: string = process.env.JWT_SECRET || 'ppsus..!';

    public verifyJWTMiddleware(req: Request, res: Response, next: NextFunction): any {
        let token: string | string[] | undefined = req.headers['authorization'];

        if (!token) {
            return res.status(HttpStatus.FORBIDDEN).send('A token is required for authentication');
        }

        if (isArray(token) && token.length > 0) {
            token = token[0];
        }

        try {
            req.body.jwtObject = jwt.verify(String(token).replace('Bearer ', ''), JwtAuth.SECRET);
        } catch (err) {
            return res.status(HttpStatus.UNAUTHORIZED).send('Invalid Token');
        }

        return next();
    }

    public createJWToken(obj: object): string {
        return jwt.sign(obj, JwtAuth.SECRET);
    }
}

export interface JwtUserInterface {
    jwtObject: {id: number}
}
