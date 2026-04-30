import AbstractRoutes from '../../helpers/http/AbstractRoutes';
import { RouteConfig } from '../../helpers/http/AbstractRoutesTypes';
import { JwtUserInterface } from '../../helpers/JwtAuth';
import { ValidatorNumber } from '../../helpers/validator/ValidatorNumber';
import { ValidatorObject } from '../../helpers/validator/ValidatorObject';
import { ValidatorRequest } from '../../helpers/validator/ValidatorRequest';
import CityRoutes from './city/CityRoutes';
import SecretaryController from './SecretaryController';
import StateRoutes from './state/StateRoutes';
import ZoneRoutes from './zone/ZoneRoutes';

export default class SecretaryRoutes extends AbstractRoutes {
    private secretaryController: SecretaryController;

    constructor() {
        super();
        this.secretaryController = new SecretaryController();

        this.addSubRoute('/city', 'City', new CityRoutes());
        this.addSubRoute('/state', 'State', new StateRoutes());
        this.addSubRoute('/zone', 'Zone', new ZoneRoutes());

        this.getDashboard();
        this.getIsState();
        
        // --- NOVAS ROTAS ADICIONADAS AQUI ---
        this.getMe();
        this.updateMe();
        this.getById();
        this.update();
        this.create();
    }

    private getDashboard(): void {
        const config: RouteConfig = {
            description: 'Endpoint para recuperar todos os reports do dashboard de uma secretaria',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/dashboard',
            withJWT: true
        };
        this.addRoute<JwtUserInterface>(config, this.secretaryController.getDashboard);
    }

    private getIsState(): void {
        const config: RouteConfig = {
            description: 'Endpoint para verificar se a secretaria é estadual',
            method: 'get',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/:id/is-state',
            withJWT: true
        };
        this.addRoute<{id: number}>(config, this.secretaryController.getIsState);
    }

    // RF5 - Rota para BUSCAR os dados da secretaria na hora de editar
    private getById(): void {
        const config: RouteConfig = {
            description: 'Recuperar dados da secretaria pelo ID',
            method: 'get',
            params: new ValidatorRequest(undefined, undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/:id',
            withJWT: true
        };
        // Aqui conectamos com o método "get" do Controller
        this.addRoute<{id: number}>(config, this.secretaryController.get);
    }

    // RF5 - Rota para SALVAR as edições (PUT)
    private update(): void {
        const config: RouteConfig = {
            description: 'Atualiza os dados da secretaria',
            method: 'put',
            // Valida o id na URL. O corpo (body) vai livre por enquanto
            params: new ValidatorRequest(new ValidatorObject('body', []), undefined, new ValidatorObject('params', [
                new ValidatorNumber('id').min(1).required(true).withExample(1)
            ])),
            path: '/:id',
            withJWT: true
        };
        this.addRoute<any>(config, this.secretaryController.update);
    }

    // RF4 - Rota para CRIAR uma nova secretaria (POST)
    private create(): void {
        const config: RouteConfig = {
            description: 'Cria uma nova secretaria municipal',
            method: 'post',
            params: new ValidatorRequest(new ValidatorObject('body', [])),
            path: '/',
            withJWT: true
        };
        this.addRoute<any>(config, this.secretaryController.create);
    }

    private getMe(): void {
        const config: RouteConfig = {
            description: 'Recuperar dados da minha conta secretaria',
            method: 'get',
            params: new ValidatorRequest(),
            path: '/me',
            withJWT: true
        };
        this.addRoute<any>(config, this.secretaryController.getMe);
    }

    private updateMe(): void {
        const config: RouteConfig = {
            description: 'Atualizar dados da minha conta secretaria',
            method: 'put',
            params: new ValidatorRequest(new ValidatorObject('body', [])),
            path: '/me',
            withJWT: true
        };
        this.addRoute<any>(config, this.secretaryController.updateMe);
    }
}