import * as z from "zod"

export const rZcSchema = z.object({
    regionId: z.number().min(1, { message: "Please select a region" }),
    active: z.boolean().optional(),
    zipCode: z.string().min(1,{message:"Zip Code is required"}).max(5, { message: "Zip Code is too long, maximum 5characters." }),
    })
