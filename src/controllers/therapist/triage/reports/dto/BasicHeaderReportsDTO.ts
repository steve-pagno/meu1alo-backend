import { Triage, TriageType } from '../../../../../entity/triage/Triage';

export interface BabyReport {
    date: string,
    name: string,
}

export interface EquipmentReport {
    calibration: string,
    name: string,
}

export interface MotherReport {
    age: number,
    name: string,
}

export interface TANReport {
    autoPEATE: boolean,
    distortionEOE: boolean,
    transientEOE: boolean,
}

export interface TriageReport {
    date: string,
}

export abstract class BasicHeaderReportsDTO {
    protected baby: BabyReport;
    protected equipment: EquipmentReport;
    protected mother: MotherReport;
    protected tan: TANReport;
    protected triage: TriageReport;

    protected fillWithTriageEntity(triage: Triage): void {
        this.baby = {
            date: this.formatDateToString(triage.baby.birthDate),
            name: triage.baby.name,
        };
        this.equipment = {
            calibration: this.formatDateToString(triage.equipment.dateOfLastCalibration),
            name: triage.equipment.model,
        };
        this.mother = {
            age: this.getAge(triage.baby.birthMother.birthDate),
            name: triage.baby.birthMother.name,
        };
        this.tan = {
            autoPEATE: triage.type === TriageType.PEATEA || triage.type === TriageType.EOET_PEATEA,
            distortionEOE: triage.type === TriageType.EOEP,
            transientEOE: triage.type === TriageType.EOET || triage.type === TriageType.EOET_PEATEA,
        };
        this.triage = {
            date: this.formatDateToString(triage.evaluationDate)
        };
    }

    private formatDateToString(date: Date|string): string {
        if(typeof date === 'string') {
            date = new Date(date);
        }
        const day = this.formatLeftZeros(date.getDay());
        const month = this.formatLeftZeros(date.getMonth());
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    private formatLeftZeros(value: number): string {
        return value < 10? `0${value}` : value.toString();
    }

    private getAge(date: Date|string): number {
        if(typeof date === 'string') {
            date = new Date(date);
        }
        const now = new Date();
        return now.getFullYear()-date.getFullYear();
    }
}
