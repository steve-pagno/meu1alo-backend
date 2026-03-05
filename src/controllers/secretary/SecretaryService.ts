import SecretaryRepository from './SecretaryRepository';
import { EmailService } from '../../services/EmailService';
import dataSource from '../../config/DataSource'; // Importante para a transação
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

    // RF4 - Cadastro de Secretaria (Estadual/Municipal vinculada à região)
    public async create(secretaryData: any) {
        // 1. Extraímos os dados sensíveis e os contatos ANTES de limpar o objeto
        const plainPassword = secretaryData.password;
        const nome = secretaryData.name || 'Secretaria';
        
        // Garantimos que emails e phones sejam arrays de strings
        let emailsRecebidos = secretaryData.emails || [];
        if (!Array.isArray(emailsRecebidos)) emailsRecebidos = Object.values(emailsRecebidos);
        
        let phonesRecebidos = secretaryData.phones || [];
        if (!Array.isArray(phonesRecebidos)) phonesRecebidos = Object.values(phonesRecebidos);

        // Identifica o destinatário do e-mail (primeiro da lista)
        let destinatario = '';
        if (emailsRecebidos.length > 0) {
            destinatario = typeof emailsRecebidos[0] === 'string' ? emailsRecebidos[0] : emailsRecebidos[0].email;
        }

        // 2. Limpeza de dados para o TypeORM não dar erro de coluna inexistente
        delete secretaryData.emails;
        delete secretaryData.phones;
        delete secretaryData.passwordConfirm;

        // 3. Criptografia da senha (fundamental para o login funcionar)
        if (secretaryData.password) {
            secretaryData.password = CryptoHelper.encrypt(secretaryData.password);
        }

        // 4. Inicia a Transação
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        const manager = queryRunner.manager;

        try {
            // Salva a secretaria na tabela principal usando o 'manager' da transação
            let newSecretary = await this.secretaryRepository.create(secretaryData, manager);

            // Prepara os arrays de strings limpos
            const emailStrings = emailsRecebidos.filter((e: any) => e).map((e: any) => typeof e === 'string' ? e : e.email);
            const phoneStrings = phonesRecebidos.filter((p: any) => p).map((p: any) => typeof p === 'string' ? p : p.phone);

            // Salva os e-mails e telefones nas tabelas filhas vinculando ao ID gerado
            if (emailStrings.length > 0) {
                newSecretary.emails = await this.secretaryRepository.saveEmails(newSecretary.id, emailStrings, manager);
            }
            if (phoneStrings.length > 0) {
                newSecretary.phones = await this.secretaryRepository.savePhones(newSecretary.id, phoneStrings, manager);
            }

            // Confirma a transação no banco de dados
            await queryRunner.commitTransaction();

            // 5. Envia o e-mail de boas-vindas
            if (destinatario && plainPassword) {
                EmailService.sendNewAccountEmail(destinatario, nome, plainPassword).catch(e => 
                    console.error("Erro ao enviar email de criação:", e)
                );
            }

            return newSecretary;
        } catch (error) {
            // Se houver qualquer erro (duplicidade, falta de campo, etc), desfaz tudo
            await queryRunner.rollbackTransaction();
            console.error("Erro no cadastro de secretaria:", error);
            throw error;
        }
    }

    // RF5 - Edição das informações da Secretaria
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
                .map((p: string) => ({ phone: p }));
        }

        return await this.secretaryRepository.update(id, updateData);
    }

    public async getById(id: number) {
        const result = await this.secretaryRepository.getById(id);
        if (!result) throw new Error('Secretaria não encontrada');
        
        const { password, ...safeResult } = result; 
        
        const formattedResult = {
            ...safeResult,
            emails: safeResult.emails ? safeResult.emails.map((e: any) => e.email) : [],
            phones: safeResult.phones ? safeResult.phones.map((p: any) => p.phone) : []
        };

        return formattedResult;
    }
}