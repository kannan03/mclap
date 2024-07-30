import * as z from "zod"
export const patientAuthSchema = z.object({
    firstName: z.string().min(1, { message: "Firstname is required" }).max(255),
    lastName: z.string().min(1, { message: "Lastname is required" }).max(255),
    middleName:z.string().optional(),
    addressLine1: z.string().min(1,{message:"Address is required"}).max(255),
    addressLine2: z.string().optional(),
    city: z.string().min(1,{message:"City is required"}).max(255),
    state: z.string().min(1,{message:"State is required"}).max(255),
    zipCode: z.string().min(1,{message:"Zip Code is required"}).max(10, { message: "Zip Code is too long, maximum 10 characters." }),
    email: z.string().email({ message: "Email is required" }),
    dateOfBirth:z.string().min(1,{message: "Date of Birth is required"}).max(10),
    SSN:z.string().min(1,{message: "SSN is required"}).max(11),
    gender:z.string().min(1,{message:"Gender is required"}).max(10),
    //MRN:z.string().min(1,{message: "MRN is required"}).max(10),
    phone: z.string().min(1, { message: "Phone number is required" }),
    // primaryCareDoctor:z.string().min(1, { message: "Primarycare doctor is required" }).max(225),
    claimNumber : z.string().min(1,{message: "Claim Number is required"}).max(10)
})