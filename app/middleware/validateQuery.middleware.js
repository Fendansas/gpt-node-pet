import * as z from "zod";
import { ValidationError } from "../errors/ValidationError.js";



const querySchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    status: z.enum(['draft', 'backlog', 'todo', 'in_progress', 'review', 'rework', 'done', 'cancelled']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    sort: z.enum(['createdAt', '-createdAt', 'priority', '-priority']).optional()

})



const validateQuery = (req, res, next) =>{

    const result = querySchema.safeParse(req.query);

    if(!result.success){
        const errors = result.error.issues.map(issue =>({
            field: issue.path.join('.'),
            message: issue.message
        }))
        return next(
            new ValidationError('Validation failed', errors)
        );
    }
    req.validatedQuery = result.data;
    next()

}

export default validateQuery;