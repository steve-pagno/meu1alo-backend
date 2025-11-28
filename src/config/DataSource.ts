import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import EnvConfig from './EnvConfig';

new EnvConfig().configEnv();

export default new DataSource({
    cache: {
        duration: 5 * 60 * 1000,
        type: 'database',
    },
    database: process.env.TYPEORM_DATABASE,
    entities: ['src/entity/**/*'],
    host: process.env.TYPEORM_HOST,
    logging: process.env.TYPEORM_LOGGING? 'all' : ['error'],
    maxQueryExecutionTime: 5 * 60 * 1000,
    migrations: ['src/migration/**/*'],
    migrationsRun: true,
    namingStrategy: new SnakeNamingStrategy(),
    password: process.env.TYPEORM_PASSWORD,
    poolSize: 10,
    port: Number(process.env.TYPEORM_PORT),
    synchronize: false,
    type: 'mysql',
    username: process.env.TYPEORM_USERNAME,
});
