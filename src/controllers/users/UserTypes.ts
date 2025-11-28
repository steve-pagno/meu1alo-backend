import { Guardian } from '../../entity/guardian/Guardian';
import { InstitutionUser } from '../../entity/institution/InstitutionUser';
import { SecretaryUser } from '../../entity/secretaries/user/SecretaryUser';
import { Therapist } from '../../entity/therapist/Therapist';

export type UserString = 'secretary' | 'institution' | 'therapist' | 'parents';

export type User = SecretaryUser | InstitutionUser | Therapist | Guardian | undefined;

export type AuthUser = { password: string, login: string };

export enum MappingUser {
    secretary = 'SecretaryUser',
    institution = 'InstitutionUser',
    therapist = 'Therapist',
    parents = 'Guardian',
}
