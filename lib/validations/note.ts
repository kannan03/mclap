import * as z from "zod"
export const noteSchema = z.object({
    logCaseID: z.number().min(1, { message: "Defendant id is not" }),
    logNotes: z.any(),
    logEventType : z.any(),
    logActionDate : z.any(),
    logInitials : z.any(),
    logApproximate : z.any()
})
