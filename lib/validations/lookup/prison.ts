import * as z from "zod"

export const prisonSchema = z.object({
  prisonName: z.string().min(1,{message: "Name is required"}).max(255),
  prisonState: z.string().regex(/^[a-zA-Z]+$/,{message :"State is required"}).min(2,{message: "State should have only 2 characters"}),
  prisonCity: z.string().min(1,{message: "City is required"}).max(255),
  prisonZip: z.string().regex(/^[0-9]+$/,{message : "Zip Code is required"}).min(5,{message: "Zip code should have only 5 digits"}),
  prisonAddress : z.string().min(1,{message: "Address is required"}).max(255),
  prisonCountry: z.string().min(1,{message: "Country is required"}).max(255),
})
