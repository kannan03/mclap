"use client"

import { useState } from "react"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from "lucide-react"
import { getSession } from "next-auth/react"
import placeHolder from "public/image1.png"
import { useForm } from "react-hook-form"
import * as z from "zod"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { formatPhoneNumber, keyDownLengthValidation } from "@/lib/utils"
import { registerAuthSchema } from "@/lib/validations/register"
import {
  updateAuthSchema,
  updateProfileAuthSchema,
} from "@/lib/validations/updateauth"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

let userId: string
type FormData = z.infer<typeof updateAuthSchema>
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
export default function Settings() {
  const [userId, setUserId] = React.useState(null)
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [image, setImage] = React.useState<any>("")
  const [imageUrl, setImageUrl] = React.useState("")
  const [profileEdit, setProfileEdit] = React.useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [phoneJson, setPhoneJson] = React.useState<any>([
    { phoneNumber: "", type: "mobile", is_primary: 1, extension: ""   },
  ])
  const [phoneError, setPhoneError] = React.useState(false)
  const [showResetPasswordDialog, setShowResetPasswordDialog] =
    React.useState(false)
  const [showNewPasswordDialog, setShowNewPasswordDialog] =
    React.useState(false)
  const [currentPassword, setCurrentPassword] = React.useState<any>("")
  const [newPassword, setNewPassword] = React.useState<any>("")
  const [isTheme, setIsTheme] = React.useState(false)
  const [confirmPassword, setConfirmPassword] = React.useState<any>("")
  const [passwordError, setPasswordError] = React.useState("")

  async function handleFileUpload(event: any) {
    const session: any = await getSession()
    if (!session.user?.id) {
      return
    }
    let updateId: any = session.user.id
    const fileObj = event.target.files[0]
    let img_obj: any = URL.createObjectURL(fileObj)
    setImage(img_obj)
    const formData = new FormData()
    formData.append("files", fileObj)
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    }
    const response = await axiosInstance
      .post(
        `${baseURL}/v1/users/user_upload_profile/${updateId}`,
        formData,
        config
      )
      .then((result) => {
        fetchData(session.user.id)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const getCurrentUser = async () => {
    const session = await getSession()
    fetchData(session?.user?.id)
    setUserId(session?.user?.id)
    setUserRoles(session?.user?.roles)
    const checkRolesData = sessionStorage.getItem("roles")
    if (checkRolesData && session?.user?.roles) {
      let profileRole = session?.user?.roles
      let RolesArray = JSON.parse(checkRolesData)
      let user_roles: string[] = []
      RolesArray.forEach((map_ele: any) => {
        if (map_ele.roleCode && profileRole.includes(map_ele.roleCode)) {
          user_roles.push(map_ele.name)
        }
      })
      if (user_roles.length > 0) {
        setUserRoles(user_roles)
      }
    }
  }
  //Accordian header color
  React.useEffect(() => {
    getCurrentUser()
    fetchUserRoles()
  }, [])
  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile)
      setImage(selectedFile)
      setImageUrl(objectUrl)
    }
  }
  const fetchUserRoles = async () => {
    try {
      const response = await axiosInstance.get(`${baseURL}/v1/roles/${userId}`)
    } catch (error) {
      console.error("Error fetching user roles:", error)
    }
  }
  const handleChange = (e: any) => {
    if (e.target.name === "currentPassword") {
      setCurrentPassword(e.target.value)
    }

    if (e.target.name === "newPassword") {
      setNewPassword(e.target.value)
    }
    if (e.target.name === "confirmPassword") {
      setConfirmPassword(e.target.value)
      if (newPassword !== e.target.value) {
        setPasswordError("Passwords do not match")
      } else {
        setPasswordError("")
      }
    }
  }
  const handleCheckPassword = async () => {
    try {
      if (!currentPassword) {
        setIsChange(true)
        return
      }
      setIsChange(false)
      const session = await getSession()
      let userId = session?.user?.id
      const response = await axiosInstance.post(
        `${baseURL}/v1/auth/check-password`,
        { password: currentPassword, id: userId }
      )
      if (response.status === 200) {
        setShowResetPasswordDialog(false)
        setShowNewPasswordDialog(true)
      } else {
        throw new Error("Invalid password")
      }
    } catch (error) {
      console.error("Error checking password:", error)
      toast({
        variant: "destructive",
        description: "Invalid current password. Please try again.",
      })
    }
  }

  const handleNewPasswordSubmit = async () => {
    if (passwordError) {
      toast({
        variant: "destructive",
        description: passwordError,
      })
      return
    }

    try {
      if (!newPassword && !confirmPassword) {
        setIsChange(true)
        return
      }
      setIsChange(false)
      const session = await getSession()
      let userId = session?.user?.id
      const response = await axiosInstance.post(
        `${baseURL}/v1/auth/reset-password`,
        { password: newPassword, id: userId }
      )
      if (response.status === 200) {
        toast({
          description: "Password updated successfully!",
          style: {
            background: "#03C03C",
          },
        })
        setShowNewPasswordDialog(false)
      } else {
        throw new Error("Invalid password")
      }
    } catch (error) {
      console.error("Error checking password:", error)
      toast({
        variant: "destructive",
        description: "Incorrect current password. Please try again.",
      })
    }
  }

  // React.useEffect(() => {
  //     reset()
  // }, [showResetPasswordModal, showNewPasswordModal])

  const fetchData = async (id: any) => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(`${baseURL}/v1/users/${id}`)
      let modifiedData = response.data.user
      if (modifiedData.profile) {
        setImage(modifiedData.profile)
      } else {
        setImage(placeHolder.src)
      }
      setValue("firstName", modifiedData.firstName)
      setValue("lastName", modifiedData.lastName)
      setValue("phoneNumber", String(modifiedData.phoneNumber))
      if (
        modifiedData.phoneNumber &&
        typeof modifiedData.phoneNumber === "object"
      ) {
        setPhoneJson(modifiedData.phoneNumber)
      }
      // setValue('email', modifiedData.email);
      setEmail(modifiedData.email)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
    setIsLoading(false)
  }
  async function Submit(data: FormData) {
    data.phoneNumber = phoneJson
    try {
      if (phoneJson[0] && !phoneJson[0]["phoneNumber"]) {
        setPhoneError(true)
        return
      }
      setIsLoading(true)
      const response = await axiosInstance.patch(
        `${baseURL}/v1/users/update_profile/${userId}`,
        data
      )
      if (response && response.status == 200) {
        toast({
          description: "Profile updated successfully!",
          style: {
            background: "#03C03C",
          },
        })
        setIsEditing(false)
        // reset({
        //     currentPassword: "",
        //     password: ""
        // });
      } else {
        console.error("Password update failed:", response)
        toast({
          variant: "destructive",
          description: `Updating Profile Failed: ${response.data.message || "Unknown error"
            }`,
        })
      }
    } catch (err) {
      console.log("err:" + err)
    }
    setIsLoading(false)
  }
  const [isChange, setIsChange] = React.useState(false)
  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(updateAuthSchema),
  })

  return (
    <div
      className="overscroll-y-none px-2 pb-1 pt-2"
      onClick={(e) => e.stopPropagation()}
    >
         {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20">
            <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-red-700" />
          </div>
        )}
      <div className="dark-container relative thin-scrollbar h-[calc(100vh-72px)] overflow-y-auto rounded-lg border bg-white p-2">
        <h2 className="relative mx-1 flex text-l ml-2 font-bold">
          Profile{" "}
          {!isEditing ? <Icons.pencil
            className="w-4.5 mx-auto mt-1.5 h-4 cursor-pointer"
            onClick={handleEditToggle}
          /> : <Icons.eye
            className="w-4.5 mx-auto mt-1.5 h-4 cursor-pointer"
            onClick={handleEditToggle}
          />}
        </h2>
        <div className="group relative float-right mx-10 flex xl:mx-20">
          {image && (
            <img
              src={image}
              className="my-5 h-24 w-24 cursor-pointer rounded-full"
              id="avatar-image"
              onClick={() => {
                setProfileEdit(true)
              }}
            />
          )}
          {profileEdit && (
            <input
              type="file"
              className="absolute inset-0 h-full w-full  cursor-pointer opacity-0"
              id="avatar-upload"
              accept="image/*"
              title=""
              onChange={handleFileUpload}
            />
          )}
        </div>
        <div className="flex px-2 py-3">
          <form>
            <div>
            <Label className="text-[0.7rem] font-semibold text-gray-600">Last Name <span className="text-red-500"> *</span></Label>
              <Input
                className={`mt-2 text-xs w-[465px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text  ${!isEditing && "opacity-70"}`}
                id="LastName"
                placeholder={!isEditing ? "-" : "Last name"}
                type="text"
                autoCorrect="off"
                {...register("lastName")}
                disabled={!isEditing}
              />
            </div>
            <div className="mt-1">
            <Label className="text-[0.7rem] font-semibold text-gray-600">First Name <span className="text-red-500"> *</span></Label>
              <Input
                className={`mt-2 text-xs w-[465px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text  ${!isEditing && "opacity-70"}`}
                id="FirstName"
                placeholder={!isEditing ? "-" : "First name"}
                type="text"
                autoCorrect="off"
                {...register("firstName")}
                disabled={!isEditing}
              />
            </div>
            {/* <Input
                        className='mt-3 text-xs'
                        id="phoneNumber"
                        placeholder="Phone Number"
                        type="text"
                        autoCorrect="off"
                        {...register("phoneNumber")}
                    />
                    {errors.phoneNumber?.message && (
                        <small className="text-red-500">
                            {errors.phoneNumber.message}
                        </small>
                    )} */}
            <div className="mt-1.5 grid grid-cols-1 gap-2">
              <div>
                <div className="">
                <Label className="flex relative mt-1 text-[0.7rem] font-semibold text-gray-600">Phone Number <span className="text-red-500 mx-1"> *</span> {(isEditing) && phoneJson && typeof phoneJson === "object" && !(phoneJson.length > 4) &&
                      <div className="ml-[18rem] cursor-pointer text-inherit text-xs" onClick={() => {
                        let values = [...phoneJson, { phoneNumber: '', type: 'mobile', is_primary: 0 }];
                        setPhoneJson(values);

                      }} >
                        <Icons.phoneAdd className="h-5 w-5 cursor-pointer" />
                      </div>
                    } </Label>
                  {phoneJson &&
                    typeof phoneJson === "object" &&
                    phoneJson.map((field: any, index: any) => {
                      return (
                        <div key={index} className="my-2 flex">
                          <div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Checkbox
                                    className={`my-2 mr-3 border-slate-600 ${!isEditing && "opacity-70"
                                      }`}
                                    checked={field.is_primary ? true : false}
                                    onClick={(e: any) => {
                                      let values = [...phoneJson]
                                      let mapData = values.map(
                                        (map_ele, map_index) => {
                                          if (map_index === index) {
                                            map_ele["is_primary"] = 1
                                          } else {
                                            map_ele["is_primary"] = 0
                                          }
                                          return map_ele
                                        }
                                      )
                                      setPhoneJson(mapData)
                                      setPhoneError(false)
                                    }}
                                    disabled={!isEditing}
                                  />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>Make it primary phone number</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Select
                            value={phoneJson[index]["type"]}
                            onValueChange={(value) => {
                              let values = [...phoneJson]
                              values[index]["type"] = value
                              setPhoneJson(values)
                              setPhoneError(false)
                              setValue("phoneNumber", String(values))
                            }}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="w-[95px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text  select-custom">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-slate-900">
                              <SelectItem value="mobile" className="text-xs">Mobile</SelectItem>
                              <SelectItem value="work" className="text-xs">Work</SelectItem>
                              <SelectItem value="other" className="text-xs">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="text"
                            className={`mx-2 w-64 text-xs  disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text ${!isEditing && "opacity-70 "
                              }`}
                            value={phoneJson[index]["phoneNumber"]}
                            placeholder={!isEditing ? "-" : "+XX-(XXX) XXX-XXX"}
                            onKeyDown={(event) =>
                              keyDownLengthValidation(event, 12)
                            }
                            onChange={(e) => {
                              let values = [...phoneJson]
                              values[index]["phoneNumber"] = formatPhoneNumber(
                                e.target.value
                              )
                              setPhoneJson(values)
                              setPhoneError(false)
                              setValue("phoneNumber", String(e.target.value))
                              // setValue("phoneNumber", formatPhoneNumber(e.target.value))
                            }}
                            disabled={!isEditing}
                          />

                          {["work"].includes(
                            phoneJson[index]["type"]
                          ) && (
                              <div className="">
                                {/* <Label className="text-xs">Ext</Label> */}
                                <Input
                                  type="text"
                                  maxLength={30}
                                  id={phoneJson[index]}
                                  className="w-[4.5rem] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text "
                                  placeholder={!isEditing ? "-" : "Ext"}
                                  disabled={!isEditing}
                                  value={phoneJson[index]['extension']}
                                  onKeyDown={(event) =>
                                    keyDownLengthValidation(event, 5)
                                  }
                                  onChange={(e) => {
                                    // console.log(fields);
                                    let values = [...phoneJson];
                                    values[index]["extension"] = e.target.value
                                    setPhoneJson(values)
                                    // setValue("phoneNumber", formatPhoneNumber(e.target.value))
                                  }}
                                // {...register("conDayExt")}
                                />
                              </div>
                            )}

                          {/* delete button */}
                          {field &&
                            !field.is_primary &&
                            phoneJson &&
                            isEditing && 
                            typeof phoneJson === "object" &&
                            phoneJson.length > 1 && (
                              <div>
                                {" "}
                                <X
                                  className="h-8 w-4  ml-2 cursor-pointer"
                                  type="button"
                                  onClick={() => {
                                    let values = phoneJson
                                    let phoneData: any = []
                                    let originalData = values.forEach(
                                      (map_ele: any, map_index: any) => {
                                        if (index !== map_index) {
                                          phoneData.push(map_ele)
                                        }
                                      }
                                    )
                                    setPhoneJson(phoneData)
                                    setPhoneError(false)
                                  }}
                                />
                              </div>
                            )}
                        </div>
                      )
                    })}
                </div>
                {phoneError && (
                  <small className="text-red-500">
                    {"phoneNumber is required"}
                  </small>
                )}
              </div>
            </div>
            <Label className="text-[0.7rem] font-semibold text-gray-600">Email <span className="text-red-500"> *</span></Label>
            <Input
              className={`mt-2 text-xs w-[465px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text  ${!isEditing && "opacity-70"}`}
              id="email"
              placeholder={!isEditing ? "-" : "Email"}
              value={email}
              disabled={true}
              type="text"
            />
            {isEditing && (
              <Button
                variant="ghost"
                type="button"
                onClick={() => setShowResetPasswordDialog(true)}
                className="text-black-700 mb-2  mt-3 rounded-lg   text-xs"
              >
                <span className="underline underline-offset-4">
                  Reset Password
                </span>
              </Button>
            )}

            <Dialog
              open={showResetPasswordDialog}
              onOpenChange={() => {
                setShowResetPasswordDialog(!showResetPasswordDialog)
                setIsChange(false)
              }}
            >
              <DialogContent className="max-w-[350px] dark:bg-slate-900">
                <DialogHeader className="border-b border-inherit">
                  <DialogTitle className="mb-2">Check Password</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <Input
                    id="currentPassword"
                    placeholder="Current Password"
                    value={currentPassword}
                    type="password"
                    onChange={handleChange}
                    autoComplete="off"
                    autoCorrect="off"
                    className="mt-1 text-xs"
                    name="currentPassword"
                  />
                  {isChange && !currentPassword && (
                    <small className="text-red-500">
                      {"Password is required"}
                    </small>
                  )}
                </DialogDescription>
                <DialogFooter className="gap-5">
                  <DialogClose className="text-black-600 pr-1 text-xs">
                    Cancel
                  </DialogClose>
                  <Button
                    className="h-8 bg-transparent py-3 text-xs"
                    type="submit"
                    variant="outline"
                    onClick={handleCheckPassword}
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={showNewPasswordDialog}
              onOpenChange={() => {
                setShowNewPasswordDialog(!showNewPasswordDialog)
                setIsChange(false)
              }}
            >
              <DialogContent className="max-w-[400px] dark:bg-slate-900">
                <DialogHeader className="border-b border-inherit">
                  <DialogTitle className="mb-2">Change Password</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <Input
                    id="password"
                    placeholder="New Password"
                    type="password"
                    onChange={handleChange}
                    autoComplete="off"
                    autoCorrect="off"
                    className="mt-1 text-xs"
                    name="newPassword"
                  />
                  {isChange && !newPassword && (
                    <small className="text-red-500">
                      {"Password is required"}
                    </small>
                  )}
                  <Input
                    id="password"
                    placeholder="Confirm New Password"
                    type="password"
                    onChange={handleChange}
                    autoComplete="off"
                    autoCorrect="off"
                    className="mt-4 text-xs"
                    name="confirmPassword"
                  />
                  {isChange && !confirmPassword && (
                    <small className="text-red-500">
                      {"Password is required"}
                    </small>
                  )}
                </DialogDescription>
                <DialogFooter className="gap-5">
                  <DialogClose className="text-black-600 pr-1 text-xs">
                    Cancel
                  </DialogClose>
                  <Button
                  variant="outline"
                    className="h-8 bg-transparent py-3 text-xs"
                    onClick={handleNewPasswordSubmit}
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <br />
            <h4 className="scroll-m-20 text-xl font-extralight tracking-tight">
              Assigned Roles
            </h4>
            {userRoles.map((role) => (
              <Badge className="mx-2 mt-3 py-1 text-xs">{role}</Badge>
            ))}
            <div className="mt-3">
              {isEditing && (
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="text-black-700 mr-3 mt-1 rounded-lg px-3 py-2 text-xs hover:bg-transparent xl:py-2"
                >
                  Cancel
                </Button>
              )}
              {isEditing && (
                <Button
                variant="outline"
                  onClick={handleSubmit(Submit)}
                  className="mt-1 rounded-lg bg-transparent px-3 py-2 h-8 text-xs xl:py-2"
                >
                  Update Profile
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
