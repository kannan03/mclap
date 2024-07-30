import * as z from "zod"

export const mpcSchema = z.object({
    modalityId: z.number(),
    active: z.boolean().optional(),
    cptCode: z.string().min(1,{message:"CPT Code is required"}).max(20),
    })
