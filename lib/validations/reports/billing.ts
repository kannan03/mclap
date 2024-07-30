import * as z from "zod"

export const billingSchema = z.object({
    guidelineSourceId:z.string(),
    endDate: z.string().optional(),
    startDate: z.string().optional()
})
