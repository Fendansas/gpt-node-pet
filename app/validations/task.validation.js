import * as z from "zod";



export const createTaskSchema = z.object({
    title: z.string().min(3).trim(),
    description: z.string().trim().optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical'])
});

export const updateTaskSchema = z.object({
    title: z.string().trim().min(3).optional(),
    description: z.string().trim().optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    status: z.enum(['draft', 'backlog', 'todo', 'in_progress', 'review', 'rework', 'done', 'cancelled']).optional()
}).refine(
    (data) =>{
        return Object.values(data).some((value) => value !== undefined);
    },
    {
        message: 'You must fill in at least one field to update the information.'
    }
)