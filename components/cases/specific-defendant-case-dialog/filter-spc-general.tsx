'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@radix-ui/react-label"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
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

import { Button } from "@/components/ui/button"
import 'react-calendar/dist/Calendar.css';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import Calendar from 'react-calendar';
import moment from "moment"
import { convertToUTCDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from '@/components/ui/textarea'
import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from 'next/navigation'
import { Form, useForm } from "react-hook-form"
import * as z from "zod"
import { GeneralCaseSchema } from "@/lib/validations/spc-general"
type FormData = z.infer<typeof GeneralCaseSchema>
import { toast } from "../../../components/ui/use-toast"
import { AddressSelect } from "@/components/utils/states-cities-combobox"
import { getSession } from "next-auth/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { useContext } from 'react';
import { CaseFilterContext } from "@/context/caseFilterContext"
import { MultipleCombobox } from '../multiple-combobox'
export default function FilterGeneralCaseDialog(props: any) {

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(GeneralCaseSchema)
  })

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const [dateIsOpen, setDateIsOpen] = React.useState(false)
  const [date, setDate] = React.useState<any>(null)
  const [conactTypeList, setContactTypeList] = React.useState<any>([])
  const appliedCaseFilters = useContext<any>(CaseFilterContext);
  const [generalData, setGeneralData] = React.useState(
    {
      linkStatus: "", linkDateOpened: "",
      linkDateClosed: "", linkDateInvestigationOpened: "", linkDateInvestigationClosed: "", linkArrestDate: "", linkArrestPlace: "", linkTrial: "",
      linkProceduralStatus: "", linkDeathPenSought: "", linkDeathNoticed: "", linkDateDeathNoticed: "", linkPleaBargain: "",
      linkPleaBargainTermsOffered: "", linkPleaBargainRefused: "", linkPleaBargainAccepted: ""
    })

  const [mitigationData, setMitigationData] = React.useState<any>(appliedCaseFilters?.mitTheme ? appliedCaseFilters?.mitTheme : [{ mitTheme: "" }]);
  const [mitigationDeleteData, setMitigationDeleteData] = React.useState<any>([]);
  const [mitigationTypeList, setMitigationTypeList] = React.useState<any>([]);
  const [aggravFactors, setAggravFactors] = React.useState<any>(appliedCaseFilters?.afFactor ? appliedCaseFilters?.afFactor : []);
  const [aggravFactorTypeList, setAggravFactorTypeList] = React.useState<any>([]);
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [isViewMode, setIsViewMode] = React.useState<any>(false)

  const setChargedStateValue = (value: any) => {
    setLinkState(value)
    setLinkCounty("")
    const ChargedStateValue = value === "Select State" ? "" : String(value)
  }

  const setChargedCountyValue = (value: any) => {
    setLinkCounty(value)
    const ChargedCountyValue = value === "Select County" ? "" : String(value)
  }
  const handleChangeMitigation = (val: any) => {
    // setMitigationData(val)
  }
  const handleChangeFactor = (val: any) => {
    setAggravFactors(val)
  }

  const [linkStatus, setLinkStatus] = React.useState<any>(appliedCaseFilters?.linkStatus ? appliedCaseFilters?.linkStatus : "");
  const [linkDateOpened, setLinkDateOpened] = React.useState<any>(null);
  const [linkDateClosed, setLinkDateClosed] = React.useState<any>(null);
  const [linkDateInvestigationOpened, setLinkDateInvestigationOpened] = React.useState<any>(null);
  const [linkDateInvestigationClosed, setLinkDateInvestigationClosed] = React.useState<any>(null);
  const [linkArrestDate, setLinkArrestDate] = React.useState<any>(null);
  const [linkArrestPlace, setLinkArrestPlace] = React.useState<any>("");
  const [linkTrial, setLinkTrial] = React.useState<any>("");
  const [linkProceduralStatus, setLinkProceduralStatus] = React.useState<any>("");
  const [linkDeathPenSought, setLinkDeathPenSought] = React.useState<any>("");
  const [linkDeathNoticed, setLinkDeathNoticed] = React.useState<any>("");
  const [linkDateDeathNoticed, setLinkDateDeathNoticed] = React.useState<any>(null);
  const [linkPleaBargain, setLinkPleaBargain] = React.useState<any>("");
  const [linkPleaBargainAccepted, setLinkPleaBargainAccepted] = React.useState<any>("");
  const [linkPleaBargainTermsOffered, setLinkPleaBargainTermsOffered] = React.useState<any>("");
  const [linkPleaBargainRefused, setLinkPleaBargainRefused] = React.useState<any>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [linkState, setLinkState] = React.useState<any>("");
  const [linkCounty, setLinkCounty] = React.useState<any>("");
  const [linkCustody, setLinkCustody] = React.useState<any>(false);

  const [caseStatusTypeList, setCaseStatusTypeList] = React.useState([]);
  const [courtTypeList, setCourtTypeList] = React.useState([]);
  const [proceduralStatusIsOpen, setProceduralStatusIsOpen] = React.useState(false);

  // Include Null Check
  const [caseOpenedNullCheck, setCaseOpenedNullCheck] = React.useState(false);
  const [caseClosedNullCheck, setCaseClosedNullCheck] = React.useState(false);
  const [investigationOpenedNullCheck, setInvestigationOpenedNullCheck] = React.useState(false);
  const [investigationClosedNullCheck, setCaseInvestigationClosedNullCheck] = React.useState(false);

  const onSubmit = async (e: any) => {

    try {
      e.preventDefault();
      let payloadData = {
        linkStatus: linkStatus ? linkStatus : null,
        linkDateOpened: linkDateOpened ? linkDateOpened : null,
        linkDateClosed: linkDateClosed ? linkDateClosed : null,
        linkDateInvestigationOpened: linkDateInvestigationOpened ? linkDateInvestigationOpened : null,
        linkDateInvestigationClosed: linkDateInvestigationClosed ? linkDateInvestigationClosed : null,
        linkArrestDate: linkArrestDate ? linkArrestDate : null,
        linkArrestPlace: linkArrestPlace ? linkArrestPlace : null,
        linkState: linkState ? linkState : null,
        linkCounty: linkCounty ? linkCounty : null,
        linkCustody: linkCustody ? linkCustody : null,
        linkTrial: linkTrial ? linkTrial : null,
        linkProceduralStatus: linkProceduralStatus ? linkProceduralStatus : null,
        linkDeathPenSought: linkDeathPenSought ? linkDeathPenSought : null,
        linkDeathNoticed: linkDeathNoticed ? linkDeathNoticed : null,
        linkDateDeathNoticed: linkDateDeathNoticed ? linkDateDeathNoticed : null,
        linkPleaBargain: linkPleaBargain ? linkPleaBargain : null,
        linkPleaBargainAccepted: linkPleaBargainAccepted ? linkPleaBargainAccepted : null,
        caseOpenedNullCheck: caseOpenedNullCheck,
        caseClosedNullCheck: caseClosedNullCheck,
        investigationOpenedNullCheck: investigationOpenedNullCheck,
        investigationClosedNullCheck: investigationClosedNullCheck,
        mitTheme: mitigationData,
        afFactor: aggravFactors,
        tabName: 'General'
      }
      props?.closeFilter(payloadData);

    } catch (error: any) {
    }
  }

  const fetchData = async () => {
    setIsLoading(false);

    if (appliedCaseFilters) {
      // setGeneralData(response?.data?.data)
      let general = appliedCaseFilters
      if (
        general?.linkDateOpened &&
        moment(general?.linkDateOpened).isValid()
      ) {
        setLinkDateOpened(convertToUTCDate(general?.linkDateOpened))
      }
      if (
        general?.linkDateClosed &&
        moment(general?.linkDateClosed).isValid()
      ) {
        setLinkDateClosed(convertToUTCDate(general?.linkDateClosed))
      }

      if (
        general?.linkDateInvestigationOpened &&
        moment(general?.linkDateInvestigationOpened).isValid()
      ) {
        setLinkDateInvestigationOpened(
          convertToUTCDate(general?.linkDateInvestigationOpened)
        )
      }
      if (
        general?.linkDateInvestigationClosed &&
        moment(general?.linkDateInvestigationClosed).isValid()
      ) {
        setLinkDateInvestigationClosed(
          convertToUTCDate(general?.linkDateInvestigationClosed)
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
      }
      if (general?.linkArrestPlace) {
        setLinkArrestPlace(general?.linkArrestPlace)
      }
      if (general?.linkProceduralStatus) {
        setLinkProceduralStatus(general?.linkProceduralStatus)
      }
      if (general?.linkDeathPenSought) {
        setLinkDeathPenSought(general?.linkDeathPenSought)
      }
      if (general?.linkDeathNoticed) {
        setLinkDeathNoticed(general?.linkDeathNoticed)
      }
      if (general?.linkPleaBargain) {
        setLinkPleaBargain(general?.linkPleaBargain)
      }
      if (general?.linkTrial) {
        setLinkTrial(general?.linkTrial)
      }

      if (general?.linkPleaBargainTermsOffered) {
        setLinkPleaBargainTermsOffered(general?.linkPleaBargainTermsOffered)
      }
      if (general?.linkPleaBargainAccepted) {
        setLinkPleaBargainAccepted(general?.linkPleaBargainAccepted)
      }
      if (general?.linkPleaBargainRefused) {
        setLinkPleaBargainRefused(general?.linkPleaBargainRefused)
      }

      if (general?.linkState) {
        setLinkState(general?.linkState)
      }
      if (general?.linkCounty) {
        setLinkCounty(general?.linkCounty)
      }
      if (general?.linkCustody) {
        setLinkCustody(general.linkCustody)
      }
    }


    let status = await axiosInstance.get(`${baseURL}/v1/codes/codeType/Case Status`);
    if (status?.data?.data) {

      setCaseStatusTypeList(status?.data?.data);
    }
    let courtType = await axiosInstance.get(`${baseURL}/v1/codes/codeType/Court Type`);
    if (courtType?.data?.data) {
      setCourtTypeList(courtType?.data?.data);
    }
    let mitigationThemeList = await axiosInstance.get(`${baseURL}/v1/codes/codeType/Mitigation Theme`);
    if (mitigationThemeList?.data?.data) {
      setMitigationTypeList(mitigationThemeList?.data?.data);
    }
    let factorList = await axiosInstance.get(`${baseURL}/v1/codes/codeType/Aggravating Factor`);
    if (factorList?.data?.data) {
      setAggravFactorTypeList(factorList?.data?.data);
    }

  }


  React.useEffect(() => {
    fetchData()
  }, [])
  return (
    <div>
      <form onSubmit={onSubmit}>
        {isLoading && (
          <div className="h-[calc(100vh-19rem)]">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20">
              <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-red-700" />
            </div>
          </div>
        )}
        {!isLoading && (
          <>
            <div className="thin-scrollbar h-[calc(100vh-19rem)] overflow-y-auto mx-1 p-2">
              <div className="flex flex-col md:flex-row gap-2 mx-2 mb-2">
                <div className="">
                  <Label htmlFor="CaseStatus" className="text-[0.7rem] font-semibold text-gray-600">
                    Case Status
                  </Label>
                  <Select
                    value={linkStatus}
                    onValueChange={(e) => {
                      setLinkStatus(e)
                    }}
                  >
                    <SelectTrigger id="sex" className="h-8 w-full md:w-[460px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom"
                      disabled={userRoles.includes("VIEWER")}>
                      <SelectValue placeholder="Select Type" className='text-xs'>
                        {linkStatus
                          ? linkStatus
                          : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 text-xs h-64">
                      <SelectGroup>
                        <SelectItem value="" className="text-xs">Select Type</SelectItem>
                        {caseStatusTypeList &&
                          caseStatusTypeList?.map(
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
                  {isSubmitted && errors.linkStatus?.message && (
                    <small className="text-red-500">
                      {isSubmitted && errors.linkStatus.message}
                    </small>
                  )}

                </div>
                <div className="">
                  {/* <Label htmlFor="fileOpened" className="text-[0.7rem] font-semibold text-gray-600">
                        Case Opened <span className="text-red-500"> </span>
                    </Label> */}
                  <div className="my-1 flex items-center justify-between">
                    <Label className="text-[0.7rem] items-center font-semibold text-gray-600">
                      Case Opened
                    </Label>
                    <div className="flex items-center">
                      <Checkbox
                        checked={caseOpenedNullCheck}
                        onCheckedChange={(e: any) => {
                          setCaseOpenedNullCheck(e)
                        }}
                        className="border-slate-600 ml-5 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                      />
                      <span className="mx-2 text-center text-[0.7rem] text-gray-600">
                        Include Null
                      </span>
                    </div>
                  </div>
                  <div>
                    <Popover >
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full md:w-[200px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                            !linkDateOpened && "text-muted-foreground"
                          )}
                          disabled={userRoles.includes("VIEWER")}>
                          {linkDateOpened && moment(linkDateOpened).isValid() ? (
                            <>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {linkDateOpened && convertToUTCDate(linkDateOpened)}
                            </>
                          ) : (
                            (userRoles.includes("VIEWER")) ? "-" : <>
                              <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent id="crime-date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e);
                            let day = dateObj.getDate()
                            let month = dateObj.getMonth() + 1;
                            let year = dateObj.getFullYear()
                            let dateStr = moment(dateObj).format("YYYY-MM-DD");
                            setLinkDateOpened(moment(dateObj).format("YYYY-MM-DD"))
                          }}
                          value={linkDateOpened}
                        />
                      </PopoverContent>
                    </Popover>
                    <br />

                  </div>
                </div>
                <div className="">
                  {/* <Label htmlFor="fileClosed" className="text-[0.7rem] font-semibold text-gray-600">
                        Case Closed <span className="text-red-500"> </span>
                    </Label> */}
                  <div className="my-1 flex items-center justify-between">
                    <Label className="text-[0.7rem] items-center font-semibold text-gray-600">
                      Case Closed
                    </Label>
                    <div className="flex items-center">
                      <Checkbox
                        checked={caseClosedNullCheck}
                        onCheckedChange={(e: any) => {
                          setCaseClosedNullCheck(e)
                        }}
                        className="border-slate-600 ml-5 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                      />
                      <span className="mx-2 text-center text-[0.7rem] text-gray-600">
                        Include Null
                      </span>
                    </div>
                  </div>
                  <div>
                    <Popover >
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full md:w-[200px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                            !linkDateClosed && "text-muted-foreground"
                          )}
                          disabled={userRoles.includes("VIEWER")}>
                          {linkDateClosed && moment(linkDateClosed).isValid() ? (
                            <>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {convertToUTCDate(linkDateClosed)}
                            </>
                          ) : (
                            (userRoles.includes("VIEWER")) ? "-" : <>
                              <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent id="crime-date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e);
                            let dateStr = moment(dateObj).format("YYYY-MM-DD");
                            setLinkDateClosed(moment(dateObj).format("YYYY-MM-DD"))
                          }}
                          value={linkDateClosed}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2 mx-2 mb-2">
                <div className="">
                  {/* <Label htmlFor="investigationOpened" className="text-[0.7rem] font-semibold text-gray-600">
                        Investigation Opened <span className="text-red-500"> </span>
                    </Label> */}
                  <div className="my-1 flex items-center justify-between">
                    <Label className="text-[0.7rem] items-center font-semibold text-gray-600">
                      Investigation Opened
                    </Label>
                    <div className="flex items-center">
                      <Checkbox
                        checked={investigationOpenedNullCheck}
                        onCheckedChange={(e: any) => {
                          setInvestigationOpenedNullCheck(e)
                        }}
                        className="border-slate-600 ml-5 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                      />
                      <span className="mx-2 text-center text-[0.7rem] text-gray-600">
                        Include Null
                      </span>
                    </div>
                  </div>
                  <div>
                    <Popover >
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                            !linkDateInvestigationOpened && "text-muted-foreground"
                          )}
                          disabled={userRoles.includes("VIEWER")}>
                          {linkDateInvestigationOpened && moment(linkDateInvestigationOpened).isValid() ? (
                            <>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {convertToUTCDate(linkDateInvestigationOpened)}
                            </>
                          ) : (
                            (userRoles.includes("VIEWER")) ? "-" : <>
                              <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent id="crime-date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e);
                            let dateStr = moment(dateObj).format("YYYY-MM-DD");
                            setLinkDateInvestigationOpened(moment(dateObj).format("YYYY-MM-DD"))
                          }}
                          value={linkDateInvestigationOpened}
                        />
                      </PopoverContent>
                    </Popover>

                  </div>
                </div>
                <div className="">
                  {/* <Label htmlFor="investigationClosed" className="text-[0.7rem] font-semibold text-gray-600">
                        Investigation Closed <span className="text-red-500"> </span>
                    </Label> */}
                  <div className="my-1 flex items-center justify-between">
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      Investigation Closed
                    </Label>
                    <div className="flex items-center">
                      <Checkbox
                        checked={investigationClosedNullCheck}
                        onCheckedChange={(e: any) => {
                          setCaseInvestigationClosedNullCheck(e)
                        }}
                        className="border-slate-600 ml-5 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                      />
                      <span className="mx-2 text-center text-[0.7rem] text-gray-600">
                        Include Null
                      </span>
                    </div>
                  </div>
                  <div>
                    <Popover >
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                            !linkDateInvestigationClosed && "text-muted-foreground"
                          )} disabled={userRoles.includes("VIEWER")}>
                          {linkDateInvestigationClosed && moment(linkDateInvestigationClosed).isValid() ? (
                            <>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {convertToUTCDate(linkDateInvestigationClosed)}
                            </>
                          ) : (
                            (userRoles.includes("VIEWER")) ? "-" : <>
                              <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent id="crime-date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e);
                            let day = dateObj.getDate()
                            let month = dateObj.getMonth() + 1;
                            let year = dateObj.getFullYear()
                            let dateStr = moment(dateObj).format("YYYY-MM-DD");
                            setLinkDateInvestigationClosed(moment(dateObj).format("YYYY-MM-DD"))

                          }}
                          value={linkDateInvestigationClosed}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="">
                  <Label htmlFor="dateofArrest" className="text-[0.7rem] font-semibold text-gray-600">
                    Date of Arrest<span className="text-red-500"> </span>
                  </Label>
                  <div>
                    <Popover >
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full md:w-[200px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                            !linkArrestDate && "text-muted-foreground"
                          )} disabled={userRoles.includes("VIEWER")}>
                          {linkArrestDate && moment(linkArrestDate).isValid() ? (
                            <>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {convertToUTCDate(linkArrestDate)}
                            </>
                          ) : (
                            (userRoles.includes("VIEWER")) ? "-" : <>
                              <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent id="crime-date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e);
                            let dateStr = moment(dateObj).format("YYYY-MM-DD");
                            setLinkArrestDate(moment(dateObj).format("YYYY-MM-DD"))

                          }}
                          value={linkArrestDate}
                        />
                      </PopoverContent>
                    </Popover>

                  </div>
                </div>
                <div className="">
                  <Label htmlFor="placeofArrest" className="text-[0.7rem] font-semibold text-gray-600">
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

                    <Input type="text" id="placeofArrest"
                      className='w-full md:w-[200px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text'
                      value={linkArrestPlace}
                      disabled={userRoles.includes("VIEWER")}
                      placeholder={userRoles.includes("VIEWER") ? "-" : "Place of arrest"}
                      onChange={(e) => {
                        setLinkArrestPlace(e.target.value)
                      }}
                    />

                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2 mx-2 mb-2">
                <div className="my-2 w-full md:w-[200px]">
                  <div>
                    <h4 className="text-[0.7rem] font-semibold text-gray-600 my-1">Place of Arrest - State</h4>{" "}
                  </div>
                  <div>
                    <AddressSelect
                      country={"USA"}
                      category={"usStatesAndCities"}
                      placeholdername={userRoles.includes("VIEWER") ? "-" : "Select state"}
                      defultselect={linkState}
                      disabled={userRoles.includes("VIEWER")}
                      selectedValue={setChargedStateValue}
                      wPage={200}
                      className={userRoles.includes("VIEWER") ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" : "w-full md:w-[200px]"}
                    />
                  </div>
                </div>

                <div className='my-2'>
                  <h4 className="text-[0.7rem] font-semibold text-gray-600 my-1">Place of Arrest - County</h4>
                  <AddressSelect
                    category={"county"}
                    placeholdername={userRoles.includes("VIEWER") ? "-" : "Select County"}
                    state={linkState}
                    defultselect={linkCounty}
                    disabled={userRoles.includes("VIEWER")}
                    selectedValue={setChargedCountyValue}
                    wPage={200}
                    className={userRoles.includes("VIEWER") ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" : "w-full md:w-[200px]"}
                  />
                </div>
                <div className="flex items-center pt-0 md:pt-5">
                  <Checkbox
                    checked={linkCustody}
                    onCheckedChange={(e: any) => {
                      setLinkCustody(e);
                    }}
                    disabled={userRoles.includes("VIEWER")}
                    className='border-slate-600 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text' />
                  <Label className="px-1 text-center text-xs">
                    Already in custody
                  </Label>
                </div>

              </div>
              <div className="flex flex-col md:flex-row gap-2 mx-2 mb-2">
                <div className="">
                  <Label htmlFor="linkTrial" className="text-[0.7rem] font-semibold text-gray-600">
                    Trial?
                    <span className="text-red-500"> </span>
                  </Label>
                  <Select
                    value={linkTrial}
                    onValueChange={(e) => {
                      setLinkTrial(e)
                    }}
                  >
                    <SelectTrigger id="linkTrial" className="h-8 w-full md:w-[200px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" disabled={userRoles.includes("VIEWER")}>
                      <SelectValue placeholder="UnKnown" className='text-xs'>
                        {linkTrial
                          ? linkTrial
                          : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 text-xs">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">NA</SelectItem>
                        <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                        <SelectItem value="No" className="text-xs">No</SelectItem>
                        <SelectItem value="UnKnown" className="text-xs">UnKnown</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="">
                  <Label htmlFor="procedural-status" className="text-[0.7rem] font-semibold text-gray-600">
                    Procedural Status?<span className="text-red-500"> </span>
                  </Label>
                  <div>
                    <Popover
                      open={proceduralStatusIsOpen} onOpenChange={setProceduralStatusIsOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={proceduralStatusIsOpen}
                          disabled={userRoles.includes("VIEWER")}
                          className="w-full md:w-[408px] h-8 text-xs justify-between disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom"
                        >
                          {linkProceduralStatus
                            ? linkProceduralStatus
                            : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command className="dark:bg-slate-900 text-xs">
                          <CommandInput placeholder="Select Assign" className="h-8 text-xs" />
                          <CommandEmpty>No Found </CommandEmpty>
                          <CommandGroup className="h-[150px] text-xs thin-scrollbar overflow-y-scroll text-xs dark:bg-slate-900">
                            {courtTypeList.map((framework: any) => {
                              return (
                                <CommandItem
                                  key={framework.codeCode}
                                  value={framework}
                                  className="text-xs whitespace-nowrap"
                                  onSelect={(currentValue) => {
                                    setLinkProceduralStatus(framework.codeCode)
                                    setProceduralStatusIsOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      linkProceduralStatus == framework.codeCode ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {framework?.codeCode}
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div>
                    </div>

                  </div>

                </div>

                <div className="">
                  <Label htmlFor="deathPenaltySoughtAtTrial" className="text-[0.7rem] font-semibold text-gray-600">
                    Death Penalty Sought at trial? <span className="text-red-500"> </span>
                  </Label>
                  <div>
                    <Select
                      value={linkDeathPenSought}
                      onValueChange={(e) => {
                        setLinkDeathPenSought(e)
                      }}

                    >
                      <SelectTrigger id="deathPenaltySoughtAtTrial" className="h-8 w-full md:w-[200px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" disabled={userRoles.includes("VIEWER")}>
                        <SelectValue placeholder="NA" className='text-xs'>
                          {linkDeathPenSought
                            ? linkDeathPenSought
                            : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-900 text-xs">
                        <SelectGroup>
                          <SelectItem value="NA" className="text-xs">NA</SelectItem>
                          <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                          <SelectItem value="No" className="text-xs">No</SelectItem>
                          <SelectItem value="UnKnown" className="text-xs">UnKnown</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2 mx-2 mb-2">
                <div className="">
                  <Label htmlFor="deathNoticed" className="text-[0.7rem] font-semibold text-gray-600">
                    Death Noticed?<span className="text-red-500"> </span>
                  </Label>
                  <div>
                    <Select
                      value={linkDeathNoticed}
                      onValueChange={(e) => {
                        setLinkDeathNoticed(e)
                      }}

                    >
                      <SelectTrigger id="deathNoticed" className="h-8 w-full md:w-[200px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" disabled={userRoles.includes("VIEWER")}>
                        <SelectValue placeholder="UnKnown" className='text-xs'>
                          {linkDeathNoticed
                            ? linkDeathNoticed
                            : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-900 text-xs">
                        <SelectGroup>
                          <SelectItem value="NA" className="text-xs">NA</SelectItem>
                          <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                          <SelectItem value="No" className="text-xs">No</SelectItem>
                          <SelectItem value="UnKnown" className="text-xs">UnKnown</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="">
                  <Label htmlFor="dateDeathSought?" className="text-[0.7rem] font-semibold text-gray-600">
                    Date Death sought? <span className="text-red-500"> </span>
                  </Label>
                  <div>
                    <Popover >
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full md:w-[200px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                            !linkDateDeathNoticed && "text-muted-foreground"
                          )} disabled={userRoles.includes("VIEWER")}>
                          {linkDateDeathNoticed && moment(linkDateDeathNoticed).isValid() ? (
                            <>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {convertToUTCDate(linkDateDeathNoticed)}
                            </>
                          ) : (
                            userRoles.includes("VIEWER") ? "-" : <>
                              <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent id="crime-date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e)
                            let dateStr = moment(dateObj).format("YYYY-MM-DD");
                            setLinkDateDeathNoticed(dateStr)

                          }}
                          value={linkDateDeathNoticed}
                        />
                      </PopoverContent>
                    </Popover>
                    <br />
                  </div>
                </div>
                <div>
                  <Label htmlFor="Plea-bargain-offered" className="text-[0.7rem] font-semibold text-gray-600">Plea bargain offered?<span className="text-red-500"> </span></Label>
                  <Select
                    value={linkPleaBargain}
                    onValueChange={(e) => {
                      setLinkPleaBargain(e)
                    }}>
                    <SelectTrigger id="Plea-bargain-offered" disabled={userRoles.includes("VIEWER")} className="h-8 w-full md:w-[200px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                      <SelectValue placeholder="UnKnown" className='text-xs'>
                        {linkPleaBargain
                          ? linkPleaBargain
                          : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 text-xs">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">NA</SelectItem>
                        <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                        <SelectItem value="No" className="text-xs">No</SelectItem>
                        <SelectItem value="UnKnown" className="text-xs">UnKnown</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="Plea-bargain-accepted" className="text-[0.7rem] font-semibold text-gray-600">Plea bargain accepted?<span className="text-red-500"> </span></Label>
                  <Select
                    value={linkPleaBargainAccepted}
                    onValueChange={(e) => {
                      setLinkPleaBargainAccepted(e)
                    }}>
                    <SelectTrigger id="Plea-bargain-accepted" disabled={userRoles.includes("VIEWER")} className="h-8 w-full md:w-[200px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                      <SelectValue placeholder="UnKnown" className='text-xs'>
                        {linkPleaBargainAccepted
                          ? linkPleaBargainAccepted
                          : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 text-xs">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">NA</SelectItem>
                        <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                        <SelectItem value="No" className="text-xs">No</SelectItem>
                        <SelectItem value="UnKnown" className="text-xs">UnKnown</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                </div>


              </div>

              <div className="flex flex-col md:flex-row gap-2 my-2 mx-2">

                {/* <div className=" w-full ">
                    <Label htmlFor="termsofoffer" className="text-[0.7rem] font-semibold text-gray-600">If not why?</Label>
                    <Textarea
                     value={linkPleaBargainRefused }
                     onChange={(e)=>{
                        setLinkPleaBargainRefused(e.target.value)
                     }}
                        id="termsofoffer"
                        disabled={userRoles.includes("VIEWER")}
                        className="h-5/6 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none"
                        placeholder={userRoles.includes("VIEWER") ? "-" : "Type here.."}
                    />
                </div> */}

              </div>

              <div className="grid grid-cols-1 gap-2 my-2 mx-2">
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
                <div className='mt-5'>
                  <div className="w-full md:w-[480px]">
                    <Label className="text-[0.7rem] font-semibold text-gray-600">Aggravating Factor(s)</Label>
                    <MultipleCombobox
                      ListData={aggravFactorTypeList}
                      handleChange={handleChangeFactor}
                      placholderName={userRoles.includes("VIEWER") ? "" : 'Select factor'}
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
                    <Label className="text-[0.7rem] font-semibold text-gray-600">Mitigation Theme(s)<span className="text-red-500"> </span></Label>
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
                        {/* <div className='w-[400px] mx-2'>
                    <Label htmlFor="mitThemeOther" className="text-[0.7rem] font-semibold text-gray-600">Notes</Label>
                    <Textarea
                    value={mitigationData[i]['mitThemeOther']}
                    onChange={(e)=>{
                        let newData = [...mitigationData];
                        newData[i]['mitThemeOther'] = e.target.value;
                        setMitigationData(newData);
                    }}
                        id="mitThemeOther"
                        className=" text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none"
                        placeholder={userRoles.includes("VIEWER") ? "-" : "Type here.."}
                        disabled={userRoles.includes("VIEWER")}
                    />
                    </div> */}
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          </>
        )}
        <div className="border-t mt-2 flex justify-end p-2">
          <DialogFooter className="gap-2 mr-7 flex-row">
            <DialogClose className="text-black-700 text-xs" >Discard</DialogClose>
            <Button type="submit" variant="outline" className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs">
              <Icons.save className="w-4 h-4 mr-0.5" /> Apply Filters
            </Button>
          </DialogFooter>
        </div>
      </form>
    </div>

  )
}
