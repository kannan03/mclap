import * as z from "zod"

export const updateAuthSchema = z.object({

  // img:z.string(),
  firstName: z.string(),
  lastName: z.string().optional(),
  phoneNumber: z.any(),
  password: z.string().min(8, { message: "You have to enter at least 8 digit!." }).optional(),
  currentPassword: z.string().optional(),
})

export const updateProfileAuthSchema = z.object({

  // img:z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().min(10, { message: "Phone number must have 10 digits." }).max(13),
  email: z.string().email({ message:"Invalid email address" }),
  password: z.string().optional(),
  currentPassword: z.string().optional(),
})
