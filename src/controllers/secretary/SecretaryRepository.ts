import { SecretaryUser } from '../../entity/secretaries/user/SecretaryUser';

export default class SecretaryRepository {
    public async getDashboard() {
        return [
            { type: 'baby-pass-fail' },
            // { type: 'baby-come-born' },
            { type: 'indicators-percent' },
            { type: 'indicators' }
        ];
    }

    public async getState(userId: number) {
        return SecretaryUser.createQueryBuilder('u')
            .select(['u.state AS state'])
            .where('u.id = :id', { id: userId })
            .getRawOne()
            ;
    }

    // RF4 - Método para criar o registro no banco
    public async create(secretaryData: any) {
        // Cria a instância do usuário baseada nos dados enviados
        const newSecretary = SecretaryUser.create(secretaryData);
        // Salva no banco de dados
        return await SecretaryUser.save(newSecretary);
    }

    public async getById(id: number) {
        return await SecretaryUser.createQueryBuilder('u')
            .leftJoinAndSelect('u.emails', 'emails') // Traz a tabela de e-mails relacionada
            .leftJoinAndSelect('u.phones', 'phones') // Traz a tabela de telefones relacionada
            .where('u.id = :id', { id })
            .getOne();
    }

    public async update(id: number, updateData: any) {
        // Busca o usuário atual com as relações para poder sobrescrever
        const secretary = await this.getById(id);
        
        if (!secretary) throw new Error('Secretaria não encontrada');

        // Mescla os dados novos com os dados antigos
        const updatedSecretary = SecretaryUser.merge(secretary, updateData);
        
        // O 'save' atualiza a tabela principal e as tabelas filhas (emails/phones)
        return await SecretaryUser.save(updatedSecretary);
    }
}