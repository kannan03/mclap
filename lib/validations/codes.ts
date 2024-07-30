import * as z from "zod"
export const codeAuthSchema = z.object({
  codeType: z.string().min(1, { message: "Code Type is required" }).max(255),
  codeCode: z.string().min(1, { message: "Code is required" }).max(255),
  codeDesc: z.string().min(1, { message: "Code description is required" }).max(255),

})

export const updateOrganizationAuthSchema = z.object({
  firstName: z.string().min(1, { message: "Firstname is required" }).max(255),
  lastName: z.string().min(1, { message: "Lastname is required" }).max(255).optional(),
  orgTypeId: z.number().nullable(),
  email: z.string().email({ message: "Email is required" }),
  orgName: z.string().min(1, { message: "Business name is required" }).max(255),
  address1: z.string().min(1, { message: "Address is required" }).max(255),
  address2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }).max(255),
  state: z.string().min(1, { message: "State is required" }).max(3).optional(),
  zipCode: z.string().min(1, { message: "Zip Code is required" }).max(10, { message: "Zip Code is too long, maximum 10 characters." }),
  websiteURL: z.string().regex(new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g), "Invalid Url"),
  // phoneNumber: z.string().min(10,{message:"Phone number must have 10 digits."}).max(12),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  fax: z.string().min(10, { message: "Enter a valid fax number with 10 digits." }).max(12),
  tin: z.string().min(9, { message: "Enter a valid TIN with 9 digits." }).max(11),
  // name: z.string().min(1,{message:"can\'t be null"}),
  // password: z.string().min(8,{message:"Password must include 1 uppercase letter 1 number and 1 special character."}),
})

export const updateOrganizationInfoAuthSchema = z.object({
  orgTypeId: z.number().nullable(),
  orgName: z.string().min(1, { message: "Business name is required" }).max(255),
  address1: z.string().min(1, { message: "Address is required" }).max(255),
  address2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }).max(255),
  state: z.string().min(1, { message: "State is required" }).max(3).optional(),
  zipCode: z.string().min(1, { message: "Zip Code is required" }).max(10, { message: "Zip Code is too long, maximum 10 characters." }),
  websiteURL: z.string().regex(new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g), "Invalid Url"),
  fax: z.string().min(10, { message: "Enter a valid fax number with 10 digits." }).max(12),
  tin: z.string().min(9, { message: "Enter a valid TIN with 9 digits." }).max(11),
})


export const codeTypesAuthSchema = z.object({
  codeType: z.string().min(1, { message: "Code Type is required" }).max(255)
})
