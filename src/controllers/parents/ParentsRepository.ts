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
                t.eoa_orelha_esquerda AS eoaLeftEar,
                t.eoa_orelha_direita AS eoaRightEar,
                t.peatea_orelha_esquerda AS peateaLeftEar,
                t.peatea_orelha_direita AS peateaRightEar,
                t.observacao AS observation,
                c.descricao_resultado AS conduct,
                c.tipo_teste AS testType,
                i.nome_instituicao AS institution,
                b.nome AS babyName,
                th.nome_usuario AS therapistName,
                CONCAT(eq.marca, ' - ', eq.modelo) AS equipmentName,
                o.descricao AS orientation
            FROM triagem t
            INNER JOIN bebe b
                ON b.id_bebe = t.fk_bebe
            LEFT JOIN conduta c
                ON c.id_conduct = t.fk_conduta
            LEFT JOIN instituicao i
                ON i.id_instituicao = t.fk_instituicao
            LEFT JOIN fonoaudiologo th
                ON th.id_usuario = t.fk_fonoaudiologo
            LEFT JOIN equipamento eq
                ON eq.id_equipamento = t.fk_equipamento
            LEFT JOIN orientacao o
                ON o.id_orientation = t.fk_orientacao
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