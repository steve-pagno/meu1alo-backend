import { HttpStatus } from './http/AbstractHttpErrors';
import { ValidationError } from 'class-validator';

export default class ErrorHelper {

    public static validationError(e: any) {
        if (Array.isArray(e) && e.every((err) => err instanceof ValidationError)) {
            const message = e.flatMap((field) => {
                // CORREÇÃO: Trata field.children como array vazio se for undefined/null.
                const children = field.children || []; 
                
                if (children.length === 0) { 
                    return [{ name: field.property, rules: field.constraints }]; 
                }
                return children.map((child: ValidationError) => ({
                    name: `${field.property}.${child.property}`,
                    rules: child.constraints,
                }));
            });
            return [HttpStatus.BAD_REQUEST, message];
        }
        return undefined;
    }

}