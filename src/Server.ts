import Cors from 'cors';
import Express, { Application } from 'express';
import SwaggerUI from 'swagger-ui-express';
import DataSource from './config/DataSource';
import EnvConfig from './config/EnvConfig';
import Routes from './controllers/Routes';
import SwaggerGenerateHelper from './helpers/SwaggerGenerateHelper';

export default class Server {
    private readonly express: Application = Express();

    public start(port?: string|number): Server {
        port = port || process.env.PORT || process.env.SERVER_PORT;
        this.express.set('port', port);
        this.express.listen(port, () => {
            console.log(`${process.env.SERVER_NAME} running on port ${port}.`);
        });

        return this;
    }

    public configEnv(): Server {
        new EnvConfig().configEnv();
        return this;
    }

    public configMiddlewares(): Server {
        /* Preparing middleware to parse different data formats */
        this.express.use(Express.json());
        this.express.use(Express.urlencoded({ extended: true }));
        /* Setup CORS, adding this options to all response headers. */
        this.express.use(Cors());

        return this;
    }

    public configDatabase(): Server {
        DataSource.initialize().then(() => console.log('DB Connect')).catch(console.error);
        return this;
    }

    public createRoutes(): Server {
        const routes = new Routes();
        this.express.use(routes.getRouter());

        const docs = new SwaggerGenerateHelper().getBaseSwagger(routes.getDocs());
        this.express.use('/docs', SwaggerUI.serve, SwaggerUI.setup(docs));

        return this;
    }
}
