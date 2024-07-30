import * as z from "zod"
export const noteSchemas = z.object({
    logCaseID: z.any(),
    logNotes: z.any(),
    logEventType : z.any(),
    logActionDate : z.any(),
    logInitials : z.any(),
    logApproximate : z.any()
})