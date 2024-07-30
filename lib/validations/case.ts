import * as z from "zod"
export const CaseSchema = z.object({
    caseTitle: z.string().min(1, { message: "Crime Title is required" }).max(255),
    caseCrimeDate: z.string().optional(),
    caseNumber: z.any(),
    caseCrimeDescription: z.string().optional(),
    caseCaseSummary: z.string().optional(),
    caseFederal :  z.string().optional(),
    caseDistrict :  z.string().optional(),
    caseState :  z.string().optional(),
    caseCounty :  z.string().optional(),
    crimeType:z.array(z.string()).nonempty("Crime Type is required"),
})