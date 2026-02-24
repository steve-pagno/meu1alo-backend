import SecretaryRepository from './SecretaryRepository';

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
        // A lógica do repositório deve salvar na tabela usuario_secretaria
        // e fazer a relação com a tabela de região (zone) e estado (state)
        const newSecretary = await this.secretaryRepository.create(secretaryData);
        return newSecretary;
    }

    // RF5 - Edição das informações da Secretaria
    public async update(id: number, updateData: any) {
        // Verifica se a senha foi enviada para atualizar, caso contrário, remove do payload
        if (updateData.password && updateData.password !== updateData.passwordConfirm) {
            throw new Error('As senhas não coincidem.');
        }

        // Se a senha veio em branco, nós removemos para não apagar a senha atual no banco
        if (!updateData.password) {
            delete updateData.password;
            delete updateData.passwordConfirm;
        }

        // Formata os e-mails (o frontend manda um array de textos: ["email1", "email2"])
        if (updateData.emails && Array.isArray(updateData.emails)) {
            // Filtra os vazios e mapeia para o formato que a entidade do banco espera
            updateData.emails = updateData.emails
                .filter((e: string) => e && e.trim() !== '')
                .map((e: string) => ({ email: e }));
        }

        // Formata os telefones (o frontend manda um array de textos: ["tel1", "tel2"])
        if (updateData.phones && Array.isArray(updateData.phones)) {
            updateData.phones = updateData.phones
                .filter((p: string) => p && p.trim() !== '')
                .map((p: string) => ({ phone: p }));
        }

        // Salva os dados no banco
        const updatedSecretary = await this.secretaryRepository.update(id, updateData);
        return updatedSecretary;
    }

    public async getById(id: number) {
        const result = await this.secretaryRepository.getById(id);
        if (!result) throw new Error('Secretaria não encontrada');
        
        // Separa a senha por segurança
        const { password, ...safeResult } = result; 
        
        // Converte o array de objetos do TypeORM para um array de strings que o frontend espera
        const formattedResult = {
            ...safeResult,
            emails: safeResult.emails ? safeResult.emails.map((e: any) => e.email) : [],
            phones: safeResult.phones ? safeResult.phones.map((p: any) => p.phone) : []
        };

        return formattedResult;
    }
}