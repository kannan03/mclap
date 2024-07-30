import * as z from "zod"

export const lookupSchema = z.object({
  lookUpValue: z.string().min(1,{message: "Lookup value is required"}).max(25),
  active: z.boolean().optional(),
  
})
