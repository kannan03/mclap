"use client"

import React, { ForwardedRef, forwardRef, useImperativeHandle } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import moment from "moment"
import Calendar from "react-calendar"
import { Form, useForm } from "react-hook-form"
import * as z from "zod"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import {
  cn,
  convertToUTCDate,
  formatPhoneNumber,
  keyDownLengthValidation,
  keyDownOnlyLetters,
} from "@/lib/utils"
import { DefContactSchema } from "@/lib/validations/home/contact"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Icons } from "../icons"
import { Input } from "../ui/input"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"
import "react-calendar/dist/Calendar.css"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { AddressSelect } from "../utils/states-cities-combobox"
import { ContactListCombobox } from "./main-contact-combo"

type FormData = z.infer<typeof DefContactSchema>

interface filterData {
  conPrefix: string
  conCountry: string
  conFirst: string
  conLast: string
  conMiddle: string
  conEmail: string
  conSex: string
  conOrg: string
  conSpeakSpanish: string
  conDoNotList: boolean
  conAddress: string
  conAddress2: string
  conAddress3: string
  conNotes: string
  conType: string
  conZip: string
}
// Import statements
const AddDefendantContact = forwardRef(
  (props: any, ref: ForwardedRef<unknown>) => {
    const {
      register,
      handleSubmit,
      reset,
      getValues,
      setValue,
      formState: { errors },
    } = useForm<FormData>({
      resolver: zodResolver(DefContactSchema),
    })
    const [isOpen, setIsOpen] = React.useState(false)
    const [date, setDate] = React.useState<any>(null)
    const [dateIsOpen, setDateIsOpen] = React.useState(false)
    const [endDate, setEndDate] = React.useState<any>(null)
    const [endDateIsOpen, setEndDateIsOpen] = React.useState(false)
    const [effectiveDate, setEffectiveDate] = React.useState<any>(null)
    const [effectiveDateIsOpen, setEffectiveDateIsOpen] = React.useState(false)
    const [isSubmitDisable, setIsSubmitDisable] = React.useState(false)

    const [phoneJson, setPhoneJson] = React.useState<any>([
      { phoneNumber: "", type: "mobile", is_primary: 1, extension: "" },
    ])
    const [phoneError, setPhoneError] = React.useState(false)
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

    useImperativeHandle(ref, () => {
      return {
        click: () => setIsOpen(true),
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
      if (payload.conBirthdate === "") {
        delete payload.conBirthdate
      }
      if (payload.conDoNotList === "") {
        delete payload.conDoNotList
      }
      if (payload.conState) {
        payload.conState = String(payload.conState)
      }
      payload.conSpeakSpanish = payload.conSpeakSpanish ? "Yes" : "no"
      if (props.rowdata) {
        try {
          payload.phoneNumber = phoneJson

          const contactID = props?.rowdata?.id

          let contactPayload = Object.assign({}, payload)
          let defContactPayload = {
            dcStartDate: payload?.dcStartDate ? payload.dcStartDate : null,
            dcEndDate: payload?.dcEndDate ? payload.dcEndDate : null,
            dcContactID: existContact ? existContact : null,
            dcDefID: props.defendantId,
          }
          let payloadData = {
            contact: contactPayload,
            defContact: defContactPayload,
          }

          const res = await axiosInstance.patch(
            `${baseURL}/v1/defendants/contact/${props?.defendantId}/${contactID}`,
            payloadData
          )
          if (res.status === 500 || res?.data?.statuscode === 500) {
            toast({
              variant: "default",
              description: "Contact Updated Failed",
              style: {
                background: "red",
              },
            })

          } else {
            if( res?.data?.data?.errorMsg){
              toast({
                variant: "destructive",
                description: "Contact name with same Contact Type and Organization already exists",
              })
            }else{
            toast({
              variant: "default",
              description: "DefContact Updated Successfully",
              style: {
                background: "#03C03C",
              },
            })
            }
          }
          let assignConsulateCheck = false;
          if( payload?.conLast == 'Protection'  && (payload?.conFirst == 'Dept' || payload?.conFirst == 'Department') && payload?.conType == 'Consulate' && !payload?.dcEndDate){
            assignConsulateCheck = true;
          }
          if( assignConsulateCheck){
            props?.refreshAssignConsulate(payload?.conOrg ? payload?.conOrg : filterData?.conOrg)
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
          payload.conCountry =
            payload.conCountry == "" ? "USA" : payload.conCountry
          let contactPayload = Object.assign({}, payload)
          let defContactPayload = {
            dcStartDate: payload?.dcStartDate ? payload.dcStartDate : null,
            dcEndDate: payload?.dcEndDate ? payload.dcEndDate : null,
            dcContactID: existContact ? existContact : null,
            dcDefID: props.defendantId,
          }
          let payloadData = {
            contact: contactPayload,
            defContact: defContactPayload,
          }

          const res = await axiosInstance.post(
            `${baseURL}/v1/defendants/contact/${props.defendantId}`,
            payloadData
          )
          if (res.status === 500 || res?.data?.statuscode === 500) {
            toast({
              variant: "default",
              description: "DefContact Created Failed",
              style: {
                background: "red",
              },
            })
          } else {
            if (res?.data?.data?.errorMsg) {
              toast({
                variant: "destructive",
                description: "Contact name with same Contact Type and Organization already exists",
              })
            } else {
              toast({
                variant: "default",
                description: "DefContact created successfully",
                style: {
                  background: "#03C03C",
                },
              })
            }
          }
          let assignConsulateCheck = false;
          if( payload?.conLast == 'Protection'  && (payload?.conFirst == 'Dept' || payload?.conFirst == 'Department') && payload?.conType == 'Consulate' && !payload?.dcEndDate){
            assignConsulateCheck = true;
          }
          if( assignConsulateCheck){
            props?.refreshAssignConsulate(payload?.conOrg ? payload?.conOrg : filterData?.conOrg)
          }
          props.refreshGrid()
          reset()
          setIsOpen(false)
        } catch (error: any) {
          setIsOpen(false)
        }
      }
      setIsViewMode(false)
    }
    const initialFilterData: filterData = {
      conPrefix: "",
      conCountry: "",
      conFirst: "",
      conLast: "",
      conMiddle: "",
      conType: "",
      conEmail: "",
      conSex: "",
      conOrg: "",
      conSpeakSpanish: "",
      conDoNotList: false,
      conAddress: "",
      conAddress2: "",
      conAddress3: "",
      conNotes: "",
      conZip: "",
    }

    const [filterData, setFilterData] =
      React.useState<filterData>(initialFilterData)
    const [isViewMode, setIsViewMode] = React.useState(false)
    
    // Search contact
    const [existContact, setExistContact] = React.useState("")
    const getFilterId = async (value: any) => {
      setExistContact(value)
      setIsViewMode(true)
      if (value === "") {
        setIsViewMode(false)
        return
      }
      const res = await axiosInstance.get(`${baseURL}/v1/contacts/${value}`)
      let contactData = res?.data?.data
      if (contactData) {
        setFilterData(contactData)
        setCountry(contactData?.conCountry)
        setCity(contactData?.conCity)
        setSelectContactType(contactData?.conType)
        setState(contactData?.conState)
        setConSex(contactData?.conSex)
      }
      if (contactData) {
        if (
          contactData.phoneNumber &&
          typeof contactData.phoneNumber === "object"
        ) {
          setPhoneJson(contactData?.phoneNumber)
        } else {
          setPhoneJson([{ phoneNumber: "", type: "mobile", is_primary: 1 }])
        }
        if (contactData.conFirst) {
          setValue("conFirst", contactData.conFirst)
        }
        if (contactData.conPrefix) {
          setConPrefix(contactData.conPrefix)
          setValue("conPrefix", contactData.conPrefix)
        }
        if (contactData.conFirst) {
          setValue("conLast", contactData.conLast)
        }
        if (contactData.conSex) {
          setValue("conSex", contactData.conSex)
        }
        if (contactData.conEmail) {
          setValue("conEmail", contactData.conEmail)
        }
        if (contactData.conType) {
          setValue("conType", contactData.conType)
        }
        if (contactData.conState) {
          setState(contactData.conState)
          setValue("conState", contactData.conState)
        }
        if (contactData.conSpeakSpanish) {
          setConSpeakSpanish(
            contactData.conSpeakSpanish == "Yes" ? true : false
          )
          setValue("conSpeakSpanish", contactData.conSpeakSpanish)
        }
        if (contactData.conCity) {
          setCity(contactData.conCity)
          setValue("conCity", contactData.conCity)
        }
        setCountry(contactData ? contactData?.conCountry : "USA")
      }
    }
    const [selectContactType, setSelectContactType] = React.useState("")
    const [conactTypeList, setContactTypeList] = React.useState<any>([])
    const [endDateError, setEndDateError] = React.useState("")

    const fetchData = async () => {
      try {
        let params = "Contact Type"
        const response = await axiosInstance.get(
          `${baseURL}/v1/codes/codeType/${params}`
        )
        const resp = response?.data?.data
        setContactTypeList(resp)
      } catch (error) {}
    }
    React.useEffect(() => {
      reset()
      fetchData()
      setConSex("")
      setState("")
      setCity("")
      setCountry('')
      setConPrefix("")
      setConSpeakSpanish(false)
      setSelectContactType("")
      setValue("conSex", "")
      setValue("conCountry", "")
      setValue("conCity", "")
      setValue("conState", "")
      setEffectiveDate(null)
      setEndDate(null)
      setEndDateError("")
      setPhoneJson([
        { phoneNumber: "", type: "mobile", is_primary: 1, extension: "" },
      ])
      setFilterData(initialFilterData)
      setDate(null)
      if (props?.rowdata) {
        if (
          props.rowdata.phoneNumber &&
          typeof props.rowdata.phoneNumber === "object"
        ) {
          setPhoneJson(props.rowdata.phoneNumber)
        } else {
          setPhoneJson([{ phoneNumber: "", type: "mobile", is_primary: 1 }])
        }
        if (props.hidetext === "View") {
          setIsViewMode(true)
        } else if (props.hidetext === "Add") {
          setIsViewMode(false)
        }
        if (props?.rowdata.conFirst) {
          setValue("conFirst", props?.rowdata.conFirst)
        }
        if (props?.rowdata.conPrefix) {
          setConPrefix(props?.rowdata.conPrefix)
          setValue("conPrefix", props?.rowdata.conPrefix)
        }
        if (props?.rowdata.conSex) {
          setConSex(props?.rowdata.conSex)
          setValue("conSex", props?.rowdata.conSex)
        }
        if (props?.rowdata.conEmail) {
          setValue("conEmail", props?.rowdata.conEmail)
        }
        if (props?.rowdata.conSpeakSpanish) {
          setConSpeakSpanish(
            props?.rowdata.conSpeakSpanish == "Yes" ? true : false
          )
          setValue("conSpeakSpanish", props?.rowdata.conSpeakSpanish)
        }
        if (props?.rowdata.conType) {
          setSelectContactType(props?.rowdata.conType)
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

        if (props?.rowdata?.dcStartDate) {
          if (moment(props.rowdata.dcStartDate).isValid()) {
            let dateFormat = convertToUTCDate(props.rowdata.dcStartDate)
            setEffectiveDate(new Date(dateFormat))
            setValue("dcStartDate", String(dateFormat))
          }
        }
        if (props?.rowdata?.dcEndDate) {
          if (moment(props.rowdata.dcEndDate).isValid()) {
            let dateFormat = convertToUTCDate(props.rowdata.dcEndDate)
            setEndDate(new Date(dateFormat))
            setValue("dcEndDate", String(dateFormat))
          }
        }

        setCountry(props?.rowdata ? props?.rowdata?.conCountry : "USA")
      }
    }, [isOpen, setValue])

    const [conSex, setConSex] = React.useState("")
    const [conPrefix, setConPrefix] = React.useState("")
    const [conSpeakSpanish, setConSpeakSpanish] = React.useState<any>(false)
    const genderOptions = [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" },
    ]
    const handleConSexChange = (value: any) => {
      setConSex(value)
      setValue("conSex", value, { shouldValidate: true })
    }

    const [country, setCountry] = React.useState(
      props?.rowdata ? props?.rowdata?.conCountry : "USA"
    )
    const [state, setState] = React.useState("")
    const [city, setCity] = React.useState("")

    const setStateValue = (value: any) => {
      setState(value)
      const conStateValue = value === "Select State" ? "" : String(value)
      setValue("conState", conStateValue, { shouldValidate: true })
      setCity("")
    }
    const setCityValue = (value: any) => {
      setCity(value)
      const conCityValue = value === "Select City" ? "" : String(value)
      setValue("conCity", conCityValue, { shouldValidate: true })
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
                    className={
                      "flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                    }
                  >
                    {props.icon} {props.text}
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-zinc-950 dark:bg-zinc-50"
              >
                <p className="text-xs text-slate-50 dark:text-slate-950">
                  Create new contact
                </p>
              </TooltipContent>
            </Tooltip>
          )}
          {(props.hidetext === "Edit" ||
            props.hidetext === "View" ||
            props.text === "Edit") && (
            <DialogTrigger asChild>
              <Button
                variant={props.text === "Edit" ? "outline" : "ghost"}
                disabled={props.disable}
                className={
                  props.hidetext === "Edit"
                    ? "flex h-8 items-center rounded-l-lg rounded-r-none border-r bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                    : props.hidetext === "View"
                    ? "flex h-8 items-center rounded-none bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                    : "flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                }
              >
                {props.icon} {props.text}
              </Button>
            </DialogTrigger>
          )}
        </TooltipProvider>
        <div>
          <DialogContent
            className="fixed z-50 grid max-h-full max-w-[25rem] md:max-w-[68rem] md:overflow-hidden p-0 pt-2 dark:bg-slate-900"
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
                  <DialogTitle className="text-black-700 text-l ml-2 p-2 font-bold">
                    {props.text || props.hidetext} Contact
                  </DialogTitle>
                  <div className="mr-10 flex justify-start md:justify-end">
                {props.hidetext === "Edit" || props.hidetext === "View" ? 
                <></> :
                    <ContactListCombobox
                      getFilterId={getFilterId}
                      comboboxDisable={props.hidetext === "View"}/>
                      }
                    <Label className="mt-2 ml-1 text-[0.7rem] font-semibold text-gray-600 whitespace-nowrap">
                      Type <span className="text-red-500"> *</span>
                    </Label>
                    <Select
                      value={selectContactType}
                      onValueChange={(e) => {
                        setValue("conType", e, { shouldValidate: true })
                        setSelectContactType(e)
                      }}
                    >
                      <SelectTrigger
                        className="select-custom ml-1 h-8 w-64 text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                        disabled={props.hidetext === "View"}
                      >
                        <SelectValue
                          placeholder={
                            props.hidetext === "View" ? "-" : "Select Type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="thin-scrollbar h-48 w-64 overflow-y-auto dark:bg-slate-900 ">
                        <SelectGroup>
                          <SelectItem value="" className="text-xs">
                            Select Type
                          </SelectItem>
                          {conactTypeList?.map((map_ele: any, i: any) => (
                            <SelectItem
                              value={map_ele?.codeCode}
                              key={i}
                              className="text-xs"
                            >
                              {map_ele?.codeCode}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.conType?.message && (
                      <small className="mx-4 text-red-500">
                        {errors.conType.message}
                      </small>
                    )}
                  </div>
                </div>
                <DialogClose />
              </DialogHeader>
              <div className="thin-scrollbar max-h-[calc(100vh-9.5rem)] overflow-y-auto px-2">
                <div className="flex flex-col md:flex-row gap-x-2 p-2">
                  <div className="">
                    <Label
                      htmlFor="conPrefix"
                      className="text-[0.7rem] font-semibold text-gray-600"
                    >
                      Prefix
                    </Label>
                    <Select
                      value={conPrefix}
                      onValueChange={(e) => {
                        setValue("conPrefix", e)
                        setConPrefix(e)
                      }}
                    >
                      <SelectTrigger
                        className="select-custom h-8 w-10 text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                        disabled={props.hidetext === "View" || isViewMode}
                      >
                        <SelectValue
                          className="text-gray-200"
                          placeholder={
                            props.hidetext === "View" || isViewMode ? "-" : "Select Type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent
                        id="conPrefix"
                        className="min-w-10 dark:bg-slate-900"
                      >
                        <SelectGroup>
                          <SelectItem value="Mr." className="text-xs">
                            Mr.
                          </SelectItem>
                          <SelectItem value="Ms." className="text-xs">
                            Ms.
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="conLast"
                      className="text-[0.7rem] font-semibold text-gray-600"
                    >
                      Last Name <span className="text-red-500"> *</span>
                    </Label>
                    <Input
                      id="conLast"
                      type="text"
                      maxLength={30}
                      disabled={props.hidetext === "View" || isViewMode}
                      placeholder={
                        props.hidetext === "View" || isViewMode ? "-" : "Last name"
                      }
                      defaultValue={
                        props?.rowdata?.conLast || filterData?.conLast
                      }
                      className="w-[320px] md:w-[210px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                      {...register("conLast")}
                    />
                    {errors.conLast?.message && (
                      <small className="text-red-500">
                        {errors.conLast.message}
                      </small>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="conFirst"
                      className="text-[0.7rem] font-semibold text-gray-600"
                    >
                      First Name <span className="text-red-500"> *</span>
                    </Label>
                    <Input
                      id="conFirst"
                      type="text"
                      maxLength={30}
                      placeholder={
                        props.hidetext === "View" || isViewMode ? "-" : "First name"
                      }
                      disabled={props.hidetext === "View" || isViewMode}
                      defaultValue={
                        props?.rowdata?.conFirst || filterData?.conFirst
                      }
                      className="w-[320px] md:w-[250px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                      {...register("conFirst")}
                    />
                    {errors.conFirst?.message && (
                      <small className="text-red-500">
                        {errors.conFirst.message}
                      </small>
                    )}
                  </div>
                  <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      Middle Name
                    </Label>
                    <Input
                      type="text"
                      maxLength={30}
                      placeholder={
                        props.hidetext === "View" || isViewMode ? "-" : "Middle name"
                      }
                      disabled={props.hidetext === "View" || isViewMode}
                      defaultValue={
                        props?.rowdata?.conMiddle || filterData?.conMiddle
                      }
                      className="text-xs  w-[320px] md:w-[215px] disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
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
                      <RadioGroup className="col-span-5 mt-2 flex flex-wrap">
                        {genderOptions.map((option) => (
                          <div
                            key={option.value}
                            className="ml-1 flex items-center"
                          >
                            <RadioGroupItem
                              value={option.value}
                              onClick={() => {
                                handleConSexChange(option.value)
                              }}
                              checked={conSex === option.value}
                              defaultValue={
                                props?.rowdata?.conSex || filterData?.conSex
                              }
                              className="mr-2 border-slate-600"
                              disabled={props.hidetext === "View" || isViewMode}
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
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-x-2 p-2">
                  <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      Email
                    </Label>
                    <Input
                      type="text"
                      placeholder={props.hidetext === "View" || isViewMode ? "-" : "Email"}
                      className="w-[320px] md:w-[260px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                      disabled={props.hidetext === "View" || isViewMode}
                      defaultValue={
                        props?.rowdata?.conEmail || filterData?.conEmail
                      }
                      {...register("conEmail")}
                    />
                    {errors.conEmail?.message && (
                      <small className="text-red-500">
                        {errors.conEmail?.message}
                      </small>
                    )}
                  </div>
                  <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      Organization{" "}
                    </Label>
                    <Input
                      type="text"
                      placeholder={
                        props.hidetext === "View" || isViewMode ? "-" : "Organization"
                      }
                      className="w-[320px] md:w-[250px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                      disabled={props.hidetext === "View" || isViewMode}
                      defaultValue={
                        props?.rowdata?.conOrg || filterData?.conOrg
                      }
                      {...register("conOrg")}
                    />
                  </div>
                  <div className="mt-5 flex items-center space-x-2">
                    <Checkbox
                      disabled={props.hidetext === "View" || isViewMode}
                      checked={conSpeakSpanish}
                      onCheckedChange={(e: any) => {
                        setConSpeakSpanish(e)
                        setValue("conSpeakSpanish", e ? "Yes" : "no")
                      }}
                      className="border-slate-600"
                    />
                    <Label className="text-xs">Speaks Spanish ?</Label>
                  </div>
                </div>
                <div className="grid frid-cols-1 md:grid-cols-2">
                  <div>
                  <div className="flex flex-col md:flex-row gap-2 p-2">
                    <div>
                      <Label className="text-[0.7rem] font-semibold text-gray-600">
                        Country
                      </Label>
                      <Select
                        value={country}
                        onValueChange={(value: any) => {
                          setCountry(value)
                          setValue("conCountry", String(value), {
                            shouldValidate: true,
                          })
                          setState("")
                          setCity("")
                        }}
                      >
                        <SelectTrigger
                          className="select-custom w-[320px] md:w-[260px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                          disabled={props.hidetext === "View" || isViewMode}
                        >
                          <SelectValue
                            placeholder={
                              props.hidetext === "View" || isViewMode ? "-" : "Select Country"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent
                          defaultValue={""}
                          className="dark:bg-slate-900"
                        >
                          <SelectItem value="" className="text-xs">
                            Select Country
                          </SelectItem>
                          <SelectItem value="USA" className="text-xs">
                            USA
                          </SelectItem>
                          <SelectItem value="Mexico" className="text-xs">
                            Mexico
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="hidden"
                        value={country ? country : ""}
                        {...register("conCountry", { required: true })}
                      />
                    </div>
                    <div>
                      <div>
                        <Label className="text-[0.7rem] font-semibold text-gray-600">
                          State{" "}
                        </Label>
                      </div>
                      <AddressSelect
                        category={
                          country == "Mexico"
                            ? "mexicoStatesAndCities"
                            : "usStatesAndCities"
                        }
                        country={country}
                        placeholdername={
                          props.hidetext === "View" || isViewMode ? "-" : "Select state"
                        }
                        defultselect={state}
                        selectedValue={setStateValue}
                        wPage={210}
                        disabled={!country || props.hidetext === "View" || isViewMode}
                        className={
                          props.hidetext === "View" || isViewMode
                            ? "select-custom disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                            : "w-[320px] md:w-[250px]"
                        }
                      />
                      <Input
                        type="hidden"
                        value={country ? country : ""}
                        {...register("conState", { required: true })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 p-2">
                  <div>
                      <div>
                        <Label className="text-[0.7rem] font-semibold text-gray-600">
                          City{" "}
                        </Label>
                      </div>
                      <AddressSelect
                        category={"city"}
                        country={country}
                        state={state}
                        defultselect={city}
                        placeholdername={
                          props.hidetext === "View" || isViewMode ? "-" : "Select city"
                        }
                        selectedValue={setCityValue}
                        wPage={260}
                        disabled={
                          !state  ||
                          state == "Select State" ||
                          props.hidetext === "View" || isViewMode
                        }
                        className={
                          props.hidetext === "View"|| isViewMode
                            ? "select-custom disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                            : "w-[320px] md:w-[260px]"
                        }
                      />
                      <Input
                        type="hidden"
                        value={country ? country : ""}
                        {...register("conCity", { required: true })}
                      />
                    </div>                  
                    <div>
                      <Label className="text-[0.7rem] font-semibold text-gray-600">
                        Zip{" "}
                      </Label>
                      <Input
                        type="text"
                        maxLength={30}
                        placeholder={props.hidetext === "View" || isViewMode ? "-" : "Zip"}
                        className="w-[320px] md:w-[250px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                        disabled={props.hidetext === "View" || isViewMode}
                        onKeyDown={(event) => keyDownLengthValidation(event, 5)}
                        defaultValue={
                          props?.rowdata?.conZip || filterData?.conZip
                        }
                        {...register("conZip")}
                      />
                    </div>
                  </div>
                  </div>
                  <div className="mt-[0.4rem] p-2 md:p-0">
                    <div>
                      <Label className="relative mt-1 flex text-[0.7rem] font-semibold text-gray-600">
                        Phone Number{" "}
                        {!(props.hidetext === "View") &&
                          phoneJson &&
                          typeof phoneJson === "object" &&
                          !(phoneJson.length > 4) && (
                            <div
                              className="ml-[18rem] md:ml-[20rem] cursor-pointer text-inherit"
                              onClick={() => {
                                let values = [
                                  ...phoneJson,
                                  {
                                    phoneNumber: "",
                                    type: "mobile",
                                    is_primary: 0,
                                  },
                                ]
                                setPhoneJson(values)
                              }}
                            >
                              <Icons.phoneAdd className="h-5 w-5 cursor-pointer" />
                            </div>
                          )}{" "}
                      </Label>
                    </div>
                    <div className="">
                      {phoneJson &&
                        typeof phoneJson === "object" &&
                        phoneJson.map((field: any, index: any) => {
                          const isLandlineOrDayOrEvePhone =
                            field.type === "landline" ||
                            field.type === "dayPhone" ||
                            field.type === "evePhone"
                          return (
                            <div
                              key={index}
                              className="mt-0.25 flex items-center"
                            >
                              <div className=" my-1 flex items-center">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Checkbox
                                        className="my-2 mr-3 border-slate-600"
                                        disabled={props.hidetext === "View"}
                                        checked={
                                          field.is_primary ? true : false
                                        }
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
                              >
                                <SelectTrigger
                                  className="select-custom w-[60px] md:w-[180px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                                  disabled={props.hidetext === "View" || isViewMode}
                                >
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-slate-900">
                                  <SelectItem
                                    value="mobile"
                                    className="text-xs"
                                  >
                                    Mobile
                                  </SelectItem>
                                  <SelectItem value="work" className="text-xs">
                                    Work
                                  </SelectItem>
                                  <SelectItem value="other" className="text-xs">
                                    Other
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                type="text"
                                placeholder={
                                  props.hidetext === "View"
                                    ? "-"
                                    : "Phone number"
                                }
                                className="w-50 mx-2 text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                                value={phoneJson[index]["phoneNumber"]}
                                disabled={props.hidetext === "View" || isViewMode}
                                onKeyDown={(event) =>
                                  keyDownLengthValidation(event, 12)
                                }
                                onChange={(e) => {
                                  let values = [...phoneJson]
                                  values[index]["phoneNumber"] =
                                    formatPhoneNumber(e.target.value)
                                  setPhoneJson(values)
                                  setPhoneError(false)
                                  setValue(
                                    "phoneNumber",
                                    String(e.target.value)
                                  )
                                  // setValue("phoneNumber", formatPhoneNumber(e.target.value))
                                }}
                              />
                              {["work"].includes(phoneJson[index]["type"]) && (
                                <div className="">
                                  {/* <Label className="text-xs">Ext</Label> */}
                                  <Input
                                    type="text"
                                    maxLength={30}
                                    id={phoneJson[index]}
                                    className="w-[4.5rem] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                                    placeholder={
                                      props.hidetext === "View" ? "-" : "Ext"
                                    }
                                    disabled={props.hidetext === "View" || isViewMode}
                                    value={phoneJson[index]["extension"]}
                                    onKeyDown={(event) =>
                                      keyDownLengthValidation(event, 5)
                                    }
                                    onChange={(e) => {
                                      let values = [...phoneJson]
                                      values[index]["extension"] =
                                        e.target.value
                                      setPhoneJson(values)
                                      // setValue("phoneNumber", formatPhoneNumber(e.target.value))
                                    }}
                                  />
                                </div>
                              )}
                              {/* delete button */}
                              {field &&
                                !field.is_primary &&
                                phoneJson &&
                                typeof phoneJson === "object" &&
                                phoneJson.length > 1 &&
                                !(props.hidetext === "View") && (
                                  <div className="mx-1">
                                    {" "}
                                    <Icons.close
                                      className="h-3 w-3 cursor-pointer"
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
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                  <div className="">
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      Address
                    </Label>
                    <Input
                      className="mb-2 h-[40px] w-[320px] md:w-full text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                      placeholder={
                        props.hidetext === "View" || isViewMode ? "-" : "Address Line 1"
                      }
                      disabled={props.hidetext === "View" || isViewMode}
                      defaultValue={
                        props?.rowdata?.conAddress || filterData?.conAddress
                      }
                      {...register("conAddress")}
                    />

                    <Input
                      className="mb-2 h-[40px] w-[320px] md:w-full text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                      placeholder={
                        props.hidetext === "View" || isViewMode ? "-" : "Address Line 2"
                      }
                      disabled={props.hidetext === "View" || isViewMode}
                      defaultValue={
                        props?.rowdata?.conAddress2 || filterData?.conAddress2
                      }
                      {...register("conAddress2")}
                    />

                    <Input
                      placeholder={
                        props.hidetext === "View" || isViewMode ? "-" : "Address Line 3"
                      }
                      className="mb-2 h-[40px] w-[320px] md:w-full text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                      disabled={props.hidetext === "View" || isViewMode}
                      defaultValue={
                        props?.rowdata?.conAddress3 || filterData?.conAddress3
                      }
                      {...register("conAddress3")}
                    />
                  </div>
                  <div className="">
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      Notes
                    </Label>
                    <Textarea
                      placeholder={
                        props.hidetext === "View" || isViewMode ? "-" : "Type here"
                      }
                      className="h-4/5 w-[320px] md:w-[520px] text-xs disabled:cursor-text disabled:resize-none disabled:border-0 disabled:p-0 disabled:opacity-100"
                      disabled={props.hidetext === "View" || isViewMode}
                      defaultValue={
                        props?.rowdata?.conNotes || filterData?.conNotes
                      }
                      {...register("conNotes")}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 p-2">
                  <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      Effective Date
                    </Label>
                    <div>
                      <Popover
                        open={effectiveDateIsOpen}
                        onOpenChange={(e) => {
                          setEffectiveDateIsOpen(e)
                        }}
                      >
                        <PopoverTrigger
                          asChild
                          disabled={props.hidetext === "View"}
                        >
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-8 w-[320px] md:w-[260px] justify-between text-left text-xs font-normal disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100",
                              !effectiveDate && "text-muted-foreground"
                            )}
                          >
                            {effectiveDate &&
                            moment(effectiveDate).isValid() ? (
                              <>
                              <div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {convertToUTCDate(effectiveDate)}
                              </div>
                                <div>
                                  <Icons.close className="h-4 w-4"
                                  onClick={()=>setEffectiveDate(null)} />
                                </div>
                              </>
                            ) : props.hidetext === "View" ? (
                              "-"
                            ) : (
                              <div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>Pick a date</span>
                              </div>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="thin-scrollbar max-h-50 m-1 w-[250px] overflow-y-auto p-0 text-xs text-black">
                          <Calendar
                            defaultView="century"
                            onChange={(e: any) => {
                              let dateObj = new Date(e)
                              let day = dateObj.getDate()
                              let month = dateObj.getMonth() + 1
                              let year = dateObj.getFullYear()
                              let dateStr = `${month}/${day}/${year}`
                              setEffectiveDate(e)
                              setValue("dcStartDate", String(dateStr))
                              setEffectiveDateIsOpen(false)
                            }}
                            value={effectiveDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      End Date
                    </Label>
                    <div>
                      <Popover
                        open={endDateIsOpen}
                        onOpenChange={(e) => {
                          setEndDateIsOpen(e)
                        }}
                      >
                        <PopoverTrigger
                          asChild
                          disabled={props.hidetext === "View"}
                        >
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-8 w-[320px] md:w-[250px] justify-between text-left text-xs font-normal disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            {endDate && moment(endDate).isValid() ? (
                              <><div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {convertToUTCDate(endDate)}
                              </div>
                                <div>
                                  <Icons.close className="h-4 w-4"
                                  onClick={()=>setEndDate(null)} />
                                </div>
                              </>
                            ) : props.hidetext === "View" ? (
                              "-"
                            ) : (
                              <div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>Pick a date</span>
                              </div>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="thin-scrollbar max-h-50 m-1 w-[250px] overflow-y-auto p-0 text-xs text-black">
                          <Calendar
                            defaultView="century"
                            onChange={(e: any) => {
                              let dateObj = new Date(e)
                              let day = dateObj.getDate()
                              let month = dateObj.getMonth() + 1
                              let year = dateObj.getFullYear()
                              let dateStr = `${month}/${day}/${year}`
                              if (dateObj > effectiveDate) {
                                setEndDate(dateObj)
                                setValue("dcEndDate", String(dateStr))
                                setEndDateError("")
                                setIsSubmitDisable(false)
                              } else {
                                setEndDateError(
                                  "End date must be greater than effective date"
                                )
                                setIsSubmitDisable(true)
                              }
                              setEndDateIsOpen(false)
                            }}
                            value={endDate}
                          />
                        </PopoverContent>
                      </Popover>
                      {endDateError && (
                        <div className="text-xs text-red-500">
                          {endDateError}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {props.hidetext !== "View" && (
                <div className="flex justify-end border-t p-2">
                  <DialogFooter className="mr-7 gap-2 flex-row">
                    <DialogClose
                      className="text-black-700 text-xs"
                      hidden={props.hidetext === "View"}
                    >
                      Discard
                    </DialogClose>
                    {props.hidetext !== "View" && (
                      <Button
                        type="submit"
                        variant="outline"
                        disabled={isSubmitDisable}
                        className="flex h-8 items-center rounded-lg bg-transparent px-5 py-1 text-xs xl:py-1.5"
                      >
                        <Icons.save className="mr-0.5 h-4 w-4" /> Save
                      </Button>
                    )}
                  </DialogFooter>
                </div>
              )}
            </form>
          </DialogContent>
        </div>
      </Dialog>
    )
  }
)
AddDefendantContact.displayName = "AddDefendantContact"
export default AddDefendantContact
