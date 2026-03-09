import SecretaryRepository from './SecretaryRepository';
import { EmailService } from '../../services/EmailService';
import dataSource from '../../config/DataSource';
import CryptoHelper from '../../helpers/CryptoHelper';

export default class SecretaryService {
    private secretaryRepository: SecretaryRepository;

    constructor() {
        this.secretaryRepository = new SecretaryRepository();
    }

    public async getDashboard() {
        return [
            { type: 'baby-pass-fail' },
            { type: 'indicators-percent' },
            { type: 'indicators' }
        ];
    }

    public async getIsState(id: number) {
        const result = await this.secretaryRepository.getState(id);
        return result && result.state;
    }

    public async getStateIdByUserId(id: number) {
        const result = await this.secretaryRepository.getState(id);
        return result?.state;
    }

    public async create(secretaryData: any) {
        const plainPassword = secretaryData?.password || '';
        const nome = secretaryData?.name || 'Secretaria';

        let emailsRecebidos = secretaryData?.emails || [];
        if (!Array.isArray(emailsRecebidos)) {
            emailsRecebidos = Object.values(emailsRecebidos);
        }

        let phonesRecebidos = secretaryData?.phones || [];
        if (!Array.isArray(phonesRecebidos)) {
            phonesRecebidos = Object.values(phonesRecebidos);
        }

        const emailStrings = emailsRecebidos
            .filter((e: any) => e !== null && e !== undefined && e !== '')
            .map((e: any) => typeof e === 'string' ? e : e?.email)
            .filter((e: any) => typeof e === 'string' && e.trim() !== '');

        const phoneStrings = phonesRecebidos
            .filter((p: any) => p !== null && p !== undefined && p !== '')
            .map((p: any) => typeof p === 'string' ? p : (p?.phoneNumber || p?.phone))
            .filter((p: any) => typeof p === 'string' && p.trim() !== '');

        const destinatario = emailStrings[0] || '';

        console.log('=== CADASTRO SECRETARIA ===');
        console.log('Nome:', nome);
        console.log('Password recebida:', !!plainPassword);
        console.log('Emails recebidos:', emailsRecebidos);
        console.log('Emails normalizados:', emailStrings);
        console.log('Destinatário final:', destinatario);

        delete secretaryData.emails;
        delete secretaryData.phones;
        delete secretaryData.passwordConfirm;

        if (secretaryData.password) {
            secretaryData.password = CryptoHelper.encrypt(secretaryData.password);
        }

        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const manager = queryRunner.manager;

        try {
            let newSecretary = await this.secretaryRepository.create(secretaryData, manager);

            if (emailStrings.length > 0) {
                newSecretary.emails = await this.secretaryRepository.saveEmails(
                    newSecretary.id,
                    emailStrings,
                    manager
                );
            }

            if (phoneStrings.length > 0) {
                newSecretary.phones = await this.secretaryRepository.savePhones(
                    newSecretary.id,
                    phoneStrings,
                    manager
                );
            }

            await queryRunner.commitTransaction();

            if (destinatario && plainPassword) {
                console.log('Tentando enviar email para secretaria...');
                const enviado = await EmailService.sendNewAccountEmail(destinatario, nome, plainPassword);
                console.log('Resultado envio secretaria:', enviado);
            } else {
                console.warn('Email da secretaria não enviado: faltou destinatário ou senha.', {
                    destinatario,
                    plainPasswordExiste: !!plainPassword
                });
            }

            return newSecretary;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Erro no cadastro de secretaria:', error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    public async update(id: number, updateData: any) {
        if (updateData.password && updateData.password !== updateData.passwordConfirm) {
            throw new Error('As senhas não coincidem.');
        }

        if (!updateData.password) {
            delete updateData.password;
            delete updateData.passwordConfirm;
        } else {
            updateData.password = CryptoHelper.encrypt(updateData.password);
            delete updateData.passwordConfirm;
        }

        if (updateData.emails && Array.isArray(updateData.emails)) {
            updateData.emails = updateData.emails
                .filter((e: string) => e && e.trim() !== '')
                .map((e: string) => ({ email: e }));
        }

        if (updateData.phones && Array.isArray(updateData.phones)) {
            updateData.phones = updateData.phones
                .filter((p: string) => p && p.trim() !== '')
                .map((p: string) => ({ phoneNumber: p }));
        }

        return await this.secretaryRepository.update(id, updateData);
    }

    public async getById(id: number) {
        const result = await this.secretaryRepository.getById(id);

        if (!result) {
            throw new Error('Secretaria não encontrada');
        }

        const { password, ...safeResult } = result;

        return {
            ...safeResult,
            emails: safeResult.emails ? safeResult.emails.map((e: any) => e.email) : [],
            phones: safeResult.phones ? safeResult.phones.map((p: any) => p.phoneNumber) : []
        };
    }
}