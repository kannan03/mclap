import * as z from "zod"
export const registerAuthSchema = z.object({
    firstName: z.string().min(1, { message: "Firstname is required" }).max(255),
    lastName: z.string().min(1, { message: "Lastname is required" }).max(255),
    active: z.boolean().optional(),
    roleIds: z.array(z.number()).min(1, { message: "Role is required" }),
    email: z.string().email({ message: "Email is required" }),
    phoneNumber: z.any(),
    password: z.string().min(8, { message: "Password must atleast include 1 uppercase letter 1 number and 1 special character." }),

})

export const updateRegisterAuthSchema = z.object({
    firstName: z.string().min(1, { message: "Firstname is required" }).max(255),
    lastName: z.string().min(1, { message: "Lastname is required" }).max(255),
    active: z.boolean().optional(),
    roleIds: z.array(z.number()).min(1, { message: "Role is required" }),
    email: z.string().email({ message: "Email is required" }),
    password:z.string().optional(),
    phoneNumber: z.any()
})