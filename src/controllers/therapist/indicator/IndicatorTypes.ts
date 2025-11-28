import { Indicator } from '../../../entity/indicator/Indicator';
import { JwtUserInterface } from '../../../helpers/JwtAuth';

export interface IndicatorJwt extends Indicator, JwtUserInterface {}

export interface QueryIndicatorJwt extends JwtUserInterface {
    name: string
}
