import * as z from "zod"
export const GeneralCaseSchema = z.object({
    linkStatus: z.string().min(1, { message: "Case status is required" }).max(255),
    linkDateOpened: z.any(),
    linkDateClosed: z.any(),
    linkDateInvestigationOpened: z.any(),
    linkDateInvestigationClosed: z.any(),
    linkArrestDate: z.any(),
    linkArrestPlace: z.any(),
    linkTrial: z.any(),
    linkProceduralStatus: z.any(),
    linkDeathPenSought: z.any(),
    linkDeathNoticed: z.any(),
    linkDateDeathNoticed: z.any(),
    linkPleaBargain: z.any(),
    linkPleaBargainTermsOffered: z.any(),
    linkPleaBargainAccepted: z.any(),
    linkPleaBargainRefused: z.any(),
    linkState: z.any(),
    linkCounty: z.any(),
    linkCustody: z.any()

});
