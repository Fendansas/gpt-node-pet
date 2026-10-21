import * as z from "zod";


export const createCommentSchema = z.object({
    text: z.string()
        .trim()
        .min(2, 'The message must contain at least 2 characters')
        .max(2000,'The message is too long')
})