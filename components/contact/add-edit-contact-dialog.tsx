"use client"

import React, { ForwardedRef, forwardRef, useImperativeHandle } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import moment from "moment"
import { Form, useForm } from "react-hook-form"
import * as z from "zod"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { keyDownLengthValidation, keyDownOnlyLetters } from "@/lib/utils"
import { ContactSchema } from "@/lib/validations/home/contact"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatPhoneNumber } from "@/lib/utils"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Plus,
  X
} from "lucide-react"
import { AddressSelect } from "../utils/states-cities-combobox"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Icons } from "../icons"

type FormData = z.infer<typeof ContactSchema>
// Import statements
const AddContact = forwardRef((props:any, ref:ForwardedRef<unknown>) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ContactSchema),
  })
  const [isOpen, setIsOpen] = React.useState(false)
  const [date, setDate] = React.useState<any>(null)
  const [dateIsOpen, setDateIsOpen] = React.useState(false)
  const [phoneJson, setPhoneJson] = React.useState<any>([{ phoneNumber: '', type: 'mobile', is_primary: 1, extension: "" }]);
  const [phoneError, setPhoneError] = React.useState(false);
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

  useImperativeHandle(ref, () => {
    return {
      click : () => setIsOpen(true)
    }
  })

  const onSubmit = async (payload: any) => {
    if (payload.conInactivated) {
      if (!moment(payload.conInactivated)) {
        delete payload.conInactivated
      }
    }
    if (payload.conInactivated === "") {
      delete payload.conInactivated
    }
    if (payload.conState) {
      payload.conState = String(payload.conState)
    }
    payload.conSpeakSpanish = payload.conSpeakSpanish ? "Yes" : "no"

    if (props.rowdata) {
      try {
        payload.phoneNumber = phoneJson
        const contactID = props?.rowdata?.id
        const res = await axiosInstance.patch(
          `${baseURL}/v1/contacts/${contactID}`,
          payload
        )
        if (res?.status === 500) {
          toast({
            variant: "default",
            description: "Contact Updated Failed",
            style: {
              background: "red",
            },
          })
        } else {
          if(res?.data?.data?.errorMsg){
            toast({
              variant: "destructive",
              description: "Contact name with same Contact Type and Organization already exists",
            })

          }else{
            toast({
              variant: "default",
              description: "Contact updated successfully",
              style: {
                background: "#03C03C",
              },
            })
          }
        }
        props.refreshGrid()
        reset()
        setIsOpen(false)
      } catch (error: any) {
        console.log(error.message)
        setIsOpen(false)
      }
    } else {
      try {
        payload.phoneNumber = phoneJson
        payload.conCountry = payload.conCountry == '' ? "USA" : payload.conCountry
        const res = await axiosInstance.post(baseURL + "/v1/contacts", payload)
        if (res?.status === 500) {
          toast({
            variant: "default",
            description: "Contact Created Failed",
            style: {
              background: "red",
            },
          })
        } else {
          if(res?.data?.data?.errorMsg){
            toast({
              variant: "destructive",
              description: "Contact name with same Contact Type and Organization already exists",
            })

          }else{
            toast({
              variant: "default",
              description: "Contact created successfully",
              style: {
                background: "#03C03C",
              },
            })
          }
        }
        props.refreshGrid()
        reset()
        setIsOpen(false)
      } catch (error: any) {
        setIsOpen(false)
      }
    }
  }

  const [conactTypeList, setContactTypeList] = React.useState<any>([])

  const fetchData = async () => {
    try {
      let params = "Contact Type"
      const response = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/${params}`
      )
      const resp = response?.data?.data
      setContactTypeList(resp)
    } catch (error) { }
  }
  React.useEffect(() => {
    reset()
    fetchData()
    setConSex('')
    setValue("conSex", "")
    setValue("conCountry", "")
    setValue("conCity", "")
    setValue("conState", "")

    setPhoneJson([{ phoneNumber: '', type: 'mobile', is_primary: 1, extension: "" }]);
    setDate(null)
    if (props?.rowdata) {
      if (props.rowdata.phoneNumber && typeof props.rowdata.phoneNumber === "object") {
        setPhoneJson(props.rowdata.phoneNumber);
      } else {
        setPhoneJson([{ phoneNumber: '', type: 'mobile', is_primary: 1 }]);
      }
      if (props?.rowdata.conFirst) {
        setValue("conFirst", props?.rowdata.conFirst)
      }
      if (props?.rowdata.conSex) {
        setConSex(props?.rowdata.conSex)
        setValue("conSex", props?.rowdata.conSex)
      }
      if (props?.rowdata.conEmail) {
        setValue("conEmail", props?.rowdata.conEmail)
      }
      if (props?.rowdata.conType) {
        setValue("conType", props?.rowdata.conType)
      }
      if (props?.rowdata.conState) {
        setState(props?.rowdata.conState)
        setValue("conState", props?.rowdata.conState)
      }
      if (props?.rowdata.conCity) {
        setCity(props?.rowdata.conCity)
        setValue("conCity", props?.rowdata.conCity)
      }
      if (props?.rowdata.conSpeakSpanish) {
          setValue("conSpeakSpanish", props?.rowdata.conSpeakSpanish)
        }
      setCountry(props?.rowdata ? props?.rowdata?.conCountry : 'USA')

    }
  }, [isOpen, props?.rowdata, setValue])

  const [conSex, setConSex] = React.useState(props?.rowdata?.conSex || '');

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
  ];
  const handleConSexChange = (value: any) => {
    setConSex(value);
    setValue("conSex", value, { shouldValidate: true });

  };

  const [country, setCountry] = React.useState(props?.rowdata ? props?.rowdata?.conCountry : 'USA')
  const [state, setState] = React.useState('')
  const [city, setCity] = React.useState('')

  const setStateValue = (value: any) => {
    setState(value)
    const StateValue = value === "Select State" ? "" : String(value);
    setValue("conState", StateValue, { shouldValidate: true });
    setCity('')
  }
  const setCityValue = (value: any) => {
    setCity(value)
    const CityValue = value === "Select City" ? "" : String(value);
    setValue(
      "conCity", CityValue, { shouldValidate: true }
    )
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(openValue) => {
        if (props?.text == "Add") {
          if (openValue) {
            setIsOpen(openValue)
          } else {
            const values = getValues()
            let formAllValues = Object.values(values)
            let findFormValue = formAllValues?.find((map_val) => {
              return map_val != ""
            })
            if (findFormValue) {
              let ConfirmCloseForm = confirm(
                "The data filled in the form will be lost. Do you want to close the form ?"
              )
              if (ConfirmCloseForm) {
                setIsOpen(openValue)
              }
            } else {
              setIsOpen(openValue)
            }
          }
        } else {
          setIsOpen(openValue)
        }
      }}
    >
      <TooltipProvider>
        {(props.text === "Add" || props.hidetext === "Add") && (
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={props.disable}
                  className={'flex h-8 items-center rounded-lg bg-transparent px-1.5 md:px-3.5 py-1 text-xs xl:py-1.5'}
                >
                  {props.icon} <span className="hidden md:block">{props.text}</span>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-zinc-950 dark:bg-zinc-50">
              <p className="text-xs text-slate-50 dark:text-slate-950">
                Create new contact
              </p>
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
              }
            >
              {props.icon} {props.text}
            </Button>
          </DialogTrigger>
        )}
      </TooltipProvider>
      <div>
        <DialogContent
          className="fixed z-50 grid max-h-full max-w-[25rem] md:max-w-[68rem] md:overflow-hidden dark:bg-slate-900 p-0 pt-2"
          onInteractOutside={(e) => {
            if (props?.text == "Add") {
              const values = getValues()
              let formAllValues = Object.values(values)
              let findFormValue = formAllValues?.find((map_val) => {
                return map_val != ""
              })
              if (findFormValue) {
                e.preventDefault()
                let ConfirmCloseForm = confirm(
                  "The data filled in the form will be lost. Do you want to close the form ?"
                )
                if (ConfirmCloseForm) {
                  setIsOpen(false)
                }
              }
            }
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="border-b border-inherit text-start">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <DialogTitle className="text-black-700 p-2 ml-0 md:ml-2 text-l font-bold">
                  {props.text || props.hidetext} Contact
                </DialogTitle>
                <div className="flex justify-start md:justify-end mr-10">
                  <Label className="text-[0.7rem] font-semibold text-gray-600 mt-2">Type <span className="text-red-500"> *</span></Label>
                  <Select
                    defaultValue={props?.rowdata?.conType}
                    onValueChange={(e) => {
                      setValue("conType", e, { shouldValidate: true })
                    }}
                  >
                    <SelectTrigger className="h-8 w-64 ml-1 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" disabled={props.hidetext === "View"}>
                      <SelectValue placeholder={props.hidetext === "View" ? "-" : "Select Type"}  />
                    </SelectTrigger>
                    <SelectContent className="h-48 w-64 overflow-y-auto thin-scrollbar dark:bg-slate-900 ">
                      <SelectGroup>
                      <SelectItem value="" className="text-xs">Select Type</SelectItem>
                        {conactTypeList?.map((map_ele: any, i: any) => (
                          <SelectItem value={map_ele?.codeCode} key={i} className="text-xs">
                            {map_ele?.codeCode}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.conType?.message && (
                    <small className="text-red-500 mx-4">
                      {errors.conType.message}
                    </small>
                  )}
                </div>
                  </div>
                <DialogClose />
            </DialogHeader>
            <div className="thin-scrollbar max-h-[calc(100vh-9.5rem)] overflow-y-auto px-2">

              <div className="flex flex-col md:flex-row gap-x-2 p-2">
                {/* <div className="flex flex-row gap-x-2"> */}
                <div className="">
                  <Label className="text-[0.7rem] font-semibold text-gray-600">Prefix</Label>
                  <Select
                    defaultValue={props?.rowdata?.conPrefix}
                    onValueChange={(e) => {
                      setValue("conPrefix", e)
                    }}
                  >
                    <SelectTrigger className="h-8 w-10 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" disabled={props.hidetext === "View"}>
                      <SelectValue
                        className="text-gray-200"
                        placeholder={props.hidetext === "View" ? "-" : ""}
                      />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 min-w-10">
                      <SelectGroup>
                        <SelectItem value="Mr." className="text-xs">Mr.</SelectItem>
                        <SelectItem value="Ms." className="text-xs">Ms.</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[0.7rem] font-semibold text-gray-600">Last Name <span className="text-red-500"> *</span></Label>
                  <Input
                    type="text"
                    maxLength={30}
                    disabled={props.hidetext === "View"}
                    placeholder={props.hidetext === "View" ? "-" : "Last name"}
                    defaultValue={props?.rowdata?.conLast}
                    className="text-xs w-[320px] md:w-[210px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    {...register("conLast")}
                  />
                  {errors.conLast?.message && (
                    <small className="text-red-500">
                      {errors.conLast.message}
                    </small>
                  )}
                </div>
                <div>
                  <Label className="text-[0.7rem] font-semibold text-gray-600">
                    First Name <span className="text-red-500"> *</span>
                  </Label>
                  <Input
                    type="text"
                    maxLength={30}
                    disabled={props.hidetext === "View"}
                    placeholder={props.hidetext === "View" ? "-" : "First name"}
                    defaultValue={props?.rowdata?.conFirst}
                    className="text-xs w-[320px] md:w-[250px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    {...register("conFirst")}
                  />
                  {errors.conFirst?.message && (
                    <small className="text-red-500">
                      {errors.conFirst.message}
                    </small>
                  )}
                </div>
                <div>
                  <Label className="text-[0.7rem] font-semibold text-gray-600">Middle Name</Label>
                  <Input
                    type="text"
                    maxLength={30}
                    disabled={props.hidetext === "View"}
                    placeholder={props.hidetext === "View" ? "-" : "Middle name"}
                    defaultValue={props?.rowdata?.conMiddle}
                    className="text-xs w-[320px] md:w-[215px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    {...register("conMiddle")}
                  />
                </div>
                <div className=" ml-1.5">
                  <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      Gender <span className="text-red-500"> *</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroup className="col-span-5 flex flex-wrap mt-2">
                      {genderOptions.map(option => (
                        <div key={option.value} className="flex items-center ml-1">
                          <RadioGroupItem
                            value={option.value}
                            onClick={() => handleConSexChange(option.value)}
                            checked={conSex === option.value}
                            defaultValue={props?.rowdata?.conSex}
                            className="mr-2 text-xs border-slate-600 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                            disabled={props.hidetext === "View"}
                          />
                          <Label htmlFor={option.value} className="text-xs">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.conSex?.message && (
                      <small className="text-red-500">
                        {errors.conSex.message}
                      </small>
                    )}
                  </div>
                  {/* <Input
                      type="hidden"
                      value={conSex}
                      {...register("conSex")}
                    /> */}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-x-2 p-2">
                <div>
                  <Label className="text-[0.7rem] font-semibold text-gray-600">Email</Label>
                  <Input
                    type="text"
                    className="w-[320px] md:w-[260px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    disabled={props.hidetext === "View"}
                    placeholder={props.hidetext === "View" ? "-" : "Email"}
                    defaultValue={props?.rowdata?.conEmail}
                    {...register("conEmail")}
                  />
                  {errors.conEmail?.message && (
                    <small className="text-red-500">
                      {errors.conEmail?.message}
                    </small>
                  )}
                </div>
                <div>
                  <Label className="text-[0.7rem] font-semibold text-gray-600">Organization </Label>
                  <Input
                    type="text"
                    className="w-[320px] md:w-[250px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    disabled={props.hidetext === "View"}
                    placeholder={props.hidetext === "View" ? "-" : "Organization"}
                    defaultValue={props?.rowdata?.conOrg}
                    {...register("conOrg")}
                  />
                </div>
                <div className="ml-2 mt-5 flex items-center space-x-2">
                  <Checkbox
                    disabled={props.hidetext === "View"}
                    defaultChecked={props?.rowdata?.conSpeakSpanish == "Yes" ? true :false}
                    onCheckedChange={(e: any) => {
                      setValue("conSpeakSpanish", e ? "Yes" : "no")
                    }}
                    className="border-slate-600 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                  />
                  <Label className="text-xs">Speaks Spanish ?</Label>
                </div>

              </div>
              <div className="grid frid-cols-1 md:grid-cols-2">
                <div>

              <div className="flex flex-col md:flex-row gap-2 p-2">
                <div>
                  <Label className="text-[0.7rem] font-semibold text-gray-600">Country</Label>
                  <Select value={country}
                    onValueChange={(value: any) => {
                      setCountry(value)
                      setValue(
                        "conCountry",
                        String(value), { shouldValidate: true }
                      )
                      setState('')
                      setCity('')

                    }}>
                    <SelectTrigger className="w-[320px] md:w-[260px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" disabled={props.hidetext === "View"}>
                      <SelectValue placeholder={props.hidetext === "View" ? "-" : "Select Country"} />
                    </SelectTrigger>
                    <SelectContent defaultValue={""} className="dark:bg-slate-900">
                      <SelectItem value="" className="text-xs">Select Country</SelectItem>
                      <SelectItem value="USA" className="text-xs">USA</SelectItem>
                      <SelectItem value="Mexico" className="text-xs">Mexico</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="hidden"
                    value={
                      country
                        ? country
                        : ""
                    }
                    {...register("conCountry", { required: true })}
                  />
                </div>
                <div>
                  <div><Label className="text-[0.7rem] font-semibold text-gray-600">State </Label></div>
                  <AddressSelect category={country == "Mexico" ? "mexicoStatesAndCities" : "usStatesAndCities"} country={country}
                    placeholdername={props.hidetext === "View" ? "-" : "Select state"} defultselect={state}
                    selectedValue={setStateValue} wPage={210}
                    className={`${props.hidetext === "View" ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" : "w-[320px] md:w-[250px]"}`}
                    disabled={!country || props.hidetext === "View"} />
                  <Input
                    type="hidden"
                    value={
                      country
                        ? country
                        : ""
                    }
                    {...register("conState", { required: true })}
                  />
                </div>
                
                </div>

                <div className="flex flex-col md:flex-row gap-2 p-2">
                <div className="">
                  <div >
                    <Label className="text-[0.7rem] font-semibold text-gray-600">City </Label></div>
                  <AddressSelect category={"city"} country={country} state={state}
                    defultselect={city}
                    placeholdername={props.hidetext === "View" ? "-" : "Select city"} selectedValue={setCityValue} wPage={260}
                    disabled={!state || state == "Select State" || props.hidetext === "View"}
                    className={`${props.hidetext === "View" ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" : "w-[320px] md:w-[260px]"}`} />
                  <Input
                    type="hidden"
                    value={
                      country
                        ? country
                        : ""
                    }
                    {...register("conCity", { required: true })}
                  />

                </div>
                <div>
                  <Label className="text-[0.7rem] font-semibold text-gray-600">Zip </Label>
                  <Input
                    type="text"
                    maxLength={30}
                    placeholder={props.hidetext === "View" ? "-" : "Zip"}
                    className="w-[320px] md:w-[250px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    disabled={props.hidetext === "View"}
                    onKeyDown={(event) => keyDownLengthValidation(event, 5)}
                    defaultValue={props?.rowdata?.conZip}
                    {...register("conZip")}
                  />
                </div>
                </div>

                </div>
                
                <div className="ml-2 mt-[0.4rem] p-2 md:p-0">
                  <div>
                    <Label className="flex relative mt-1 text-[0.7rem] font-semibold text-gray-600 ">Phone Number {!(props.hidetext === 'View') && phoneJson && typeof phoneJson === "object" && !(phoneJson.length > 4) &&
                      <div className="ml-[18rem] md:ml-[20rem] cursor-pointer text-inherit" onClick={() => {
                        let values = [...phoneJson, { phoneNumber: '', type: 'mobile', is_primary: 0 }];
                        setPhoneJson(values);

                      }} >
                        <Icons.phoneAdd className="h-5 w-5 cursor-pointer" />
                      </div>
                    }               </Label>
                  </div>
                  <div className="">
                    {phoneJson && typeof phoneJson === "object" && phoneJson.map((field: any, index: any) => {
                      const isLandlineOrDayOrEvePhone =
                        field.type === "landline" ||
                        field.type === "dayPhone" ||
                        field.type === "evePhone";
                      return (
                        <div key={index} className="mt-0.25 flex items-center">
                          <div className=" my-1 flex items-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Checkbox className="my-2 mr-3 border-slate-600" disabled={props.hidetext === "View"} checked={field.is_primary ? true : false} onClick={(e: any) => {
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
                                  <p className="text-xs">Make it primary phone number</p>
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
                            <SelectTrigger className="w-[60px] md:w-[180px] text-xs" disabled={props.hidetext === "View"}>
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
                           placeholder={props.hidetext === "View" ? "-" : "Phone number"}
                            className="w-50 mx-2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text px-1 md:px-3"
                            value={phoneJson[index]['phoneNumber']}
                            disabled={props.hidetext === "View"}
                            onKeyDown={(event) => keyDownLengthValidation(event, 12)}
                            onChange={(e) => {
                              // console.log(fields);
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
                          {field && !field.is_primary && phoneJson && typeof phoneJson === "object" && phoneJson.length > 1  && !(props.hidetext === "View") && <div className="mx-1"> <Icons.close className="h-3 w-3" type="button" onClick={() => {
                            let values = phoneJson;
                            let phoneData: any = [];
                            let originalData = values.forEach((map_ele: any, map_index: any) => {
                              if (index !== map_index) {
                                phoneData.push(map_ele)
                              }
                            });
                            setPhoneJson(phoneData);
                            setPhoneError(false)

                          }} />
                          </div>
                          }
                        </div>
                      )
                    }
                    )}

                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                <div className="">
                  <Label className="text-[0.7rem] font-semibold text-gray-600">Address</Label>
                  <Input
                    className="mb-2 h-[40px] w-[320px] md:w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    placeholder={props.hidetext === "View" ? "-" : "Address Line 1"}
                    disabled={props.hidetext === "View"}
                    defaultValue={props?.rowdata?.conAddress}
                    {...register("conAddress")}
                  />

                  <Input
                    className="mb-2 h-[40px] w-[320px] md:w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    placeholder={props.hidetext === "View" ? "-" : "Address Line 2"}
                    disabled={props.hidetext === "View"}
                    defaultValue={props?.rowdata?.conAddress2}
                    {...register("conAddress2")}
                  />

                  <Input
                     placeholder={props.hidetext === "View" ? "-" : "Address Line 3"}
                    className="mb-2 h-[40px] w-[320px] md:w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    disabled={props.hidetext === "View"}
                    defaultValue={props?.rowdata?.conAddress3}
                    {...register("conAddress3")}
                  />
                </div>
                <div className="pb-2 md:pb-0">
                  <Label className="text-[0.7rem] font-semibold text-gray-600">Notes</Label>
                  <Textarea
                     placeholder={props.hidetext === "View" ? "-" : "Type here"}
                    className="h-4/5 w-[320px] md:w-[520px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none"
                    disabled={props.hidetext === "View"}
                    defaultValue={props?.rowdata?.conNotes}
                    {...register("conNotes")}
                  />
                </div>
              </div>


            </div>

            {/* <hr
                                color="green"
                                style={{ height: "2px" }}
                                className="bg-red-700 text-2xl font-bold my-3 mt-1 " /> */}
           {props.hidetext !== "View" && (
            <div className="border-t flex justify-end p-2">
              <DialogFooter className="gap-2 mr-7 flex-row">
                <DialogClose className="text-black-700 text-xs" hidden={props.hidetext === "View"}>Discard</DialogClose>
                  <Button type="submit" variant="outline" className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs">
                   <Icons.save className="w-4 h-4 mr-0.5" /> Save
                  </Button>
              </DialogFooter>
            </div>
                )}
          </form>
        </DialogContent>
      </div>
    </Dialog>
  )
})
AddContact.displayName = 'AddContact'
export default AddContact;
