"use client"
import React, { ForwardedRef, forwardRef, useState, useImperativeHandle } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import { Controller, Form, useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { keyDownLengthValidation } from "@/lib/utils"
import {
  registerAuthSchema,
  updateRegisterAuthSchema,
} from "@/lib/validations/register"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "../icons"
import { Switch } from "@/components/ui/switch"
import { getSession } from "next-auth/react"
import { Input } from "../ui/input"
import { toast } from "../ui/use-toast"
import { formatPhoneNumber } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Trash2,
  X
} from "lucide-react"
import { RadioGroupItem } from "../ui/radio-group"
import { RadioGroup } from "../ui/radio-group"
type FormData = z.infer<typeof registerAuthSchema>
interface Role {
  id: number
  name: string
}
// Import statements

const AlertDialogDemo = forwardRef((props: any, ref:ForwardedRef<unknown>) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(
      props.rowdata ? updateRegisterAuthSchema : registerAuthSchema
    ),
  })
  const isEdit = !!props.rowdata;
  const [fieldError, setFieldError] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false)
  const [rolesData, setRolesData] = React.useState<Role[]>([])
  const [selectedRoleIds, setSelectedRoleIds] = React.useState<number[]>([])
  const [active, setActive] = useState(true)
  const [sessionUser, setSessionUser] = React.useState(null)
  const [rolesType, setRolesType] = React.useState<any>([]);
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

  useImperativeHandle(ref, () => {
    return {
      click : () => setIsOpen(true)
    }
  })

  React.useEffect(() => {
    setPhoneJson([{ phoneNumber: '', type: 'mobile', is_primary: 1, extension: "" }]);
    const getCurrentUser = async () => {
      const session = await getSession();
      setSessionUser(session?.user);
      const rolesData = session?.user?.roles || [];
      setRolesType(rolesData);
      const storedRoleNames = sessionStorage.getItem('roles');
      const roles = storedRoleNames ? JSON.parse(storedRoleNames) : [];
      setRolesData(roles);
    };
    getCurrentUser();
  }, [isOpen]);
  React.useEffect(() => {
    reset()
    if (props.rowdata) {
      setActive(props.rowdata.active)
      setValue("active", props.rowdata.active)
      setValue("phoneNumber", String(props.rowdata.phoneNumber));
      if (props.rowdata.phoneNumber && typeof props.rowdata.phoneNumber === "object") {
        setPhoneJson(props.rowdata.phoneNumber);
      } else {
        setPhoneJson([{ phoneNumber: '', type: 'mobile', is_primary: 1 }]);
      }
      let setRoles: number[] = []
      if (props.rowdata.Roles) {
        props.rowdata.Roles.forEach((role: { id: number }, index: any) => {
          setRoles.push(role.id)
        })
      }
      setSelectedRoleIds(setRoles)
      setValue("roleIds", setRoles)
    } else {
      setValue("roleIds", []);
    }
  }, [isOpen, props.rowdata, reset])
  //check box
  const handleRadioChange = (roleId: number) => {
    setSelectedRoleIds([roleId]);
    clearErrors("roleIds")
    setValue("roleIds", [roleId]); // Set the selected role directly as an array
  };
  const handleToggleChange = (checked: any) => {
    setActive(checked)
    setValue("active", checked)
  }
  const onSubmit = async (payload: any) => {
    payload.emailConfirmed = false
    payload.accessFailedCount = 0
    const { roleIds, emailConfirmed, accessFailedCount, ...updatePayload } =
      payload
    const { active, ...rest } = updatePayload
    if (props.rowdata) {
      let userId = props.rowdata.id
      updatePayload.roleIds = roleIds
      updatePayload.active = active
      updatePayload.phoneNumber = phoneJson;
      updatePayload.password = payload.password;
      try {
        if (phoneJson[0] && !phoneJson[0]['phoneNumber']) {
          setPhoneError(true);
          return;
        }

        const res = await axiosInstance.patch(`${baseURL}/v1/users/${userId}`,updatePayload)
        if (res.status === 200) {
          toast({
            variant: "default",
            description: "User Updated Successfully",
            style: {
              background: "#03C03C",
            },
          })
          setFieldError(null)
          reset()
          props.afterSuccess()
          props.refreshGrid()
          setIsOpen(false)
        } else {
          setFieldError('email');
          toast({
            variant: "destructive",
            description: `User Updating Failed: ${res.data.message || "Unknown error"
              }`,
          })
        }
      } catch (error) {
        console.error("Error updating user:", error)
        setIsOpen(false)
      }
    } else {
      try {
        const session = await getSession();
        if (session?.user?.orgId) {
          payload.orgId = session?.user?.orgId;
        }
        if (phoneJson[0] && !phoneJson[0]['phoneNumber']) {
          setPhoneError(true);
          return;
        }
        payload.phoneNumber = phoneJson;
        const res = await axiosInstance.post(
          `${baseURL}/v1/auth/register`,
          payload
        )
        console.log("Response:", res)
        if (res.status === 201) {
          toast({
            variant: "default",
            description: "User Created Successfully",
            style: {
              background: "#03C03C",
            },
          })
          setFieldError(null)
          props.afterSuccess()
          setIsOpen(false)
        } else {
          setFieldError('email');
          toast({
            variant: "destructive",
            description: `User Creating Failed: ${res.data.message || "Unknown error"
              }`,
          })
        }
      } catch (error: any) {
        console.error("Error creating user:", error)
        setIsOpen(false)
        toast({
          variant: "destructive",
          description: `Error creating user: ${error.message || "Unknown error"
            }`,
        })
      }
    }
  }
  const [addPhone, setAddPhone] = React.useState([1]);
  // const [removePhone,setRemovePhone] = React.useState([1]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phoneNumber',
  });
  React.useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedRoleIds([])
    }
  }, [isOpen, reset]);
  const [phoneJson, setPhoneJson] = React.useState<any>([{ phoneNumber: '', type: 'mobile', is_primary: 1, extension: ""  }]);
  const [phoneError, setPhoneError] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(openValue)=>{
      if( props?.text == "Add"){
        if( openValue){
          setIsOpen(openValue);
        }else{
          const values = getValues();
          let formAllValues = Object.values(values);
          let findFormValue = formAllValues?.find((map_val)=> {
            return map_val != '';
          });
          if( findFormValue){
            let ConfirmCloseForm = confirm("The data filled in the form will be lost. Do you want to close the form ?");
            if( ConfirmCloseForm ){
              setIsOpen(openValue);
            }
          }else{
            setIsOpen(openValue);
          }
        }
      }else if (props?.hidetext === "Edit") {
        if (!openValue) {
          const confirmCloseForm = window.confirm("Are you sure you want to cancel editing?");
          if (confirmCloseForm) {
            setIsOpen(openValue);
          }
        } else {
          setIsOpen(openValue);
        }
      }
      else{
        setIsOpen(openValue)
      }
    }}>
     <TooltipProvider>
     { props.text === "Add" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant={ "outline" }
                disabled={props.disable}
                className={"flex items-center rounded-lg bg-transparent h-8 px-1.5 md:px-3.5 py-1 xl:py-1.5 text-xs"}
              >
               {props.icon} <span className="hidden md:block">{props.text}</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side='top'
              className="bg-zinc-950 dark:bg-zinc-50">
                <p className="text-xs text-slate-50 dark:text-slate-950">Create new User</p>
          </TooltipContent>
        </Tooltip>
     )}
     {(props.hidetext === "Edit" || props.hidetext === "View" || props.text === "Edit") && (
          <DialogTrigger asChild>
            <Button
              variant={props.text === "Edit" ? "outline" : "ghost"}
              disabled={props.disable}
              className={
                props.hidetext === "Edit"
                  ? 'flex h-8 items-center rounded-l-lg border-r rounded-r-none bg-transparent px-3.5 py-1 text-xs xl:py-1.5'
                  : props.hidetext === "View"
                  ? 'flex h-8 items-center rounded-none bg-transparent px-3.5 py-1 text-xs xl:py-1.5'
                  : 'flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5'
              }            >
              {props.icon} {props.text}
            </Button>
          </DialogTrigger>
        )}
      </TooltipProvider>
      <div>
      <DialogContent className="fixed z-50 grid max-h-[95%] min-h-[350px] w-full max-w-3xl overflow-hidden dark:bg-slate-900 p-0 pt-2"
      onInteractOutside={(e) => {
        if( props.text === "Add"){
          const values = getValues();
          let formAllValues = Object.values(values);
          let findFormValue = formAllValues?.find((map_val)=> {
            return map_val !== '';
          });
          if( findFormValue){
            e.preventDefault();
            let ConfirmCloseForm = confirm("The data filled in the form will be lost. Do you want to close the form ?");
            if( ConfirmCloseForm ){
              setIsOpen(false);
            }
          }
        }
      }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <DialogHeader className="border-b border-inheritn text-start ">
              <div className="flex justify-between">
                <DialogTitle className="text-black-700 p-2 font-bold text-l ml-2">
                   {props.text || props.hidetext} User
                </DialogTitle>
                <DialogClose />
              </div>
            </DialogHeader>
            <div className="max-h-[calc(100vh-17rem)] max-w-full thin-scrollbar overflow-y-auto px-2">
              <div className="grid ml-auto mr-1.5 mt-2 gap-2">
                <div className="flex items-center ml-auto space-x-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="active" className="data-[state=checked]:bg-green-500 disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text" disabled={props.hidetext === "View"} defaultChecked={active}
                      onCheckedChange={handleToggleChange} />
                    <Label htmlFor="active" className="text-[0.7rem] font-semibold text-gray-600">Active</Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 px-2 xl:grid-cols-3 gap-2 p-3">
              <div>
                  <Label className="text-[0.7rem] font-semibold text-gray-600">Last Name</Label>
                  <Input
                    type="text"
                    placeholder={props.hidetext==="View" ? "-" : "Last name"}
                    className="w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    defaultValue={props?.rowdata?.lastName}
                    disabled={props.hidetext==="View"}
                    {...register("lastName")}
                  />
                  {errors.lastName?.message && (
                    <small className="text-red-500">
                      {errors.lastName.message}
                    </small>
                  )}
                </div>
                <div>
                  <Label className="text-[0.7rem] font-semibold text-gray-600">First Name</Label>
                  <Input
                    type="text"
                    placeholder={props.hidetext==="View" ? "-" : "First name"}
                    className="w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    defaultValue={props?.rowdata?.firstName}
                    disabled={props.hidetext==="View"}
                    {...register("firstName")}
                  />
                  {errors.firstName?.message && (
                    <small className="text-red-500">
                      {errors.firstName.message}
                    </small>
                  )}
                </div>
                <div>
                  <Label className="text-[0.7rem] font-semibold text-gray-600">Email</Label>
                  <Input
                    type="email"
                    placeholder={props.hidetext==="View" ? "-" : "Email"}
                    className={`w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text ${fieldError === 'email' ? 'border-red-500' : ''}`}
                    defaultValue={props?.rowdata?.email}
                    disabled={props.hidetext==="View"}
                    {...register("email")}
                  />
                  {errors.email?.message && (
                    <small className="text-red-500">
                      {errors.email.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 ml-2 gap-2">
                <div>
                  <Label className="flex relative mt-1 text-[0.7rem] font-semibold text-gray-600">Phone Number {!(props.hidetext === 'View') && phoneJson && typeof phoneJson === "object" && !(phoneJson.length > 4) &&
                      <div className="ml-[12rem] md:ml-[24rem] cursor-pointer text-inherit text-xs" onClick={() => {
                        let values = [...phoneJson, { phoneNumber: '', type: 'mobile', is_primary: 0 }];
                        setPhoneJson(values);

                      }} >
                        <Icons.phoneAdd className="h-5 w-5 cursor-pointer" />
                      </div>
                    } </Label>
                  <div className="">
                    {phoneJson && typeof phoneJson === "object" && phoneJson.map((field: any, index: any) => {
                      return (
                        <div key={index} className="flex my-2">
                          <div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Checkbox className="my-2 mr-3 border-slate-600" checked={field.is_primary ? true : false} onClick={(e: any) => {
                                    let values = [...phoneJson]
                                    let mapData = values.map((map_ele, map_index) => {
                                      if (map_index === index) {
                                        map_ele['is_primary'] = 1
                                      } else {
                                        map_ele['is_primary'] = 0
                                      }
                                      return map_ele;
                                    });

                                    setPhoneJson(mapData)
                                    setPhoneError(false)
                                  }} />
                                </TooltipTrigger>
                                <TooltipContent side='right'>
                                  <p>Make it primary phone number</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Select value={phoneJson[index]['type']} onValueChange={(value) => {
                            let values = [...phoneJson];
                            values[index]['type'] = value;
                            setPhoneJson(values)
                            setPhoneError(false);
                            setValue("phoneNumber", String(values));
                          }}>
                            <SelectTrigger className="w-[100px] md:w-[180px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" disabled={props.hidetext==="View"}>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent className="text-xs dark:bg-slate-900">
                              <SelectItem value="mobile" className="text-xs">Mobile</SelectItem>
                              <SelectItem value="work" className="text-xs">Work</SelectItem>
                              <SelectItem value="other" className="text-xs">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="text"
                            className="w-36 md:w-64 mx-2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                            placeholder={props.hidetext === "View" ? "-" : "+XX-(XXX) XXX-XXX"}
                            value={phoneJson[index]['phoneNumber']}
                            onKeyDown={(event) => keyDownLengthValidation(event, 12)}
                            disabled={props.hidetext==="View"}
                            onChange={(e) => {
                              console.log(fields);
                              let values = [...phoneJson];
                              values[index]['phoneNumber'] = formatPhoneNumber(e.target.value);
                              setPhoneJson(values)
                              setPhoneError(false);
                              setValue("phoneNumber", String(e.target.value));
                              // setValue("phoneNumber", formatPhoneNumber(e.target.value))
                            }} />

                          {["work"].includes(
                            phoneJson[index]["type"]
                          ) && (
                              <div className="">
                                {/* <Label className="text-xs">Ext</Label> */}
                                <Input
                                  type="text"
                                  maxLength={30}
                                  id={phoneJson[index]}
                                  className="w-[4.5rem] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                                  placeholder={props.hidetext === "View" ? "-" : "Ext"}
                                  disabled={props.hidetext === "View"}
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
                          {field && !field.is_primary && phoneJson && typeof phoneJson === "object" && props.hidetext !== "View" && phoneJson.length > 1 && <div> <X className="w-4 h-8 ml-2 cursor-pointer" type="button" onClick={() => {
                            let values = phoneJson;
                            let phoneData: any = [];
                            let originalData = values.forEach((map_ele: any, map_index: any) => {
                              if (index !== map_index) {
                                phoneData.push(map_ele)
                              }
                            });
                            setPhoneJson(phoneData);
                            setPhoneError(false)

                          }} /></div>
                          }
                        </div>
                      )
                    }
                    )}
                  </div>
                  {phoneError && (
                    <small className="text-red-500">
                      {'phoneNumber is required'}
                    </small>
                  )}

                </div>
              </div>
              {props.hidetext !== "View" && (
              <Accordion type="single" collapsible disabled={props.hidetext==="View"}>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="p-3 text-sm bg-slate-200 dark:bg-slate-700"> Add or update password</AccordionTrigger>
                  <AccordionContent className="mt-2 text-xs">
                    <label>Enter a new password so you can login faster</label>
                    <Input
                      id="password"
                      placeholder="Password"
                      type="password"
                      autoComplete="email"
                      autoCorrect="off"
                      className="mt-2 text-xs"
                      disabled={props.hidetext==="View"}
                      {...register("password")}
                    />
                    {errors.password?.message && (
                      <small className="text-red-500">
                        {errors.password.message}
                      </small>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              )}
              <div className="grid grid-cols-3 gap-2 mt-2 mb-3 p-2 ">
                <Label className="text-[0.7rem] font-semibold text-gray-600 col-span-5 mb-1">
                  Roles
                </Label>
                <RadioGroup className="col-span-5 flex flex-wrap">
                {rolesData.sort((a, b) => a.id - b.id).map((role: Role) => (
                  <div key={role.id} className="flex items-center ml-1">
                    <RadioGroupItem
                      value={role.id.toString()}
                      onClick={() => handleRadioChange(role.id)}
                      checked={selectedRoleIds.includes(role.id)}
                      defaultValue={props?.rowdata?.Roles}
                      className="mr-2 text-xs border-slate-600"
                      disabled={props.hidetext==="View"}
                    />
                      <Label htmlFor={role.id.toString()} className="text-xs">
                        {role.name}
                      </Label>

                  </div>
                ))}{" "}
                 </RadioGroup>
                <Input
                  type="hidden"
                  value={JSON.stringify(selectedRoleIds || [])}
                  {...register("roleIds")}
                />
                  {errors.roleIds?.message && (
                    <small className="px-2 text-red-500">{errors.roleIds.message}</small>
                  )}
              </div>
              {/* <hr
                color="red"
                style={{ height: "1px" }}
                className="sticky inset-x-0 top-0 flex flex-col space-y-1.5 border-b border-red-700 text-center sm:text-left"
              /> */}

              </div>
              {props.hidetext !== "View" && (
              <div className="border-t flex justify-end p-2">
                <DialogFooter className=" gap-2 mr-5 flex-row">
                  <DialogClose hidden={props.hidetext === "View"} className="text-xs text-black-700">Discard</DialogClose>
                    <Button type="submit" variant="outline" className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs">
                    <Icons.save className="w-4 h-4 mr-0.5" /> Save
                    </Button>
                </DialogFooter>
              </div>
             )}
          </div>
        </form>
      </DialogContent>
      </div>
    </Dialog>
  )
})
AlertDialogDemo.displayName = "AlertDialogDemo"
export default AlertDialogDemo;
