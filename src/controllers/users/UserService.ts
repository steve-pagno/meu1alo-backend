import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { UserTemplate } from '../../entity/decorators/templates/UserTemplate';
import CryptoHelper from '../../helpers/CryptoHelper';
import { NotFoundUserError } from './UserErrors';
import { UserRepository } from './UserRepository';
import { AuthUser, MappingUser, UserString } from './UserTypes';

export default class UserService{
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async save<Type>(userType: string, user: UserTemplate, transaction?: EntityManager): Promise<Type>{
        user.password = CryptoHelper.encrypt(user.password);

        return this.userRepository.save<Type>(MappingUser[userType as UserString], user, transaction);
    }

    public async findOne(userType: string, authObj: AuthUser) {
        const userTypeMap: MappingUser = MappingUser[userType as UserString];
        const user = await this.userRepository.findOne(userTypeMap, authObj);

        if (!user) {
            throw new NotFoundUserError();
        }

        return user;
    }
}
