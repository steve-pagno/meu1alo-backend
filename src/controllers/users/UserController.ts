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

        const [login, password] = Buffer.from(bearerHeader.replace('Basic ', ''), 'base64').toString().split(':');
        const authObj: AuthUser = { login, password };

        const user: User = await userService.findOne(params.userType, authObj);

        const token = new JwtAuth().createJWToken({ id: user.id });
        const result = { token, user: user };

        return { httpStatus: HttpStatus.OK, result };
    }

    public async recoverPassword(params: { email: string, userType: string }, headers: IncomingHttpHeaders) {
        try {
            const { email, userType } = params;

            if (!userType || !MappingUser[userType as UserString]) {
                return { 
                    httpStatus: HttpStatus.BAD_REQUEST, 
                    result: { message: "Tipo de usuário inválido." } 
                };
            }

            const entityClass = MappingUser[userType as UserString];
            const repo = dataSource.getRepository(entityClass);

            // @ts-ignore
            const user = await repo.findOne({
                where: {
                    emails: {
                        email: email
                    }
                },
                relations: ['emails']
            });

            if (!user) {
                return { 
                    httpStatus: HttpStatus.OK, 
                    result: { message: "Se o e-mail estiver cadastrado, a senha foi enviada." } 
                };
            }

            const newPass = Math.random().toString(36).slice(-8);
            const passwordHash = CryptoHelper.encrypt(newPass);
            
            user.password = passwordHash;
            await repo.save(user);

            await EmailService.sendRecoveryEmail(email, newPass);

            return { 
                httpStatus: HttpStatus.OK, 
                result: { message: "Sucesso! Verifique seu e-mail." } 
            };

        } catch (error) {
            console.error("Erro no recoverPassword:", error);
            return { 
                httpStatus: HttpStatus.INTERNAL_SERVER_ERROR, 
                result: { message: "Erro interno ao processar solicitação." } 
            };
        }
    }
}
