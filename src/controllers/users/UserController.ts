import { Request, Response } from 'express'; // Importe Request e Response
import dataSource from '../../config/DataSource'; // Importe o dataSource
import { MappingUser, UserString } from './UserTypes'; // Importe o Mapeamento
import { HttpStatus } from '../../helpers/http/AbstractHttpErrors';
import { IncomingHttpHeaders } from 'http';
import { JwtAuth } from '../../helpers/JwtAuth';
import { AuthUserError } from './UserErrors';
import UserService from './UserService';
import { AuthUser, User } from './UserTypes';
import { EmailService } from '../../services/EmailService';
import CryptoHelper from '../../helpers/CryptoHelper';

export default class UserController {
    public async login(params: { userType: string }, headers: IncomingHttpHeaders) {
        const userService = new UserService();

        const bearerHeader = headers['authorization'];
        if (!bearerHeader) {
            throw new AuthUserError();
        }

        const [login, password] = Buffer.from(bearerHeader.replace('Basic ', ''), 'base64')
            .toString()
            .split(':');

        const authObj: AuthUser = { login, password };

        const user: User = await userService.findOne(params.userType, authObj);

        const token = new JwtAuth().createJWToken({ id: user.id });
        const result = { token, user: user };

        return { httpStatus: HttpStatus.OK, result };
    }

    public async recoverPassword(
        params: { email: string; userType: string },
        headers: IncomingHttpHeaders
    ) {
        try {
            const rawEmail = params.email ?? '';
            const email = rawEmail.trim().toLowerCase();
            const { userType } = params;

            // ✅ Captura IP com o melhor possível via headers (proxy / nginx / cloud)
            const forwarded = headers['x-forwarded-for'];
            const xRealIp = headers['x-real-ip'];

            const ipFromXff = Array.isArray(forwarded)
                ? forwarded[0]
                : (typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() : undefined);

            const ipFromXRealIp = Array.isArray(xRealIp)
                ? xRealIp[0]
                : (typeof xRealIp === 'string' ? xRealIp.trim() : undefined);

            const requestIp = ipFromXff || ipFromXRealIp || 'IP não identificado';

            if (!userType || !MappingUser[userType as UserString]) {
                return {
                    httpStatus: HttpStatus.BAD_REQUEST,
                    result: { message: 'Tipo de usuário inválido.' },
                };
            }

            if (!email) {
                return {
                    httpStatus: HttpStatus.BAD_REQUEST,
                    result: { message: 'E-mail é obrigatório.' },
                };
            }

            const entityClass = MappingUser[userType as UserString];
            const repo = dataSource.getRepository(entityClass);

            // ✅ Busca robusta pelo e-mail via JOIN (funciona para InstitutionUser, Therapist, etc.)
            const user = await repo
                .createQueryBuilder('u')
                .leftJoinAndSelect('u.emails', 'e')
                .where('LOWER(e.email) = :email', { email })
                .getOne();

            if (!user) {
                // Segurança: não revela se existe ou não
                return {
                    httpStatus: HttpStatus.OK,
                    result: { message: 'Se o e-mail estiver cadastrado, a senha foi enviada.' },
                };
            }

            const newPass = Math.random().toString(36).slice(-8);
            const passwordHash = CryptoHelper.encrypt(newPass);

            // @ts-ignore (depende do tipo concreto)
            user.password = passwordHash;
            await repo.save(user);

            const userName = (user as any)?.name || 'usuário';

            await EmailService.sendRecoveryEmail(email, newPass, requestIp, userName);

            return {
                httpStatus: HttpStatus.OK,
                result: { message: 'Sucesso! Verifique seu e-mail.' },
            };
        } catch (error) {
            console.error('Erro no recoverPassword:', error);
            return {
                httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
                result: { message: 'Erro interno ao processar solicitação.' },
            };
        }
    }
}
