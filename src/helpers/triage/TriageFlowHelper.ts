import { Indicator } from '../../entity/indicator/Indicator';

export type RiskCategory = 'NONE_OR_IRDA1' | 'IRDA2';

type BuildFlowConductParams = {
    riskCategory: RiskCategory;
    testStage: number;
    eoaLeftEar: boolean;
    eoaRightEar: boolean;
    peateaLeftEar?: boolean | null;
    peateaRightEar?: boolean | null;
};

type BuildFlowConductResult = {
    finalLeftEar: boolean;
    finalRightEar: boolean;
    resultDescription: string;
    accompanyDescription: string;
};

const IRDA2_KEYWORDS = [
    'utin',
    'uti neonatal',
    'permanência em utin',
    'peso ao nascimento menor de 1.500 gramas',
    'hiperbilirrubinemia com exsanguineotransfusão',
    'ecmo',
    'oxigenação por membrana extracorpórea',
    'ventilação mecânica por mais de 5 dias',
    'anóxia grave',
    'encefalopatia hipóxico-isquêmica',
    'hemorragia peri-ventricular',
    'distúrbios neurodegenerativos'
];

function normalizeText(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

export function classifyIndicatorName(name: string): 'IRDA1' | 'IRDA2' {
    const normalized = normalizeText(name);

    const isIrda2 = IRDA2_KEYWORDS.some((keyword) =>
        normalized.includes(normalizeText(keyword))
    );

    return isIrda2 ? 'IRDA2' : 'IRDA1';
}

export function resolveRiskCategory(indicators: Indicator[] = []): RiskCategory {
    if (!indicators.length) return 'NONE_OR_IRDA1';

    const hasIrda2 = indicators.some((indicator) =>
        classifyIndicatorName(indicator.name) === 'IRDA2'
    );

    return hasIrda2 ? 'IRDA2' : 'NONE_OR_IRDA1';
}

export function shouldUsePeateA(riskCategory: RiskCategory): boolean {
    return riskCategory === 'IRDA2';
}

function allTrue(values: Array<boolean | null | undefined>): boolean {
    return values.every((value) => value === true);
}

export function buildFlowConduct(params: BuildFlowConductParams): BuildFlowConductResult {
    const {
        riskCategory,
        testStage,
        eoaLeftEar,
        eoaRightEar,
        peateaLeftEar,
        peateaRightEar,
    } = params;

    if (riskCategory === 'IRDA2') {
        const eoaPassed = allTrue([eoaLeftEar, eoaRightEar]);
        const peateaPassed = allTrue([peateaLeftEar, peateaRightEar]);

        const finalLeftEar = Boolean(eoaLeftEar) && Boolean(peateaLeftEar);
        const finalRightEar = Boolean(eoaRightEar) && Boolean(peateaRightEar);

        if (testStage === 1) {
            if (eoaPassed && peateaPassed) {
                return {
                    finalLeftEar,
                    finalRightEar,
                    resultDescription: 'Passa EOA + PEATE-A',
                    accompanyDescription: 'Encaminhamento para monitoramento em serviços especializados ou CER',
                };
            }

            return {
                finalLeftEar,
                finalRightEar,
                resultDescription: 'Falha no teste. Realizar reteste em até 15 dias com exame que apresentou falha.',
                accompanyDescription: 'Reteste em até 15 dias com exame de falha',
            };
        }

        if (eoaPassed && peateaPassed) {
            return {
                finalLeftEar,
                finalRightEar,
                resultDescription: 'Passa EOA + PEATE-A',
                accompanyDescription: 'Encaminhamento para monitoramento em serviços especializados ou CER',
            };
        }

        return {
            finalLeftEar,
            finalRightEar,
            resultDescription: 'Falha no reteste. Encaminhamento para diagnóstico em serviço especializado ou CER.',
            accompanyDescription: 'Encaminhamento para diagnóstico em serviço especializado ou CER',
        };
    }

    const passed = Boolean(eoaLeftEar) && Boolean(eoaRightEar);

    if (testStage === 1) {
        if (passed) {
            return {
                finalLeftEar: true,
                finalRightEar: true,
                resultDescription: 'Passa no teste',
                accompanyDescription: 'Encaminhamento para APS para acompanhamento',
            };
        }

        return {
            finalLeftEar: Boolean(eoaLeftEar),
            finalRightEar: Boolean(eoaRightEar),
            resultDescription: 'Falha no teste. Realizar reteste em até 15 dias com EOA.',
            accompanyDescription: 'Reteste em até 15 dias com EOA',
        };
    }

    if (passed) {
        return {
            finalLeftEar: true,
            finalRightEar: true,
            resultDescription: 'Passa no reteste',
            accompanyDescription: 'Encaminhamento para APS para acompanhamento',
        };
    }

    return {
        finalLeftEar: Boolean(eoaLeftEar),
        finalRightEar: Boolean(eoaRightEar),
        resultDescription: 'Falha no reteste. Encaminhamento para diagnóstico em serviço especializado ou CER.',
        accompanyDescription: 'Encaminhamento para diagnóstico em serviço especializado ou CER',
    };
}