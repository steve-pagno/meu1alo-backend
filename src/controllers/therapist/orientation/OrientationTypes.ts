import { Orientation } from '../../../entity/orientation/Orientation';
import { JwtUserInterface } from '../../../helpers/JwtAuth';

export interface QueryOrientationDTO extends JwtUserInterface {
    description?: string,
    listAllActives?: boolean
}

export interface OrientationJwt extends Orientation, JwtUserInterface {}
