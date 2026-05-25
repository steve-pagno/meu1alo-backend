import { Equipment } from '../../../entity/equipment/Equipment';
import { JwtUserInterface } from '../../../helpers/JwtAuth';

export interface QueryEquipmentDTO extends JwtUserInterface {
    model?: string,
    brand?: string,
    dateOfLastCalibration?: string,
    listAllActives?: boolean
}

export interface EquipmentJwt extends Equipment, JwtUserInterface {}
