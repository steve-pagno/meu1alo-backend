import AbstractRoutes from '../helpers/http/AbstractRoutes';
import BabyRoutes from './baby/BabyRoutes';
import InstitutionRoutes from './institution/InstitutionRoutes';
import ParentsRoutes from './parents/ParentsRoutes';
import ReferralServiceRoutes from './referral_service/ReferralServiceRoutes';
import ReportsRoutes from './reports/ReportsRoutes';
import SecretaryRoutes from './secretary/SecretaryRoutes';
import TherapistRoutes from './therapist/TherapistRoutes';
import UserRoutes from './users/UserRoutes';

export default class Routes extends AbstractRoutes {
    constructor() {
        super();
        this.addSubRoute('/baby', 'Baby', new BabyRoutes());
        this.addSubRoute('/institution', 'Institution', new InstitutionRoutes());
        this.addSubRoute('/parents', 'Parents', new ParentsRoutes());
        this.addSubRoute('/referral-service', 'Referral Service', new ReferralServiceRoutes());
        this.addSubRoute('/reports', 'Dashboard', new ReportsRoutes());
        this.addSubRoute('/secretary', 'Secretary', new SecretaryRoutes());
        this.addSubRoute('/therapist', 'Therapist', new TherapistRoutes());
        this.addSubRoute('/user', 'Users', new UserRoutes());
    }

    public getDocs() {
        return super.getDocs('', '');
    }
}
