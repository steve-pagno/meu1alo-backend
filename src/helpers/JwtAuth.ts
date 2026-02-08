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
            const decoded = jwt.verify(String(token).replace('Bearer ', ''), JwtAuth.SECRET);
            req.body.jwtObject = decoded;
        } catch (err: any) {
            const message = err?.name === 'TokenExpiredError' ? 'Session Expired' : 'Invalid Token';
            return res.status(HttpStatus.UNAUTHORIZED).send(message);
        }

        return next();
    }

    public createJWToken(obj: object): string {
        const expiresInValue = (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'];

        return jwt.sign(obj, JwtAuth.SECRET, {
            expiresIn: expiresInValue
        });
    }
}

export interface JwtUserInterface {
    jwtObject: { id: number }
}
