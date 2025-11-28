import Server from '../Server';

new Server()
    .configEnv()
    .configDatabase()
    .configMiddlewares()
    .createRoutes()
    .start();
