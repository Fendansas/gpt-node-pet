import * as z from "zod";



export const createUserSchema = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6)
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});

export const updateUserSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.email().optional()
});