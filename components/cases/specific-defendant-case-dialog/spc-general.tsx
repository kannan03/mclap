"use client"

import * as React from "react"
import { Label } from "@radix-ui/react-label"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { Icons } from "@/components/icons"

import "react-calendar/dist/Calendar.css"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import moment from "moment"
import { getSession } from "next-auth/react"
import Calendar from "react-calendar"
import { Form, useForm } from "react-hook-form"
import * as z from "zod"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { convertToUTCDate } from "@/lib/utils"
import { GeneralCaseSchema } from "@/lib/validations/spc-general"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { AddressSelect } from "@/components/utils/states-cities-combobox"

import { toast } from "../../../components/ui/use-toast"
import { MultipleCombobox } from "../multiple-combobox"

type FormData = z.infer<typeof GeneralCaseSchema>

export default function GeneralCaseDialog(props: any) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(GeneralCaseSchema),
  })

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const [dateIsOpen, setDateIsOpen] = React.useState(false)
  const [date, setDate] = React.useState<any>(null)
  const [conactTypeList, setContactTypeList] = React.useState<any>([])

  const [generalData, setGeneralData] = React.useState({
    linkStatus: "",
    linkDateOpened: "",
    linkDateClosed: "",
    linkDateInvestigationOpened: "",
    linkDateInvestigationClosed: "",
    linkArrestDate: "",
    linkArrestPlace: "",
    linkTrial: "",
    linkProceduralStatus: "",
    linkDeathPenSought: "",
    linkDeathNoticed: "",
    linkDateDeathNoticed: "",
    linkPleaBargain: "",
    linkPleaBargainTermsOffered: "",
    linkPleaBargainRefused: "",
    linkPleaBargainAccepted: "",
  })

  const [mitigationData, setMitigationData] = React.useState<any>(null)
  const [mitigationDeleteData, setMitigationDeleteData] = React.useState<any>(
    []
  )
  const [mitigationTypeList, setMitigationTypeList] = React.useState<any>([])
  const [aggravFactors, setAggravFactors] = React.useState<any>([])
  const [aggravFactorTypeList, setAggravFactorTypeList] = React.useState<any>(
    []
  )
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [isViewMode, setIsViewMode] = React.useState<any>(false)

  const setChargedStateValue = (value: any) => {
    setLinkState(value)
    setLinkCounty("")
    const ChargedStateValue = value === "Select State" ? "" : String(value)
    setValue("linkState", linkState)
    setValue("linkCounty", "")
  }

  const setChargedCountyValue = (value: any) => {
    setLinkCounty(value)
    // const ChargedCountyValue = value === "Select County" ? "" : String(value)
    setValue("linkCounty", linkCounty)
  }
  const handleChangeMitigation = (val: any) => {
    // setMitigationData(val)
  }
  const handleChangeFactor = (val: any) => {
    setAggravFactors(val)
  }

  const [linkStatus, setLinkStatus] = React.useState<any>("")
  const [linkDateOpened, setLinkDateOpened] = React.useState<any>(null)
  const [linkDateClosed, setLinkDateClosed] = React.useState<any>(null)
  const [linkDateInvestigationOpened, setLinkDateInvestigationOpened] =
    React.useState<any>(null)
  const [linkDateInvestigationClosed, setLinkDateInvestigationClosed] =
    React.useState<any>(null)
  const [linkArrestDate, setLinkArrestDate] = React.useState<any>(null)
  const [linkArrestPlace, setLinkArrestPlace] = React.useState<any>("")
  const [linkTrial, setLinkTrial] = React.useState<any>("")
  const [linkProceduralStatus, setLinkProceduralStatus] =
    React.useState<any>("")
  const [linkDeathPenSought, setLinkDeathPenSought] = React.useState<any>("")
  const [linkDeathNoticed, setLinkDeathNoticed] = React.useState<any>("")
  const [linkDateDeathNoticed, setLinkDateDeathNoticed] =
    React.useState<any>(null)
  const [linkPleaBargain, setLinkPleaBargain] = React.useState<any>("")
  const [linkPleaBargainAccepted, setLinkPleaBargainAccepted] =
    React.useState<any>("")
  const [linkPleaBargainTermsOffered, setLinkPleaBargainTermsOffered] =
    React.useState<any>("")
  const [linkPleaBargainRefused, setLinkPleaBargainRefused] =
    React.useState<any>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [linkState, setLinkState] = React.useState<any>("")
  const [linkCounty, setLinkCounty] = React.useState<any>("")
  const [linkCustody, setLinkCustody] = React.useState<any>(false)

  const [caseStatusTypeList, setCaseStatusTypeList] = React.useState([])
  const [courtTypeList, setCourtTypeList] = React.useState<any>([])
  const [proceduralStatusIsOpen, setProceduralStatusIsOpen] =
    React.useState(false)
  const fetchData = async () => {
    const response = await axiosInstance.get(
      `${baseURL}/v1/defendants/caseDefLink/${props?.defId}/${props?.caseId}`
    )
    setIsLoading(false)
    if (response?.data?.data && response?.data?.data?.id) {
      setGeneralData(response?.data?.data)
      let general = response?.data?.data
      if (general?.linkStatus) {
        setValue("linkStatus", general?.linkStatus, { shouldValidate: true })
        setLinkStatus(general?.linkStatus)
      }
      if (
        general?.linkDateOpened &&
        moment(general?.linkDateOpened).isValid()
      ) {
        setValue("linkDateOpened", convertToUTCDate(general?.linkDateOpened), {
          shouldValidate: true,
        })
        setLinkDateOpened(convertToUTCDate(general?.linkDateOpened))
      }
      if (
        general?.linkDateClosed &&
        moment(general?.linkDateClosed).isValid()
      ) {
        setValue("linkDateClosed", convertToUTCDate(general?.linkDateClosed), {
          shouldValidate: true,
        })
        setLinkDateClosed(convertToUTCDate(general?.linkDateClosed))
      }

      if (
        general?.linkDateInvestigationOpened &&
        moment(general?.linkDateInvestigationOpened).isValid()
      ) {
        setLinkDateInvestigationOpened(
          convertToUTCDate(general?.linkDateInvestigationOpened)
        )
        setValue(
          "linkDateInvestigationOpened",
          convertToUTCDate(general?.linkDateInvestigationOpened),
          { shouldValidate: true }
        )
      }
      if (
        general?.linkDateInvestigationClosed &&
        moment(general?.linkDateInvestigationClosed).isValid()
      ) {
        setLinkDateInvestigationClosed(
          convertToUTCDate(general?.linkDateInvestigationClosed)
        )
        setValue(
          "linkDateInvestigationClosed",
          convertToUTCDate(general?.linkDateInvestigationClosed),
          { shouldValidate: true }
        )
      }

      if (
        general?.linkArrestDate &&
        moment(general?.linkArrestDate).isValid()
      ) {
        setLinkArrestDate(convertToUTCDate(general?.linkArrestDate))
        setValue("linkArrestDate", convertToUTCDate(general?.linkArrestDate), {
          shouldValidate: true,
        })
      }

      if (
        general?.linkDateDeathNoticed &&
        moment(general?.linkDateDeathNoticed).isValid()
      ) {
        setLinkDateDeathNoticed(convertToUTCDate(general?.linkDateDeathNoticed))
        setValue(
          "linkDateDeathNoticed",
          convertToUTCDate(general?.linkDateDeathNoticed),
          { shouldValidate: true }
        )
      }
      if (general?.linkArrestPlace) {
        setLinkArrestPlace(general?.linkArrestPlace)
        setValue("linkArrestPlace", general?.linkArrestPlace, {
          shouldValidate: true,
        })
      }
      if (general?.linkProceduralStatus) {
        setValue("linkProceduralStatus", general?.linkProceduralStatus, {
          shouldValidate: true,
        })
        setLinkProceduralStatus(general?.linkProceduralStatus)
      }
      if (general?.linkDeathPenSought) {
        setValue("linkDeathPenSought", general?.linkDeathPenSought, {
          shouldValidate: true,
        })
        setLinkDeathPenSought(general?.linkDeathPenSought)
      }
      if (general?.linkDeathNoticed) {
        setValue("linkDeathNoticed", general?.linkDeathNoticed, {
          shouldValidate: true,
        })
        setLinkDeathNoticed(general?.linkDeathNoticed)
      }
      if (general?.linkPleaBargain) {
        setValue("linkPleaBargain", general?.linkPleaBargain, {
          shouldValidate: true,
        })
        setLinkPleaBargain(general?.linkPleaBargain)
      }
      if (general?.linkTrial) {
        setLinkTrial(general?.linkTrial)
        setValue("linkTrial", general?.linkTrial, { shouldValidate: true })
      }

      if (general?.linkPleaBargainTermsOffered) {
        setValue(
          "linkPleaBargainTermsOffered",
          general?.linkPleaBargainTermsOffered,
          { shouldValidate: true }
        )
        setLinkPleaBargainTermsOffered(general?.linkPleaBargainTermsOffered)
      }
      if (general?.linkPleaBargainAccepted) {
        setValue("linkPleaBargainAccepted", general?.linkPleaBargainAccepted, {
          shouldValidate: true,
        })
        setLinkPleaBargainAccepted(general?.linkPleaBargainAccepted)
      }
      if (general?.linkPleaBargainRefused) {
        setValue("linkPleaBargainRefused", general?.linkPleaBargainRefused)
        setLinkPleaBargainRefused(general?.linkPleaBargainRefused)
      }

      if (general?.linkState) {
        setValue("linkState", general?.linkState)
        setLinkState(general?.linkState)
      }
      if (general?.linkCounty) {
        setValue("linkState", general?.linkCounty)
        setLinkCounty(general?.linkCounty)
      }
      if (general?.linkCustody) {
        setValue("linkState", general?.linkCustody)
        setLinkCustody(general.linkCustody)
      }
    }

    let status = await axiosInstance.get(
      `${baseURL}/v1/codes/codeType/Case Status`
    )
    if (status?.data?.data) {
      setCaseStatusTypeList(status?.data?.data)
    }
    let courtType = await axiosInstance.get(
      `${baseURL}/v1/codes/codeType/Court Type`
    )
    if (courtType?.data?.data) {
      setCourtTypeList([{ codeCode: "" }, ...courtType?.data?.data])
    }
    let mitigationThemeList = await axiosInstance.get(
      `${baseURL}/v1/codes/codeType/Mitigation Theme`
    )
    if (mitigationThemeList?.data?.data) {
      setMitigationTypeList(mitigationThemeList?.data?.data)
    }
    let factorList = await axiosInstance.get(
      `${baseURL}/v1/codes/codeType/Aggravating Factor`
    )
    if (factorList?.data?.data) {
      setAggravFactorTypeList(factorList?.data?.data)
    }

    let factors = await axiosInstance.get(
      `${baseURL}/v1/codes/aggravfactor/${props?.defId}/${props?.caseId}`
    )
    if (factors?.data?.data) {
      let factorsMap = factors?.data?.data?.map(
        (map_ele: any) => map_ele.afFactor
      )
      setTimeout(() => {
        handleChangeFactor(factorsMap)
      }, 500)
    }
    let mitigation = await axiosInstance.get(
      `${baseURL}/v1/codes/mitigationtheme/${props?.defId}/${props?.caseId}`
    )
    if (mitigation?.data?.data) {
      setMitigationData(mitigation?.data?.data)
    } else {
      [{ mitTheme: "", mitThemeOther: "" }]
    }
  }

  const onSubmit = async (payload: any) => {

    // linkDateOpened & linkDateClosed validation
    if (linkDateOpened && linkDateClosed && moment(linkDateClosed).isBefore(linkDateOpened)) {
      return;
    }
    // linkDateInvestigationOpened && linkDateInvestigationClosed validation
    if (linkDateInvestigationOpened && linkDateInvestigationClosed && moment(linkDateInvestigationClosed).isBefore(linkDateInvestigationOpened)) {
      return;
    }
    // linkDateInvestigationOpened && linkDateOpened validation
    if (linkDateInvestigationOpened && linkDateOpened && moment(linkDateOpened).isBefore(linkDateInvestigationOpened)) {
      return;
    }
    // linkDateInvestigationClosed && linkDateClosed validation
    if (linkDateInvestigationClosed && linkDateClosed && moment(linkDateClosed).isBefore(linkDateInvestigationClosed)) {
      return;
    }

    let payloadData = {
      linkStatus: linkStatus ? linkStatus : null,
      linkDateOpened: linkDateOpened ? linkDateOpened : null,
      linkDateClosed: linkDateClosed ? linkDateClosed : null,
      linkDateInvestigationOpened: linkDateInvestigationOpened
        ? linkDateInvestigationOpened
        : null,
      linkDateInvestigationClosed: linkDateInvestigationClosed
        ? linkDateInvestigationClosed
        : null,
      linkArrestDate: linkArrestDate ? linkArrestDate : null,
      linkArrestPlace: linkArrestPlace ? linkArrestPlace : null,
      linkTrial: linkTrial ? linkTrial : null,
      linkProceduralStatus: linkProceduralStatus ? linkProceduralStatus : null,
      linkDeathPenSought: linkDeathPenSought ? linkDeathPenSought : null,
      linkDeathNoticed: linkDeathNoticed ? linkDeathNoticed : null,
      linkDateDeathNoticed: linkDateDeathNoticed ? linkDateDeathNoticed : null,
      linkPleaBargain: linkPleaBargain ? linkPleaBargain : null,
      linkPleaBargainAccepted: linkPleaBargainAccepted
        ? linkPleaBargainAccepted
        : null,
      linkPleaBargainTermsOffered: linkPleaBargainTermsOffered
        ? linkPleaBargainTermsOffered
        : null,
      linkPleaBargainRefused: linkPleaBargainRefused
        ? linkPleaBargainRefused
        : null,
      linkState: linkState ? linkState : null,
      linkCounty: linkCounty ? linkCounty : null,
      linkCustody: linkCustody ? linkCustody : null,
      mitigation: mitigationData,
      mitigationDelete: mitigationDeleteData,
      factor: aggravFactors,
    }

    try {
      const res = await axiosInstance.patch(
        `${baseURL}/v1/defendants/caseDefLink/${props?.defId}/${props?.caseId}`,
        payloadData
      )
      if (res?.status === 500 || res?.status === 400) {
        toast({
          variant: "default",
          description: "General details updated failed",
          style: {
            background: "red",
          },
        })
      } else {
        toast({
          variant: "default",
          description: "General details updated successfully",
          style: {
            background: "#03C03C",
          },
        })
      }
    } catch (error: any) { }
  }

  React.useEffect(() => {
    const fetchUserRoles = async () => {
      const session = await getSession()
      setUserRoles(session?.user?.roles || [])
    }

    fetchUserRoles()
    fetchData()
  }, [])
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isLoading && (
          <div className="h-[calc(100vh-19rem)]">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20">
              <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-red-700" />
            </div>
          </div>
        )}
        {!isLoading && (
          <>
            <div className="thin-scrollbar mx-1 h-[calc(100vh-19rem)] overflow-y-auto p-2">
              <div className="mx-2 mb-2 flex flex-col md:flex-row gap-2">
                <div className="">
                  <Label
                    htmlFor="CaseStatus"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Case Status
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={linkStatus}
                    onValueChange={(e) => {
                      // setGeneralData({ ...generalData, linkStatus : e});
                      setLinkStatus(e)
                      setValue("linkStatus", String(e), {
                        shouldValidate: true,
                      })
                    }}
                  >
                    <SelectTrigger
                      id="sex"
                      className="select-custom h-8 w-full md:w-[408px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                      disabled={userRoles.includes("VIEWER")}
                    >
                      <SelectValue
                        placeholder="Select Type"
                        className="text-xs"
                      >
                        {linkStatus
                          ? linkStatus
                          : userRoles.includes("VIEWER")
                            ? "-"
                            : "Select Type"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="h-64 text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="" className="text-xs">
                          Select Type
                        </SelectItem>
                        {caseStatusTypeList &&
                          caseStatusTypeList?.map((map_ele: any, i: any) => (
                            <SelectItem
                              value={String(map_ele?.codeCode)}
                              key={i}
                              className="text-xs"
                            >
                              {map_ele?.codeCode}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {isSubmitted && errors.linkStatus?.message && (
                    <small className="text-red-500">
                      {isSubmitted && errors.linkStatus.message}
                    </small>
                  )}
                </div>
                <div className="">
                  <Label
                    htmlFor="fileOpened"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Case Opened <span className="text-red-500"> </span>
                  </Label>
                  <div className="w-full md:w-[200px]">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full md:w-[200px] justify-between text-left text-xs font-normal disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100",
                            !linkDateOpened && "text-muted-foreground"
                          )}
                          disabled={userRoles.includes("VIEWER")}
                        >
                          {linkDateOpened &&
                            moment(linkDateOpened).isValid() ? (
                            <>
                              <div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {convertToUTCDate(linkDateOpened)}</div>
                              <div className="ml-10">
                                <Icons.close className="h-4 w-4"
                                  onClick={() => setLinkDateOpened(null)} />
                              </div>
                            </>
                          ) : userRoles.includes("VIEWER") ? (
                            "-"
                          ) : (
                            <div className="flex">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span>Pick a date</span>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        id="crime-date"
                        className="thin-scrollbar max-h-50 m-1 w-[230px] overflow-y-auto p-0 text-xs text-black"
                      >
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e)
                            let day = dateObj.getDate()
                            let month = dateObj.getMonth() + 1
                            let year = dateObj.getFullYear()
                            let dateStr = `${month}/${day}/${year}`
                            setValue("linkDateOpened", String(dateStr), {
                              shouldValidate: true,
                            })
                            setLinkDateOpened(dateStr)
                          }}
                          value={linkDateOpened}
                        />
                      </PopoverContent>
                    </Popover>

                    <br />
                    {
                      linkDateOpened && linkDateClosed &&
                      moment(linkDateClosed).isBefore(linkDateOpened) && (
                        <small className="text-red-500 text-xs">
                          case open should be less than case closed
                        </small>
                      )}
                  </div>
                </div>
                <div className="">
                  <Label
                    htmlFor="fileClosed"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Case Closed <span className="text-red-500"> </span>
                  </Label>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full md:w-[200px] justify-between text-left text-xs font-normal disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100",
                            !linkDateClosed && "text-muted-foreground"
                          )}
                          disabled={userRoles.includes("VIEWER")}
                        >
                          {linkDateClosed &&
                            moment(linkDateClosed).isValid() ? (
                            <>
                              <div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {convertToUTCDate(linkDateClosed)}
                              </div>
                              <div className="ml-10">
                                <Icons.close className="h-4 w-4"
                                  onClick={() => setLinkDateClosed(null)} />
                              </div>
                            </>
                          ) : userRoles.includes("VIEWER") ? (
                            "-"
                          ) : (
                            <div className="flex">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span>Pick a date</span>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        id="crime-date"
                        className="thin-scrollbar max-h-50 m-1 w-[230px] overflow-y-auto p-0 text-xs text-black"
                      >
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e)
                            let day = dateObj.getDate()
                            let month = dateObj.getMonth() + 1
                            let year = dateObj.getFullYear()
                            let dateStr = `${month}/${day}/${year}`
                            setLinkDateClosed(dateStr)
                            setValue("linkDateClosed", String(dateStr), {
                              shouldValidate: true,
                            })
                          }}
                          value={linkDateClosed}
                        />
                      </PopoverContent>
                    </Popover>
                    <br />
                    {/* {
                       linkDateInvestigationClosed && linkDateClosed &&
                       moment(linkDateClosed).isBefore(linkDateInvestigationClosed) && (
                        <small className="text-red-500">
                          case open should be less than case closed
                        </small>
                    )} */}

                  </div>
                </div>
              </div>
              <div className="mx-2 mb-2 flex flex-col md:flex-row gap-2">
                <div className="">
                  <Label
                    htmlFor="investigationOpened"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Investigation Opened <span className="text-red-500"> </span>
                  </Label>
                  <div className="w-full md:w-[200px]">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full md:w-[200px] justify-between text-left text-xs font-normal disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100",
                            !linkDateInvestigationOpened &&
                            "text-muted-foreground"
                          )}
                          disabled={userRoles.includes("VIEWER")}
                        >
                          {linkDateInvestigationOpened &&
                            moment(linkDateInvestigationOpened).isValid() ? (
                            <>
                              <div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {convertToUTCDate(linkDateInvestigationOpened)}
                              </div>
                              <div className="ml-10">
                                <Icons.close className="h-4 w-4"
                                  onClick={() => setLinkDateInvestigationOpened(null)} />
                              </div>
                            </>
                          ) : userRoles.includes("VIEWER") ? (
                            "-"
                          ) : (
                            <div className="flex">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span>Pick a date</span>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        id="crime-date"
                        className="thin-scrollbar max-h-50 m-1 w-[230px] overflow-y-auto p-0 text-xs text-black"
                      >
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e)
                            let day = dateObj.getDate()
                            let month = dateObj.getMonth() + 1
                            let year = dateObj.getFullYear()
                            let dateStr = `${month}/${day}/${year}`
                            setValue(
                              "linkDateInvestigationOpened",
                              String(dateStr),
                              { shouldValidate: true }
                            )
                            setLinkDateInvestigationOpened(dateStr)
                          }}
                          value={linkDateInvestigationOpened}
                        />
                      </PopoverContent>
                    </Popover>
                    <br />
                    {
                      linkDateInvestigationOpened && linkDateInvestigationClosed &&
                      moment(linkDateInvestigationClosed).isBefore(linkDateInvestigationOpened) && (
                        <small className="text-red-500 text-xs">
                          Investigation open should be less than case open
                        </small>
                      )}
                  </div>
                </div>
                <div className="">
                  <Label
                    htmlFor="investigationClosed"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Investigation Closed <span className="text-red-500"> </span>
                  </Label>
                  <div className="w-full md:w-[200px]">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full md:w-[200px] justify-between text-left text-xs font-normal disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100",
                            !linkDateInvestigationClosed &&
                            "text-muted-foreground"
                          )}
                          disabled={userRoles.includes("VIEWER")}
                        >
                          {linkDateInvestigationClosed &&
                            moment(linkDateInvestigationClosed).isValid() ? (
                            <>
                              <div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {convertToUTCDate(linkDateInvestigationClosed)}
                              </div>
                              <div className="ml-10">
                                <Icons.close className="h-4 w-4"
                                  onClick={() => setLinkDateInvestigationClosed(null)} />
                              </div>
                            </>
                          ) : userRoles.includes("VIEWER") ? (
                            "-"
                          ) : (
                            <div className="flex">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span>Pick a date</span>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        id="crime-date"
                        className="thin-scrollbar max-h-50 m-1 w-[230px] overflow-y-auto p-0 text-xs text-black"
                      >
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e)
                            let day = dateObj.getDate()
                            let month = dateObj.getMonth() + 1
                            let year = dateObj.getFullYear()
                            let dateStr = `${month}/${day}/${year}`
                            setValue(
                              "linkDateInvestigationClosed",
                              String(dateStr),
                              { shouldValidate: true }
                            )
                            setLinkDateInvestigationClosed(dateStr)
                          }}
                          value={linkDateInvestigationClosed}
                        />
                      </PopoverContent>
                    </Popover>
                    <br />
                    {
                      linkDateInvestigationClosed && linkDateClosed &&
                      moment(linkDateClosed).isBefore(linkDateInvestigationClosed) && (
                        <small className="text-red-500 text-xs">
                          Investigation closed should be less than case closed
                        </small>
                      )}

                  </div>
                </div>
                <div className="">
                  <Label
                    htmlFor="dateofArrest"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Date of Arrest<span className="text-red-500"> </span>
                  </Label>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full md:w-[200px] justify-between text-left text-xs font-normal disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100",
                            !linkArrestDate && "text-muted-foreground"
                          )}
                          disabled={userRoles.includes("VIEWER")}
                        >
                          {linkArrestDate &&
                            moment(linkArrestDate).isValid() ? (
                            <>
                              <div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {convertToUTCDate(linkArrestDate)}
                              </div>
                              <div className="ml-10">
                                <Icons.close className="h-4 w-4"
                                  onClick={() => setLinkArrestDate(null)} />
                              </div>
                            </>
                          ) : userRoles.includes("VIEWER") ? (
                            "-"
                          ) : (
                            <div className="flex">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span>Pick a date</span>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        id="crime-date"
                        className="thin-scrollbar max-h-50 m-1 w-[230px] overflow-y-auto p-0 text-xs text-black"
                      >
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e)
                            let day = dateObj.getDate()
                            let month = dateObj.getMonth() + 1
                            let year = dateObj.getFullYear()
                            let dateStr = `${month}/${day}/${year}`
                            setLinkArrestDate(dateStr)
                            setValue("linkArrestDate", String(dateStr), {
                              shouldValidate: true,
                            })
                          }}
                          value={linkArrestDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="">
                  <Label
                    htmlFor="placeofArrest"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Place of Arrest <span className="text-red-500"> </span>
                  </Label>
                  <div>
                    {/* <Select
                         value={linkArrestPlace}
                         onValueChange={(e)=>{
                            setGeneralData({ ...generalData, linkArrestPlace : e});
                            setValue("data",{ ...generalData, linkArrestPlace : e})

                         }}
                        >
                            <SelectTrigger id="placeofArrest" className="h-8 w-full">
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select> */}

                    <Input
                      type="text"
                      id="placeofArrest"
                      className="w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                      value={linkArrestPlace}
                      disabled={userRoles.includes("VIEWER")}
                      placeholder={
                        userRoles.includes("VIEWER") ? "-" : "Place of arrest"
                      }
                      onChange={(e) => {
                        setLinkArrestPlace(e.target.value)
                        setValue("linkArrestPlace", e.target.value, {
                          shouldValidate: true,
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mx-2 mb-2 flex flex-col md:flex-row gap-2">
                <div className="my-2">
                  <div>
                    <h4 className="my-1 text-[0.7rem] font-semibold text-gray-600">
                      Place of Arrest - State
                    </h4>{" "}
                  </div>
                  <div>
                    <AddressSelect
                      country={"USA"}
                      category={"usStatesAndCities"}
                      placeholdername={
                        userRoles.includes("VIEWER") ? "-" : "Select state"
                      }
                      defultselect={linkState}
                      disabled={userRoles.includes("VIEWER")}
                      selectedValue={setChargedStateValue}
                      wPage={200}
                      className={
                        userRoles.includes("VIEWER")
                          ? "select-custom disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                          : "w-full md:w-[200px]"
                      }
                    />
                  </div>
                </div>

                <div className="my-2">
                  <h4 className="my-1 text-[0.7rem] font-semibold text-gray-600">
                    Place of Arrest - County
                  </h4>
                  <AddressSelect
                    category={"county"}
                    placeholdername={
                      userRoles.includes("VIEWER") ? "-" : "Select County"
                    }
                    state={linkState}
                    defultselect={linkCounty}
                    disabled={userRoles.includes("VIEWER")}
                    selectedValue={setChargedCountyValue}
                    wPage={200}
                    className={
                      userRoles.includes("VIEWER")
                        ? "select-custom disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                        : "w-full md:w-[200px]"
                    }
                  />
                </div>
                <div className="flex items-center pt-5">
                  <Checkbox
                    checked={linkCustody}
                    onCheckedChange={(e: any) => {
                      setLinkCustody(e)
                      setValue("linkCustody", e)
                    }}
                    disabled={userRoles.includes("VIEWER")}
                    className="border-slate-600 disabled:cursor-text disabled:p-0 disabled:opacity-100"
                  />
                  <Label className="px-1 text-center text-xs">
                    Already in custody
                  </Label>
                </div>
              </div>
              <div className="mx-2 mb-2 flex flex-col md:flex-row gap-2">
                <div className="">
                  <Label
                    htmlFor="linkTrial"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Trial?
                    <span className="text-red-500"> </span>
                  </Label>
                  <Select
                    value={linkTrial}
                    onValueChange={(e) => {
                      setLinkTrial(e)
                      setValue("linkTrial", String(e), { shouldValidate: true })
                    }}
                  >
                    <SelectTrigger
                      id="linkTrial"
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                      disabled={userRoles.includes("VIEWER")}
                    >
                      <SelectValue placeholder="UnKnown" className="text-xs">
                        {linkTrial
                          ? linkTrial
                          : userRoles.includes("VIEWER")
                            ? "-"
                            : "Select Type"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="" className="text-xs">Select Option</SelectItem>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="UnKnown" className="text-xs">
                          UnKnown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="">
                  <Label
                    htmlFor="procedural-status"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Procedural Status?<span className="text-red-500"> </span>
                  </Label>
                  <div>
                    <Popover
                      open={proceduralStatusIsOpen}
                      onOpenChange={setProceduralStatusIsOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={proceduralStatusIsOpen}
                          disabled={userRoles.includes("VIEWER")}
                          className="select-custom h-8 w-full md:w-[408px] justify-between text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                        >
                          {linkProceduralStatus
                            ? linkProceduralStatus
                            : userRoles.includes("VIEWER")
                              ? "-"
                              : "Select Type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command className="text-xs dark:bg-slate-900">
                          <CommandInput
                            placeholder="Select Assign"
                            className="h-8 text-xs"
                          />
                          <CommandEmpty>No Found </CommandEmpty>
                          <CommandGroup className="thin-scrollbar h-[150px] overflow-y-scroll text-xs dark:bg-slate-900">
                            {courtTypeList.map((framework: any) => {
                              return (
                                <CommandItem
                                  key={framework.codeCode}
                                  value={framework}
                                  className="whitespace-nowrap text-xs"
                                  onSelect={(currentValue) => {
                                    setLinkProceduralStatus(framework.codeCode)
                                    setValue(
                                      "linkProceduralStatus",
                                      String(framework.codeCode),
                                      { shouldValidate: true }
                                    )
                                    setProceduralStatusIsOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      linkProceduralStatus == framework.codeCode
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {framework?.codeCode ? framework.codeCode : "Select Type"}
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div></div>
                  </div>
                </div>

                <div className="">
                  <Label
                    htmlFor="deathPenaltySoughtAtTrial"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Death Penalty Sought at trial?{" "}
                    <span className="text-red-500"> </span>
                  </Label>
                  <div>
                    <Select
                      value={linkDeathPenSought}
                      onValueChange={(e) => {
                        setLinkDeathPenSought(e)
                        setValue("linkDeathPenSought", String(e), {
                          shouldValidate: true,
                        })
                      }}
                    >
                      <SelectTrigger
                        id="deathPenaltySoughtAtTrial"
                        className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                        disabled={userRoles.includes("VIEWER")}
                      >
                        <SelectValue placeholder="NA" className="text-xs">
                          {linkDeathPenSought
                            ? linkDeathPenSought
                            : userRoles.includes("VIEWER")
                              ? "-"
                              : "Select Type"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="text-xs dark:bg-slate-900">
                        <SelectGroup>
                          <SelectItem value="" className="text-xs">Select Option</SelectItem>
                          <SelectItem value="NA" className="text-xs">
                            NA
                          </SelectItem>
                          <SelectItem value="Yes" className="text-xs">
                            Yes
                          </SelectItem>
                          <SelectItem value="No" className="text-xs">
                            No
                          </SelectItem>
                          <SelectItem value="UnKnown" className="text-xs">
                            UnKnown
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="mx-2 mb-2 flex flex-col md:flex-row gap-2">
                <div className="">
                  <Label
                    htmlFor="deathNoticed"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Death Noticed?<span className="text-red-500"> </span>
                  </Label>
                  <div>
                    <Select
                      value={linkDeathNoticed}
                      onValueChange={(e) => {
                        setLinkDeathNoticed(e)
                        setValue("linkDeathNoticed", String(e), {
                          shouldValidate: true,
                        })
                      }}
                    >
                      <SelectTrigger
                        id="deathNoticed"
                        className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                        disabled={userRoles.includes("VIEWER")}
                      >
                        <SelectValue placeholder="UnKnown" className="text-xs">
                          {linkDeathNoticed
                            ? linkDeathNoticed
                            : userRoles.includes("VIEWER")
                              ? "-"
                              : "Select Type"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="text-xs dark:bg-slate-900">
                        <SelectGroup>
                          <SelectItem value="" className="text-xs">
                            Select Option</SelectItem>
                          <SelectItem value="NA" className="text-xs">
                            NA
                          </SelectItem>
                          <SelectItem value="Yes" className="text-xs">
                            Yes
                          </SelectItem>
                          <SelectItem value="No" className="text-xs">
                            No
                          </SelectItem>
                          <SelectItem value="UnKnown" className="text-xs">
                            UnKnown
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="">
                  <Label
                    htmlFor="dateDeathSought?"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Date Death sought? <span className="text-red-500"> </span>
                  </Label>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full md:w-[200px] justify-between text-left text-xs font-normal disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100",
                            !linkDateDeathNoticed && "text-muted-foreground"
                          )}
                          disabled={userRoles.includes("VIEWER")}
                        >
                          {linkDateDeathNoticed &&
                            moment(linkDateDeathNoticed).isValid() ? (
                            <>
                              <div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {convertToUTCDate(linkDateDeathNoticed)}
                              </div>
                              <div className="ml-10">
                                <Icons.close className="h-4 w-4"
                                  onClick={() => setLinkDateDeathNoticed(null)} />
                              </div>
                            </>
                          ) : userRoles.includes("VIEWER") ? (
                            "-"
                          ) : (
                            <div className="flex">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span>Pick a date</span>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        id="crime-date"
                        className="thin-scrollbar max-h-50 m-1 w-full md:w-[230px] overflow-y-auto p-0 text-xs text-black"
                      >
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e)
                            let day = dateObj.getDate()
                            let month = dateObj.getMonth() + 1
                            let year = dateObj.getFullYear()
                            let dateStr = `${month}/${day}/${year}`
                            setLinkDateDeathNoticed(dateStr)
                            setValue("linkDateDeathNoticed", dateStr, {
                              shouldValidate: true,
                            })
                          }}
                          value={linkDateDeathNoticed}
                        />
                      </PopoverContent>
                    </Popover>
                    <br />
                  </div>
                </div>
              </div>

              <div className="mx-2 flex flex-col md:flex-row gap-2">
                {/* <div className="col-span-1">
                    <div>
                        <Label htmlFor="crime-types" className="text-xs">Crime Types</Label>
                        <Select
                            onValueChange={(e) => {
                            }}
                        >
                            <SelectTrigger id="crime-types" className="h-8 w-full"
                            >
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {conactTypeList?.map((map_ele: any, i: any) => (
                                        <SelectItem value={map_ele?.codeCode} key={i}>
                                            {map_ele?.codeCode}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>


                </div> */}
                {/* <div></div> */}
                <div className=" ">
                  <div>
                    <Label
                      htmlFor="Plea-bargain-offered"
                      className="text-[0.7rem] font-semibold text-gray-600"
                    >
                      Plea bargain offered?
                      <span className="text-red-500"> </span>
                    </Label>
                    <Select
                      value={linkPleaBargain}
                      onValueChange={(e) => {
                        setLinkPleaBargain(e)
                        setValue("linkPleaBargain", String(e), {
                          shouldValidate: true,
                        })
                      }}
                    >
                      <SelectTrigger
                        id="Plea-bargain-offered"
                        disabled={userRoles.includes("VIEWER")}
                        className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                      >
                        <SelectValue placeholder="UnKnown" className="text-xs">
                          {linkPleaBargain
                            ? linkPleaBargain
                            : userRoles.includes("VIEWER")
                              ? "-"
                              : "Select Type"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="text-xs dark:bg-slate-900">
                        <SelectGroup>
                          <SelectItem value="" className="text-xs">
                            Select Option</SelectItem>
                          <SelectItem value="NA" className="text-xs">
                            NA
                          </SelectItem>
                          <SelectItem value="Yes" className="text-xs">
                            Yes
                          </SelectItem>
                          <SelectItem value="No" className="text-xs">
                            No
                          </SelectItem>
                          <SelectItem value="UnKnown" className="text-xs">
                            UnKnown
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mb-2 w-full">
                  <Label
                    htmlFor="termsofoffer"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Terms of offer
                  </Label>
                  <Textarea
                    value={linkPleaBargainTermsOffered}
                    onChange={(e) => {
                      setLinkPleaBargainTermsOffered(e.target.value)
                      setValue("linkPleaBargainTermsOffered", e.target.value)
                    }}
                    id="termsofoffer"
                    className="h-5/6 w-full text-xs disabled:cursor-text disabled:resize-none disabled:border-0 disabled:p-0 disabled:opacity-100"
                    placeholder={
                      userRoles.includes("VIEWER") ? "-" : "Type here.."
                    }
                    disabled={userRoles.includes("VIEWER")}
                  // defaultValue={props?.rowdata?.conNotes}
                  // {...register("conNotes")}
                  />
                </div>
              </div>
              <div className="m-2 flex flex-col md:flex-row gap-2">
                <div className=" ">
                  <div>
                    <Label
                      htmlFor="Plea-bargain-accepted"
                      className="text-[0.7rem] font-semibold text-gray-600"
                    >
                      Plea bargain accepted?
                      <span className="text-red-500"> </span>
                    </Label>
                    <Select
                      value={linkPleaBargainAccepted}
                      onValueChange={(e) => {
                        setLinkPleaBargainAccepted(e)
                        setValue("linkPleaBargainAccepted", String(e), {
                          shouldValidate: true,
                        })
                      }}
                    >
                      <SelectTrigger
                        id="Plea-bargain-accepted"
                        disabled={userRoles.includes("VIEWER")}
                        className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                      >
                        <SelectValue placeholder="UnKnown" className="text-xs">
                          {linkPleaBargainAccepted
                            ? linkPleaBargainAccepted
                            : userRoles.includes("VIEWER")
                              ? "-"
                              : "Select Type"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="text-xs dark:bg-slate-900">
                        <SelectGroup>
                          <SelectItem value="" className="text-xs">
                            Select Option</SelectItem>
                          <SelectItem value="NA" className="text-xs">
                            NA
                          </SelectItem>
                          <SelectItem value="Yes" className="text-xs">
                            Yes
                          </SelectItem>
                          <SelectItem value="No" className="text-xs">
                            No
                          </SelectItem>
                          <SelectItem value="UnKnown" className="text-xs">
                            UnKnown
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="termsofoffer"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    If not why?
                  </Label>
                  <Textarea
                    value={linkPleaBargainRefused}
                    onChange={(e) => {
                      setLinkPleaBargainRefused(e.target.value)
                      setValue("linkPleaBargainRefused", e.target.value)
                    }}
                    id="termsofoffer"
                    disabled={userRoles.includes("VIEWER")}
                    className="h-5/6 w-full text-xs disabled:cursor-text disabled:resize-none disabled:border-0 disabled:p-0 disabled:opacity-100"
                    placeholder={
                      userRoles.includes("VIEWER") ? "-" : "Type here.."
                    }
                  />
                </div>
              </div>

              <div className="m-2 grid grid-cols-1 gap-2">
                {/* <div className='mt-2'>
                                                    <div className="w-[300px]">
                                                        <Label  className="text-xs">Mitigation Theme(s)<span className="text-red-500"> </span></Label>
                                                        <CrimeTypeCombobox
                                                            ListData={mitigationTypeList}
                                                            handleChange={handleChangeMitigation}
                                                            placholderName={'Select mitigation'}
                                                            EditData={mitigationData?.length > 0 ? mitigationData : []}
                                                            viewMode={isViewMode}
                                                            disabled={isViewMode}
                                                        />

                                                    </div>

                </div> */}
                <div className="mt-5">
                  <div className="w-full md:w-[480px]">
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      Aggravating Factor(s)
                    </Label>
                    <MultipleCombobox
                      ListData={aggravFactorTypeList}
                      handleChange={handleChangeFactor}
                      placholderName={
                        userRoles.includes("VIEWER") ? "" : "Select factor"
                      }
                      EditData={aggravFactors}
                      viewMode={isViewMode}
                      disabled={userRoles.includes("VIEWER")}
                    />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-2 mt-5'>
                <div className="flex justify-between mr-2">
                  <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600 mx-2">Mitigation Theme(s)<span className="text-red-500"> </span></Label>
                  </div>
                  <div>
                    {!userRoles.includes("VIEWER") && (
                      <Icons.add className="w-4 h-4 cursor-pointer" onClick={() => {
                        let newData = JSON.parse(JSON.stringify([...mitigationData, { mitTheme: "", mitThemeOther: "" }]))
                        setMitigationData(newData);
                      }}
                      />
                    )}
                  </div>
                </div>
                {mitigationData && mitigationData?.length > 0 && mitigationData?.map((pleadings_ele: any, i: any) => {
                  if (mitigationData[i] && typeof mitigationData[i] === "object") {
                    return (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 border border-dashed p-2 ">
                        <div className="col-span-1 md:col-span-3">
                          <div className='flex justify-end'>
                            {!userRoles.includes("VIEWER") && (
                              <Icons.close className="w-4 h-4 cursor-pointer" onClick={() => {
                                let oldData: any = JSON.parse(
                                  JSON.stringify(mitigationData)
                                )
                                if (oldData[i]) {
                                  let deleteItem: any = JSON.parse(JSON.stringify(oldData[i]))
                                  setMitigationDeleteData([...mitigationDeleteData, deleteItem]);
                                  delete oldData[i]
                                  setMitigationData(oldData)
                                }
                              }}
                              />
                            )}
                          </div>
                        </div>
                        <div className=''>
                          <Label htmlFor="mitigation" className="text-[0.7rem] font-semibold text-gray-600">
                            Mitigation
                          </Label>
                          <Select
                            value={mitigationData[i]['mitTheme']}
                            onValueChange={(e) => {
                              let newData = [...mitigationData];
                              newData[i]['mitTheme'] = e;
                              setMitigationData(newData);

                            }}
                          >
                            <SelectTrigger id="pleading" disabled={userRoles.includes("VIEWER")} className="h-8 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                              <SelectValue placeholder="Select Type" className='text-xs'>
                                {mitigationData[i]['mitTheme']
                                  ? mitigationData[i]['mitTheme']
                                  : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className='h-48 overflow-y-auto dark:bg-slate-900'>
                              <SelectGroup>
                                <SelectItem value="" className="text-xs">Select Type</SelectItem>
                                {mitigationTypeList &&
                                  mitigationTypeList?.map(
                                    (map_ele: any, i: any) => (
                                      <SelectItem
                                        value={String(map_ele?.codeCode)}
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
                        <div className='w-full md:w-[590px] mx-0 md:mx-2'>
                          <Label htmlFor="mitThemeOther" className="text-[0.7rem] font-semibold text-gray-600">Notes</Label>
                          <Textarea
                            value={mitigationData[i]['mitThemeOther']}
                            onChange={(e) => {
                              let newData = [...mitigationData];
                              newData[i]['mitThemeOther'] = e.target.value;
                              setMitigationData(newData);
                            }}
                            id="mitThemeOther"
                            className=" text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none"
                            placeholder={userRoles.includes("VIEWER") ? "-" : "Type here.."}
                            disabled={userRoles.includes("VIEWER")}
                          />
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          </>
        )}
        {!userRoles.includes("VIEWER") && (
          <div className="mt-2 flex justify-end border-t p-2">
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
                  className="flex h-8 items-center rounded-lg bg-transparent px-5 py-1 text-xs xl:py-1.5"
                >
                  <Icons.save className="mr-0.5 h-4 w-4" /> Save
                </Button>
              )}
            </DialogFooter>
          </div>
        )}
      </form>
    </div>
  )
}
