import dataSource from '../../config/DataSource';

export default class ParentsRepository {
    public async getTriagesByGuardianId(guardianId: number) {
        const rows = await dataSource.query(
            `
            SELECT DISTINCT
                t.id_triagem AS id,
                t.data_avaliacao AS evaluationDate,
                t.tipo_triagem AS type,
                t.orelha_esquerda AS leftEar,
                t.orelha_direita AS rightEar,
                c.descricao_resultado AS conduct,
                c.tipo_teste AS testType,
                i.nome_instituicao AS institution,
                b.nome AS babyName
            FROM triagem t
            INNER JOIN bebe b
                ON b.id_bebe = t.fk_bebe
            LEFT JOIN conduta c
                ON c.id_conduct = t.fk_conduta
            LEFT JOIN instituicao i
                ON i.id_instituicao = t.fk_instituicao
            LEFT JOIN bebe_responsavel br
                ON br.fk_bebe = b.id_bebe
            WHERE b.fk_mae_bio = ?
               OR br.fk_responsavel = ?
            ORDER BY t.data_avaliacao DESC
            `,
            [guardianId, guardianId]
        );

        return rows;
    }
}