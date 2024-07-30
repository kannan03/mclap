import * as z from "zod"

export const inappropriateSchema = z.object({
  modalityId:z.string().optional(),
  year:z.string().min(4),
  regionId:z.string().optional(),
  cptCodes:z.array(z.string()).optional()
})
