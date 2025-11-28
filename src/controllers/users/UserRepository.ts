import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { UserTemplate } from '../../entity/decorators/templates/UserTemplate';
import CryptoHelper from '../../helpers/CryptoHelper';
import { AuthUser, MappingUser, User } from './UserTypes';
import dataSource from '../../config/DataSource';

export class UserRepository{
    public async save<Type>(userType: MappingUser, user: UserTemplate, transaction?: EntityManager): Promise<Type>{
        if(transaction) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return transaction.getRepository<Type>(userType).save(user);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return dataSource.getRepository<Type>(userType).save(user);
    }

    public async findOne(userType: MappingUser, authObj: AuthUser): Promise<User | undefined> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        let query = dataSource.getRepository<User>(userType)
            .createQueryBuilder('u')
            .select('u.id','id')
            .addSelect('u.name','name')
            .where('u.login = :login', { login: authObj.login })
            .andWhere('u.password = :password', { password: CryptoHelper.encrypt(authObj.password) })
        ;

        if(userType === MappingUser.secretary){
            query = query.addSelect('IF(u.state IS NULL, "ZONE", "STATE")', 'type');
        }

        return query.getRawOne();
    }
}
