import * as z from "zod"

export const icdSchema = z.object({
  lookUpValue: z.string().min(1,{message: "Lookup value is requiured"}).max(20),
  
})