import * as z from "zod"

export const professionalEncounterMonthSchema = z.object({
  year:z.string().min(4),  
  professionalId:z.string().optional()
})
