

import * as z from "zod"

export const mostinappropriateSchema = z.object({
  year:z.string().min(4),
  modalityId:z.string().optional(),
  regionId:z.string().optional(),
  professionalId:z.string().optional(),
  cptCodes:z.array(z.string()).optional()

})
