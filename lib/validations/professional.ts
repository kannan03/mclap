import * as z from "zod"
export const professionalAuthSchema = z.object({
    firstName: z.string().min(1, { message: "Firstname is required" }).max(255),
    lastName: z.string().min(1, { message: "Lastname is required" }).max(255),
    businessName:z.string().min(1,{message:"Business name is required"}).max(255),
    address1: z.string().min(1,{message:"Address is required"}).max(255),
    address2: z.string().optional(),
    city: z.string().min(1,{message:"City is required"}).max(255),
    state: z.string().min(1,{message:"State is required"}).max(255),
    zipCode: z.string().min(1,{message:"Zip Code is required"}).max(10, { message: "Zip Code is too long, maximum 10 characters." }),
    email: z.string().email({ message: "Email is required" }),
    nationalProviderIndicator:z.string().min(1,{message: "National Provider Indicator is required."}).max(9),
    tin:  z.string().min(9,{message: "Enter a valid TIN with 9 digits."}).max(11),
    password: z.string().min(8,{message:"Password must atleast include 1 number and 1 special character."}),

})