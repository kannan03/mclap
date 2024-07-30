"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import moment from "moment"
import Calendar from "react-calendar"
import { Form, useForm } from "react-hook-form"
import * as z from "zod"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { cn, keyDownLengthValidation, keyDownOnlyLetters, convertToUTCDate } from "@/lib/utils"
import { CaseSchema } from "@/lib/validations/case"
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
import { Icons } from "@/components/icons"

import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"
import { ComboboxCourts } from "./district-court-combobox."
import "react-calendar/dist/Calendar.css"
import { redirect, useSearchParams } from "next/navigation"
import { getSession } from "next-auth/react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AddressSelect } from "../utils/states-cities-combobox"
import { CoDefendantCombobox } from "./co-defendant-combobox"
import { CrimeTypeCombobox } from "./crimetype-combobox"

type FormData = z.infer<typeof CaseSchema>

export function AddDefendantCases(props: any) {
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CaseSchema),
  })
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const [isOpen, setIsOpen] = React.useState(false)
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [victimDeleteData, setVictimDeleteData] = React.useState<any>([])
  const [nonProgDefDeleteData, setNonProgDefDeleteData] = React.useState<any>(
    []
  )
  const [crimeTypeDeleteData, setCrimeTypeDeleteData] = React.useState<any>([])
  const [victimData, setVictimData] = React.useState<any>( props?.rowdata?.victims?.length > 0 ? props?.rowdata?.victims : [
    {
      vicLast: "",
      vicFirst: "",
      vicMiddle: "",
      vicAge: null,
      vicSex: "",
      vicRace: "",
    },
  ])
  const [crimeTypeData, setCrimeTypeData] = React.useState<any>([])
  const [coDefendantData, setcoDefendantData] = React.useState<any>([])
  const [nonProgDefData, setNonProgDefData] = React.useState<any>( props?.rowdata?.nonProgDefs.length > 0 ? props?.rowdata?.nonProgDefs : [
    { npdLast: "", npdFirst: "", npdMiddle: "", npdNotes: "" },
  ] )
  const [raceTypeList, setRaceTypeList] = React.useState<any>([])
  const [crimeTypeList, setCrimeTypeList] = React.useState<any>([])
  const [state, setState] = React.useState("")
  const [city, setCity] = React.useState("")
  const [IsFederal, setIsFederal] = React.useState(false)
  const [dateIsOpen, setDateIsOpen] = React.useState(false)
  const [date, setDate] = React.useState<any>(null)
  const [caseNumber, setCaseNumber] = React.useState<any>("")
  const [caseCrimeDescription, setCaseCrimeDescription] =React.useState<any>("")
  const [caseCaseSummary, setCaseCaseSummary] = React.useState<any>("")
  const [caseDistrict, setCaseDistrict] = React.useState<any>("")
  const [caseTitle, setCaseTitle] = React.useState<any>("")
  const [relationshipList, setRelationshipList] = React.useState<any>([])
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [isAddMode, setIsAddMode] = React.useState(true)
  const [isViewMode, setIsViewMode] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("cases")
  const selectCourt = (value: any) => {
    setValue("caseDistrict", value)
    setCaseDistrict(value)
  }
  const setChargedStateValue = (value: any) => {
    setState(value)
    setCity("")
    setValue("caseState", value)
  }
  const setChargedCountyValue = (value: any) => {
    setCity(value)
    setValue("caseCounty", value)
  }
  const handleChange = (value: any) => {
    setValue("crimeType", value)
    setCrimeTypeData(value)
  }
  const getCoDefendant = (value: any) => {
    setcoDefendantData(value)
  }
  const fetchData = async () => {
    try {
      console.log("i aM iN")

      const responseCrime = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/Crime Type`
      )
      const CrimeList = responseCrime?.data?.data ? responseCrime.data.data : []
      setCrimeTypeList(CrimeList)
      const responseRace = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/Race`
      )
      const RaceList = responseRace?.data?.data ? responseRace?.data?.data : []
      setRaceTypeList(RaceList)
      if (props?.rowdata && searchParams?.get("defendantId")) {
        let defId = searchParams?.get("defendantId")
        const getCoDef = await axiosInstance.get(
          `${baseURL}/v1/defendants/coDefendant/${props?.rowdata?.id}/${defId}`
        )
        if (getCoDef?.data?.data) {
          let MapName = getCoDef?.data?.data?.map((map_ele: any) => {
            let names = `${map_ele?.id} - ${
              map_ele?.defLast ? map_ele.defLast : ""
            }${map_ele?.defLast ? ", " : ""}${
              map_ele?.defFirst ? map_ele.defFirst : ""
            }`
            return names
          })
          setcoDefendantData(MapName)
        }
      }
    } catch (error) {}
    try {
      let params = "Relationship"
      const response = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/${params}`
      )
      const resp = response?.data?.data
      setRelationshipList(resp)
    } catch (error) {}
  }

  const onSubmit = async (payload: any) => {
    let defId = searchParams?.get("defendantId")
    let coDefendant = coDefendantData?.map((map_ele: any) => {
      let coDef: any = {}
      if (map_ele) {
        let splitStr = String(map_ele).split("-")
        let ID = splitStr[0]
        coDef["id"] = ID
      }
      return coDef
    })

    let payloadData = {
      case: {
        caseTitle: payload.caseTitle,
        caseCrimeDate: payload?.caseCrimeDate ? payload.caseCrimeDate : null,
        caseNumber: payload.caseNumber ? payload.caseNumber : null,
        caseCrimeDescription: payload.caseCrimeDescription,
        caseCaseSummary: payload.caseCaseSummary,
        caseFederal: payload.caseFederal == "true" ? "Yes" : "no",
        caseDistrict: payload.caseDistrict,
        caseState: payload.caseState,
        caseCounty: payload.caseCounty,
      },
      crimeType: payload.crimeType,
      victim: victimData,
      nonProgDef: nonProgDefData,
      victimDelete: victimDeleteData,
      nonProgDefDelete: nonProgDefDeleteData,
      coDefendant: coDefendant,
    }

    if (props.rowdata) {
      try {
        const caseID = props?.rowdata?.id
        const res = await axiosInstance.patch(
          `${baseURL}/v1/case/${defId}/${caseID}`,
          payloadData
        )
        if (res?.status === 500 || res?.status === 400) {
          toast({
            variant: "default",
            description: "Case updated failed",
            style: {
              background: "red",
            },
          })
        } else {
          toast({
            variant: "default",
            description: "Case updated successfully",
            style: {
              background: "#03C03C",
            },
          })
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
        const res = await axiosInstance.post(
          `${baseURL}/v1/case/defcase/${defId}`,
          payloadData
        )
        if (res?.status === 500 || res?.status === 400) {
          toast({
            variant: "default",
            description: "Case created failed",
            style: {
              background: "red",
            },
          })
        } else {
          toast({
            variant: "default",
            description: "Case created successfully",
            style: {
              background: "#03C03C",
            },
          })
        }
        props.refreshGrid()
        reset()
        setIsOpen(false)
      } catch (error: any) {
        setIsOpen(false)
      }
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      reset()
      fetchData()
      try {
        if (props?.rowdata) {
          setIsAddMode(false)
          setIsEditMode(false)
          setIsViewMode(true)
          if (props?.rowdata?.victims) {
            if (props?.rowdata?.victims?.length > 0) {
              props?.rowdata?.victims?.sort((a: any, b: any) => a.id - b.id)
              setVictimData(props?.rowdata?.victims)
            } 
          }
          if (props?.rowdata?.crimeTypes) {
            if (props?.rowdata?.crimeTypes?.length > 0) {
              let crimetypes = props?.rowdata?.crimeTypes.map(
                (ele: any) => ele.ctCrimeType
              )
              // setCrimeTypeData(crimetypes)
              setTimeout(() => {
                handleChange(crimetypes)
              }, 500);
            }
          }
          if (props?.rowdata?.nonProgDefs) {
            if (props?.rowdata?.nonProgDefs?.length > 0) {
              props?.rowdata?.nonProgDefs?.sort((a: any, b: any) => a.id - b.id)
              setNonProgDefData(props?.rowdata?.nonProgDefs)
            }
          }
          if (props?.rowdata?.caseFederal == "Yes") {
            setIsFederal(true)
            setValue("caseFederal", props?.rowdata.caseFederal)
          }
          if (props?.rowdata?.caseDistrict) {
            setValue("caseDistrict", props?.rowdata.caseDistrict)
            setCaseDistrict(props?.rowdata.caseDistrict)
          }
          if (props?.rowdata?.caseState) {
            setState(props?.rowdata?.caseState)
            setValue("caseState", props?.rowdata?.caseState)
          }
          if (props?.rowdata?.caseCounty) {
            setCity(props?.rowdata?.caseCounty)
            setValue("caseCounty", props?.rowdata?.caseCounty)
          }
          if (props?.rowdata?.caseCrimeDate) {
            if (moment(props?.rowdata?.caseCrimeDate).isValid()) {
              let dateFormat = convertToUTCDate(props?.rowdata?.caseCrimeDate)
              setDate(new Date(dateFormat))
              setValue("caseCrimeDate", dateFormat, { shouldValidate: true })
            }
          }
          if (props?.rowdata?.caseTitle) {
            setValue("caseTitle", props.rowdata.caseTitle)
            setCaseTitle(props.rowdata.caseTitle)
          }
          if (props?.rowdata?.caseNumber) {
            setValue("caseNumber", props.rowdata.caseNumber)
            setCaseNumber(props.rowdata.caseNumber)
          }
          if (props?.rowdata?.caseCaseSummary) {
            setValue("caseCaseSummary", props.rowdata.caseCaseSummary)
            setCaseCaseSummary(props.rowdata.caseCaseSummary)
          }
          if (props?.rowdata?.caseCrimeDescription) {
            setValue("caseCrimeDescription", props.rowdata.caseCrimeDescription)
            setCaseCrimeDescription(props.rowdata.caseCrimeDescription)
          }
        } 
      } catch (err) {}
      const fetchUserRoles = async () => {
        const session = await getSession()
        setUserRoles(session?.user?.roles || [])
      }
      fetchUserRoles()
    }
    if (props.hidetext === "Add") {
        setVictimDeleteData([])
        setNonProgDefDeleteData([])
        setVictimData([{}])
        setState("")
        setCity("")
        setIsFederal(false)
        setDate(null)
        setCaseNumber("")
        setCaseCrimeDescription("")
        setCaseCaseSummary("")
        setCaseDistrict("")
        setCaseTitle("")
        setIsAddMode(true)
        setIsEditMode(false)
        setIsViewMode(false)
    }
  }, [isOpen, reset])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(openValue) => {
        setCrimeTypeData([])
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
            <TooltipContent side="top" className="bg-zinc-950 dark:bg-zinc-50">
              <p className="text-xs text-slate-50 dark:text-slate-950">
                Create new case
              </p>
            </TooltipContent>
          </Tooltip>
        )}
        {(props.hidetext === "Edit" ||
          props.hidetext === "View" ||
          props.text === "Edit") && (
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={props.disable}
                  className={
                    props.hidetext === "Edit"
                      ? "flex h-8 items-center rounded-none border-r border-none bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                      : props.hidetext === "View"
                      ? "flex h-8 items-center rounded-lg bg-transparent px-4 py-1 text-xs xl:py-1.5"
                      : "flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                  }
                >
                  {props.icon} {props.hidetext ? "" : props.text}
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            {props.hidetext === "View" && (
              <TooltipContent
                side="top"
                className="bg-zinc-950 dark:bg-zinc-50">
                <p className="text-xs text-slate-50 dark:text-slate-950">
                  View case details
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        )}
      </TooltipProvider>
      <div>
        <DialogContent
          className="fixed z-50 grid max-h-[95%] min-h-[900xp] max-w-3xl overflow-hidden xl:w-full dark:bg-slate-900 p-0 pt-2"
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
            <div className="flex flex-col">
              <div>
                <Tabs value={activeTab}
                onValueChange={setActiveTab} className="w-full ">
                  <DialogHeader className="border-b border-inherit ">
                    <div className="flex justify-between">
                      <TabsList className="bg-white dark:bg-inherit h-9 p-0">
                        <TabsTrigger
                          value="cases"
                          className={`border-transparent text-xs decoration-red-500 decoration-2 ${activeTab === "cases" ? "font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""}  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                        >
                          General case information
                        </TabsTrigger>
                        <TabsTrigger
                          value="co-denfendant"
                          className={`border-transparent text-xs decoration-red-500 decoration-2 ${activeTab === "co-denfendant" ? "font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""}  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                        >
                          Co-defendant
                        </TabsTrigger>
                        {/* <TabsTrigger value="notes-event"
                                                    className="border-none decoration-red-500 decoration-2 underline-offset-2 focus:underline focus:shadow-none focus:outline-none dark:text-white">Notes/Event</TabsTrigger> */}
                      </TabsList>
                      <DialogClose />
                    </div>
                  </DialogHeader>
                  <TabsContent value="cases">
                    <div className="thin-scrollbar max-h-[calc(100vh-14rem)] max-w-full overflow-y-auto px-4">
                      <div className="flex flex-col md:flex-row gap-2 mb-1 ">
                        <div className="col-span-3">
                          <Label htmlFor="case-title" 
                          className="text-[0.7rem] font-semibold text-gray-600">
                            Case Title
                            <span className="text-red-500"> *</span>
                          </Label>
                          <Input
                            id="case-title"
                            value={caseTitle}
                            type="text"
                            placeholder={isViewMode ? "-" : "Case title"}
                            onChange={(e) => {
                              setValue("caseTitle", e.target.value)
                              setCaseTitle(e.target.value)
                            }}
                            className="text-xs w-full md:w-[360px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                            disabled={isViewMode}
                          />
                          {errors.caseTitle?.message && !caseTitle &&(
                            <small className="text-red-500">
                              {errors.caseTitle.message}
                            </small>
                          )}
                        </div>
                        {!isAddMode && (
                          <div className="ml-auto w-16">
                            <Label htmlFor="case-id" className="text-[0.7rem] font-semibold text-gray-600">
                              Case ID
                            </Label>
                            <Input
                              id="case-id"
                              defaultValue={props?.rowdata?.id}
                              type="id"
                              placeholder={isViewMode ? "-" : "Case ID"}
                              className="text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                              disabled={isViewMode || isEditMode}
                            />
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="col-span-2 mb-1 ">
                          <Label
                            htmlFor="trial-case-number"
                            className="text-[0.7rem] font-semibold text-gray-600"
                          >
                            Trial Case Number
                          </Label>
                          <Input
                            id="trial-case-number"
                            type="text"
                            placeholder={isViewMode ? "-" : "Trail case number"}
                            value={caseNumber}
                            onChange={(e) => {
                              setValue("caseNumber", e.target.value)
                              setCaseNumber(e.target.value)
                            }}
                            disabled={isViewMode}
                            className="text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="crime-date" className="text-[0.7rem] font-semibold text-gray-600">
                            Crime Date
                          </Label>
                          <div>
                            <Popover
                              open={dateIsOpen}
                              onOpenChange={(e) => {
                                setDateIsOpen(e)
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  disabled={isViewMode}
                                  variant={"outline"}
                                  className={cn(
                                    "h-8 w-full justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                    !date && "text-muted-foreground"
                                  )}
                                >
                                   {date&& moment(date).isValid() ? (
                                      <>
                                      <div className="flex">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {convertToUTCDate(date)}
                                      </div>
                                        <div>
                                          <Icons.close className="mr-2 h-4 w-4"
                                           onClick={()=>setDate(null)} />
                                        </div>
                                      </>
                                    ) : (
                                      isViewMode ? "-" : <div className="flex">
                                        <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                      </div>
                                    )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                id="crime-date"
                                className="thin-scrollbar max-h-50 m-1 w-[250px] overflow-y-auto p-0 text-xs text-black"
                              >
                                <Calendar
                                  defaultView="century"
                                  onChange={(e: any) => {
                                    let dateObj = new Date(e)
                                    let day = dateObj.getDate()
                                    let month = dateObj.getMonth() + 1
                                    let year = dateObj.getFullYear()
                                    let dateStr = `${month}/${day}/${year}`
                                    setDate(e)
                                    setValue("caseCrimeDate", String(dateStr), {
                                      shouldValidate: true,
                                    })
                                    setDateIsOpen(false)
                                  }}
                                  value={date}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          {errors.caseCrimeDate?.message && (
                            <small className="text-red-500">
                              {errors.caseCrimeDate.message}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="col-span-2">
                          <Label
                            htmlFor="crime-description"
                            className="text-[0.7rem] font-semibold text-gray-600"
                          >
                            Crime Description
                          </Label>
                          <Textarea
                            id="crime-description"
                            placeholder={isViewMode ? "-" : "Type here.."}
                            className="h-5/6 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none"
                            value={caseCrimeDescription}
                            disabled={isViewMode}
                            onChange={(e) => {
                              setValue("caseCrimeDescription", e.target.value)
                              setCaseCrimeDescription(e.target.value)
                            }}
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="flex flex-col mt-2">
                            <Label htmlFor="crime-types" className="text-[0.7rem] font-semibold text-gray-600">
                              Crime Types
                              <span className="text-red-500"> *</span>
                            </Label>
                            <CrimeTypeCombobox
                              ListData={crimeTypeList}
                              handleChange={handleChange}
                              placholderName={isViewMode ? "" : "Select Crime Type"}
                              EditData={crimeTypeData}
                              viewMode={isViewMode}
                              disabled={isViewMode}
                            />{errors.crimeType?.message && !crimeTypeData?.length && (
                              <small className="text-red-500">
                                {errors.crimeType.message}
                              </small>)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-1">
                        <div>
                          <Label htmlFor="cases-summary" className="text-[0.7rem] font-semibold text-gray-600">
                            Case Summary
                          </Label>
                        </div>
                        <div>
                          <Textarea
                            id="cases-summary"
                            className="h-20 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none"
                            placeholder={isViewMode ? "-" : "Type here.."}
                            value={caseCaseSummary}
                            disabled={isViewMode}
                            onChange={(e) => {
                              setValue("caseCaseSummary", e.target.value)
                              setCaseCaseSummary(e.target.value)
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="my-2">
                          <h4 className="text-[0.7rem] font-semibold text-gray-600 ">State of Prosecution</h4>
                          <AddressSelect
                            country={"USA"}
                            category={"usStatesAndCities"}
                            placeholdername={isViewMode ? "-" : "Select state"}
                            defultselect={state}
                            disabled={isViewMode}
                            selectedValue={setChargedStateValue}
                            wPage={190}
                            className={isViewMode ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" : ""}
                          />
                        </div>
                        <div className="ml-5 mt-4 flex items-center">
                          <Checkbox
                            checked={IsFederal}
                            onCheckedChange={(value: any) => {
                              setValue("caseFederal", String(value))
                              setIsFederal(value)
                            }}
                            disabled={isViewMode}
                            className="border-slate-600 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                          />
                          <Label className="text-xs ml-1">Federal</Label>
                        </div>
                        {IsFederal && (
                          <div className="mr-5 mt-1">
                            <Label htmlFor="district" className="text-[0.7rem] font-semibold text-gray-600">
                              District Court
                            </Label>
                            <ComboboxCourts
                              selectedValue={selectCourt}
                              defultselect={caseDistrict}
                              disabled={isViewMode}
                            />
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="flex flex-col">
                          <div>
                            <Label className="text-[0.7rem] font-semibold text-gray-600">
                              County of Prosecution
                            </Label>
                          </div>
                          <AddressSelect
                            category={"county"}
                            placeholdername={isViewMode ? "-" : "Select County"}
                            state={state}
                            defultselect={city}
                            selectedValue={setChargedCountyValue}
                            wPage={190}
                            disabled={isViewMode}
                            className={isViewMode ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" : "w-[320px] md:w-[190px]"}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between mt-5 mb-2 mr-2">
                        <Label className="text-sm font-bold">Victims</Label>
                        <Icons.add
                          className="h-4 w-4"
                          hidden={isViewMode}
                          onClick={() => {
                            let addVictim = [
                              ...victimData,
                              {
                                vicLast: "",
                                vicFirst: "",
                                vicMiddle: "",
                                vicAge: null,
                                vicSex: "",
                                vicRace: "",
                              },
                            ]
                            setVictimData(addVictim)
                          }}
                        />
                      </div>

                      <div>
                        {victimData &&
                          victimData?.map((map_victim: any, i: any) => {
                            if (
                              victimData[i] &&
                              typeof victimData[i] === "object"
                            ) {
                              return (
                                <div key={i}  className="border border-dashed p-2">
                                  <Icons.close
                                    hidden={isViewMode}
                                    onClick={() => {
                                      let deleteData: any = JSON.parse(
                                        JSON.stringify(victimData)
                                      )
                                      if (deleteData[i]) {
                                        let deleteItem: any = JSON.parse(
                                          JSON.stringify(deleteData[i])
                                        )
                                        setVictimDeleteData([
                                          ...victimDeleteData,
                                          deleteItem,
                                        ])
                                      }
                                      delete deleteData[i]
                                      setVictimData(deleteData)
                                    }}
                                    className="float-right h-4 w-4"
                                  />
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                                    <div className="">
                                      <Label
                                        htmlFor="lastname"
                                        className="text-[0.7rem] font-semibold text-gray-600"
                                      >
                                        Last Name
                                      </Label>
                                      <Input
                                        id="lastname"
                                        placeholder={isViewMode ? "-" : "Last name"}
                                        className="h-8 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                                        value={victimData[i].vicLast}
                                        disabled={isViewMode}
                                        onChange={(e) => {
                                          let value = e.target.value
                                          let newData = [...victimData]
                                          newData[i]["vicLast"] = value
                                          setVictimData(newData)
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor="Firstname"
                                        className="text-[0.7rem] font-semibold text-gray-600"
                                      >
                                        First Name
                                      </Label>
                                      <Input
                                        id="Firstname"
                                        placeholder={isViewMode ? "-" : "First name"}
                                        className="h-8 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                                        value={victimData[i].vicFirst}
                                        disabled={isViewMode}
                                        onChange={(e) => {
                                          let value = e.target.value
                                          let newData = [...victimData]
                                          newData[i]["vicFirst"] = value
                                          setVictimData(newData)
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor="middleName"
                                        className="text-[0.7rem] font-semibold text-gray-600"
                                      >
                                        Middle Name
                                      </Label>
                                      <Input
                                        id="middleName"
                                        placeholder={isViewMode ? "-" : "Middle name"}
                                        className="h-8 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                                        value={victimData[i].vicMiddle}
                                        disabled={isViewMode}
                                        onChange={(e) => {
                                          let value = e.target.value
                                          let newData = [...victimData]
                                          newData[i]["vicMiddle"] = value
                                          setVictimData(newData)
                                        }}
                                      />
                                    </div>
                                    <div className="flex space-x-2">
                                      <div className="flex-1">
                                        <Label
                                          htmlFor="sex"
                                          className="text-[0.7rem] font-semibold text-gray-600"
                                        >
                                          Sex
                                        </Label>
                                        <Select
                                          value={victimData[i].vicSex}
                                          disabled={isViewMode}
                                          onValueChange={(e) => {
                                            let newData = [...victimData]
                                            newData[i]["vicSex"] = e
                                            setVictimData(newData)
                                          }}
                                        >
                                          <SelectTrigger
                                            id="sex"
                                            className="h-8 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom "
                                          >
                                            <SelectValue placeholder="Gender">
                                              <span className={`${victimData[i].vicSex ? "text-xs" : "text-gray-500"}`}>
                                                {isViewMode ? (victimData[i].vicSex || "-") : (victimData[i].vicSex || "Select Type")}
                                              </span></SelectValue>
                                          </SelectTrigger>
                                          <SelectContent className="dark:bg-slate-900 text-xs">
                                            <SelectGroup>
                                            <SelectItem
                                                value=""
                                                className="text-xs"
                                              >
                                                Select Option
                                              </SelectItem>
                                              <SelectItem
                                                value="Male"
                                                className="text-xs"
                                              >
                                                Male
                                              </SelectItem>
                                              <SelectItem
                                                value="Female"
                                                className="text-xs"
                                              >
                                                Female
                                              </SelectItem>
                                              <SelectItem
                                                value="Other"
                                                className="text-xs"
                                              >
                                                Other
                                              </SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex-1">
                                        <Label
                                          htmlFor="age"
                                          className="text-[0.7rem] font-semibold text-gray-600"
                                        >
                                          Age
                                        </Label>
                                        <Input
                                          id="age"
                                          placeholder={isViewMode ? "-" : "Age"}
                                          onKeyDown={(event) =>
                                            keyDownLengthValidation(event, 3)
                                          }
                                          type="text"
                                          disabled={isViewMode}
                                          value={victimData[i]["vicAge"]}
                                          onChange={(e) => {
                                            let value = e.target.value
                                            let newData = [...victimData]
                                            newData[i]["vicAge"] = Number(value)
                                            setVictimData(newData)
                                          }}
                                          className="h-8 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                                        />
                                      </div>
                                    </div>
                                    <div className="">
                                      <Label className="text-[0.7rem] font-semibold text-gray-600">
                                        Relationship
                                      </Label>
                                      <Select
                                        value={victimData[i].vicRelationship}
                                        onValueChange={(e) => {
                                          let newData = [...victimData]
                                          newData[i]["vicRelationship"] = e
                                          setVictimData(newData)
                                        }}
                                      >
                                        <SelectTrigger
                                          className="h-8 w-full md:w-[228px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom"
                                          disabled={isViewMode}
                                        >
                                          <SelectValue placeholder={isViewMode ? "-" : "Select Type"} className="text-xs text-gray-500">
                                          <span className={`${victimData[i].vicRelationship ? "text-xs" : "text-gray-500"}`}>
                                              {isViewMode ? (victimData[i].vicRelationship || "-") : (victimData[i].vicRelationship || "Select Type")}
                                            </span>
                                          </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className="h-[150px] dark:bg-slate-900">
                                          <SelectGroup>
                                            <SelectItem
                                              value=""
                                              className="text-xs"
                                            >
                                              Select Option
                                            </SelectItem>
                                            {relationshipList?.map(
                                              (map_ele: any, i: any) => (
                                                <SelectItem
                                                  value={map_ele?.codeCode}
                                                  key={i}
                                                  className="text-xs"
                                                >
                                                  {map_ele?.codeCode}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="">
                                      <Label
                                        htmlFor="race"
                                        className="text-[0.7rem] font-semibold text-gray-600"
                                      >
                                        Race
                                      </Label>
                                      <Select
                                        value={victimData[i]["vicRace"]}
                                        onValueChange={(e) => {
                                          let newData = [...victimData]
                                          newData[i]["vicRace"] = e
                                          setVictimData(newData)
                                        }}
                                      >
                                        <SelectTrigger
                                          id="crime-types"
                                          className="h-8 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom"
                                          disabled={isViewMode}
                                        >
                                          <SelectValue placeholder={isViewMode ? "-" : "Select Type"}>
                                            <span className={`${victimData[i]["vicRace"] ? "text-xs" : "text-gray-500"}`}>
                                              {isViewMode ? (victimData[i]["vicRace"] || "-") : (victimData[i]["vicRace"] || "Select Type")}
                                            </span>
                                          </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className="text-xs dark:bg-slate-900">
                                          <SelectGroup>
                                            <SelectItem value="" 
                                            className="text-xs">Select Type</SelectItem>
                                            {raceTypeList &&
                                              raceTypeList?.map(
                                                (map_ele: any, i: any) => (
                                                  <SelectItem
                                                    value={map_ele?.codeCode}
                                                    key={i}
                                                    className="text-xs"
                                                  >
                                                    {map_ele?.codeCode}
                                                  </SelectItem>
                                                )
                                              )}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                          })}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="co-denfendant">
                    <div className="thin-scrollbar h-[calc(100vh-14rem)] overflow-y-auto px-2">
                      <div className="grid grid-cols-2 gap-2 mx-2">
                        <div className="flex justify-between ">
                          <Label className="text-[0.7rem] font-semibold text-gray-600">Co-defendant</Label>
                        </div>
                        <div className="col-span-2 w-full md:w-1/2">
                          <CoDefendantCombobox
                            handleChange={getCoDefendant}
                            EditData={props?.rowdata?.id ? coDefendantData : []}
                            viewMode={isViewMode}
                            placholderName={isViewMode ? "-" : "Link Co-defendant"}
                            disabled={isViewMode}
                          />
                        </div>
                      </div>
                      <div className="my-2 flex justify-between mx-2">
                        <Label className="text-sm font-bold">
                          Non-Program Co-defendants
                        </Label>
                        <Icons.add
                          className="h-4 w-4"
                          hidden={isViewMode}
                          onClick={() => {
                            let addNonProgDef = [
                              ...nonProgDefData,
                              {
                                npdLast: "",
                                npdFirst: "",
                                npdMiddle: "",
                                npdNotes: "",
                              },
                            ]
                            setNonProgDefData(addNonProgDef)
                          }}
                        />
                      </div>

                      <div>
                        {nonProgDefData &&
                          nonProgDefData?.map((map_progdef: any, i: any) => {
                            if (
                              nonProgDefData[i] &&
                              typeof nonProgDefData[i] === "object"
                            ) {
                              return (
                                <div key={i} className="border border-dashed p-2">
                                  <Icons.close
                                    hidden={isViewMode}
                                    onClick={() => {
                                      let deleteData: any = JSON.parse(
                                        JSON.stringify(nonProgDefData)
                                      )
                                      if (deleteData[i]) {
                                        let deleteItem: any = JSON.parse(
                                          JSON.stringify(deleteData[i])
                                        )
                                        setNonProgDefDeleteData([
                                          ...nonProgDefDeleteData,
                                          deleteItem,
                                        ])
                                      }
                                      delete deleteData[i]
                                      setNonProgDefData(deleteData)
                                    }}
                                    className="float-right h-4 w-4"
                                  />

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <div className="">
                                      <Label
                                        htmlFor="lastname"
                                        className="text-[0.7rem] font-semibold text-gray-600"
                                      >
                                        Last Name
                                      </Label>
                                      <Input
                                        id="lastname"
                                        placeholder={isViewMode ? "-" : "Last name"}
                                        className="h-8 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                                        disabled={isViewMode}
                                        value={nonProgDefData[i]["npdLast"]}
                                        onChange={(e) => {
                                          let value = e.target.value
                                          let newData = [...nonProgDefData]
                                          newData[i]["npdLast"] = value
                                          setNonProgDefData(newData)
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor="Firstname"
                                        className="text-[0.7rem] font-semibold text-gray-600"
                                      >
                                        First Name
                                      </Label>
                                      <Input
                                        type="text"
                                        id="Firstname"
                                        placeholder={isViewMode ? "-" : "First name"}
                                        className="h-8 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                                        disabled={isViewMode}
                                        value={nonProgDefData[i]["npdFirst"]}
                                        onChange={(e) => {
                                          let value = e.target.value
                                          let newData = [...nonProgDefData]
                                          newData[i]["npdFirst"] = value
                                          setNonProgDefData(newData)
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor="middleName"
                                        className="text-[0.7rem] font-semibold text-gray-600"
                                      >
                                        Middle Name
                                      </Label>
                                      <Input
                                        id="middleName"
                                        placeholder={isViewMode ? "-" : "Middle name"}
                                        className="h-8 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                                        disabled={isViewMode}
                                        value={nonProgDefData[i]["npdMiddle"]}
                                        onChange={(e) => {
                                          let value = e.target.value
                                          let newData = [...nonProgDefData]
                                          newData[i]["npdMiddle"] = value
                                          setNonProgDefData(newData)
                                        }}
                                      />
                                    </div>
                                    <div className="col-span-1 md:col-span-3">
                                      <Label
                                        htmlFor="notes"
                                        className="text-[0.7rem] font-semibold text-gray-600"
                                      >
                                        Notes
                                      </Label>
                                      <Textarea
                                        id="notes"
                                        placeholder={isViewMode ? "-" : "Type Here..."}
                                        className="h-20 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none"
                                        disabled={isViewMode}
                                        value={nonProgDefData[i]["npdNotes"]}
                                        onChange={(e) => {
                                          let value = e.target.value
                                          let newData = [...nonProgDefData]
                                          newData[i]["npdNotes"] = value
                                          setNonProgDefData(newData)
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                          })}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              {isAddMode && (
                <div className="border-t flex justify-end p-2">
                  <DialogFooter className="gap-2 mr-7 flex-row">
                    <DialogClose className="text-black-700 text-xs">
                      Discard
                    </DialogClose>
                    <Button
                      type="submit"
                      variant="outline"
                      className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs"
                    >
                      <Icons.save className="w-4 h-4 mr-0.5" /> Save
                    </Button>
                  </DialogFooter>
                </div>
              )}

              {isViewMode && !userRoles.includes("VIEWER") && (
                <div className="border-t flex justify-end p-2">
                  <DialogFooter className="gap-2 mr-7 flex-row">
                    <DialogClose className="text-black-700 text-xs">
                      Close
                    </DialogClose>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditMode(true)
                        setIsViewMode(false)
                      }}
                      className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs"
                    >
                      <Icons.pencil className="w-4 h-4 mr-0.5" /> Edit
                    </Button>
                  </DialogFooter>
                </div>
              )}

              {isEditMode && (
                <div className="border-t flex justify-end p-2">
                  <DialogFooter className="gap-2 mr-7 flex-row">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsEditMode(false)
                        setIsViewMode(true)
                      }}
                      className="text-black-700 text-xs pb-3.5 px-3 hover:bg-transparent"
                    >
                      Discard
                    </Button>
                    <Button
                      type="submit"
                      variant="outline"
                      className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs"
                    >
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
}
