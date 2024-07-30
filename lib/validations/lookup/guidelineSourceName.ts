import * as z from "zod"

export const guidelineSourceNameSchema = z.object({
  lookUpValue: z.string().min(1,{message:"Lookup value is required"}).max(20),
  active: z.boolean().optional(),
  guidelineSourceName:z.string().min(1,{message: "Guideline source name is required"}).max(50),

  
})
