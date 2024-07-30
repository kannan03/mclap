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
import { Input } from "@/components/ui/input"
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
import { Calendar as CalendarIcon, LucideLayoutList } from "lucide-react"
import moment from "moment"
import { getSession } from "next-auth/react"
import Calendar from "react-calendar"
import { Form, useForm } from "react-hook-form"
import * as z from "zod"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { convertToUTCDate } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

import { toast } from "../../../components/ui/use-toast"
import { useContext } from 'react';
import { CaseFilterContext } from "@/context/caseFilterContext"

const ArticleSchema = z.object({
  data: z.any(),
})
type FormData = z.infer<typeof ArticleSchema>

export default function FilterArticle36Dialog(props: any) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      data: {
        artViolated: "",
        artAppellateRaised: "",
        artPostConRaised: "",
        artPostConFedRaised: "",
        artPostConSuccRaised: "",
        artDefNotNotified: "",
        artEvidence: "",
        artDefRemembers: "",
        artDateNotified: null,
        artNotifiedByWhom: "",
        artFormFieldCons: "",
        artPoliceAware: "",
        artPoliceAwareWhen: "",
        artSpanishFirstLang: "",
        artSpeakingIndianLang: "",
        artInterpInterrog: "",
        artInterpTrial: "",
        artInterrogEng: "",
        artInterrogSpan: "",
        artFormFiledCons: "",
        artNeedInterpHearings: "",
        artAdvised: "",
        artStatementB4Advised: "",
        artStatementUsedAtTrial: "",
        artDefStatedBornInMex: "",
        artStatementRecorded: "",
        artBookingSheetStates: "",
        artImmigrationStatus: "",
        artINSHold: "",
        artDefClaimedCitizenship: "",
        artWhenAdmittedMexNat: "",
        artOtherSourcesExist: "",
        artOtherSources: "",
        artNotes: "",
      },
    },
    resolver: zodResolver(ArticleSchema),
  })

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const searchParams = useSearchParams()
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [dateFiledIsOpen, setDateFiledIsOpen] = React.useState(false)
  const [dateFiled, setDateFiled] = React.useState<any>(null)
  const [articleData, setArticleData] = React.useState<any>({
    artViolated: "",
    artAppellateRaised: "",
    artPostConRaised: "",
    artPostConFedRaised: "",
    artPostConSuccRaised: "",
    artDefNotNotified: "",
    artEvidence: "",
    artDefRemembers: "",
    artDateNotified: null,
    artNotifiedByWhom: "",
    artFormFieldCons: "",
    artPoliceAware: "",
    artPoliceAwareWhen: "",
    artSpanishFirstLang: "",
    artSpeakingIndianLang: "",
    artInterpInterrog: "",
    artInterpTrial: "",
    artInterrogEng: "",
    artInterrogSpan: "",
    artFormFiledCons: "",
    artNeedInterpHearings: "",
    artAdvised: "",
    artStatementB4Advised: "",
    artStatementUsedAtTrial: "",
    artDefStatedBornInMex: "",
    artStatementRecorded: "",
    artBookingSheetStates: "",
    artImmigrationStatus: "",
    artINSHold: "",
    artDefClaimedCitizenship: "",
    artWhenAdmittedMexNat: "",
    artOtherSourcesExist: "",
    artOtherSources: "",
    artNotes: "",
  })

  const [artId, setArtId] = React.useState<any>("")
  const [artViolated, setArtViolated] = React.useState<any>("")
  const [artAppellateRaised, setArtAppellateRaised] = React.useState<any>("")
  const [artPostConRaised, setArtPostConRaised] = React.useState<any>("")
  const [artPostConFedRaised, setArtPostConFedRaised] = React.useState<any>("")
  const [artPostConSuccRaised, SetArtPostConSuccRaised] =
    React.useState<any>("")
  const [artDefNotNotified, setArtDefNotNotified] = React.useState<any>("")
  const [artEvidence, setArtEvidence] = React.useState<any>("")
  const [artDefRemembers, setArtDefRemembers] = React.useState<any>("")
  const [artNotifiedByWhom, setArtNotifiedByWhom] = React.useState<any>("")
  const [artFormFieldCons, setArtFormFieldCons] = React.useState<any>("")
  const [artPoliceAware, setArtPoliceAware] = React.useState<any>("")
  const [artPoliceAwareWhen, setArtPoliceAwareWhen] = React.useState<any>("")
  const [artSpanishFirstLang, setArtSpanishFirstLang] = React.useState<any>("")
  const [artSpeakingIndianLang, setArtSpeakingIndianLang] =
    React.useState<any>("")
  const [artInterpInterrog, setArtInterpInterrog] = React.useState<any>("")
  const [artInterpTrial, setArtInterpTrial] = React.useState<any>("")
  const [artInterrogEng, setArtInterrogEng] = React.useState<any>("")
  const [artInterrogSpan, setArtInterrogSpan] = React.useState<any>("")
  const [artFormFiledCons, setArtFormFiledCons] = React.useState<any>("")
  const [artNeedInterpHearings, setArtNeedInterpHearings] =
    React.useState<any>("")
  const [artAdvised, setArtAdvised] = React.useState<any>("")
  const [artStatementB4Advised, setArtStatementB4Advised] =
    React.useState<any>("")
  const [artStatementUsedAtTrial, setArtStatementUsedAtTrial] =
    React.useState<any>("")
  const [artDefStatedBornInMex, setArtDefStatedBornInMex] =
    React.useState<any>("")
  const [artStatementRecorded, setArtStatementRecorded] =
    React.useState<any>("")
  const [artBookingSheetStates, setArtBookingSheetStates] =
    React.useState<any>("")
  const [artImmigrationStatus, setArtImmigrationStatus] =
    React.useState<any>("")
  const [artINSHold, setArtINSHold] = React.useState<any>("")
  const [artDefClaimedCitizenship, setArtDefClaimedCitizenship] =
    React.useState<any>("")
  const [artWhenAdmittedMexNat, setArtWhenAdmittedMexNat] =
    React.useState<any>("")
  const [artOtherSourcesExist, setArtOtherSourcesExist] =
    React.useState<any>("")
  const [artOtherSources, setArtOtherSources] = React.useState<any>("")
  const [artNotes, setArtNotes] = React.useState<any>("")

  const appliedCaseFilters = useContext<any>(CaseFilterContext);

  const onSubmit = async (e: any) => {
    try {
      e.preventDefault()
      props?.closeFilter({
        ...articleData,
        page: props?.page,
        limit: props?.limit,
      })
    } catch (err) {}
  }
  const fetchData = async ()=>{
    if( appliedCaseFilters ) {
      let artData = appliedCaseFilters;
      if( artData?.artViolated){
          setArtViolated(artData?.artViolated)
      }
      if( artData?.artAppellateRaised){
          setArtAppellateRaised(artData?.artAppellateRaised)
      }
      if( artData?.artPostConRaised){
          setArtPostConRaised(artData?.artPostConRaised)
      }
      if( artData?.artPostConFedRaised){
          setArtPostConFedRaised(artData?.artPostConFedRaised)
      }
      if( artData?.artPostConSuccRaised){
          SetArtPostConSuccRaised(artData?.artPostConSuccRaised)
      }
      if( artData?.artDefNotNotified){
          setArtDefNotNotified(artData?.artDefNotNotified)
      }
      if( artData?.artDefRemembers){
          setArtDefRemembers(artData?.artDefRemembers)
      }
      if( artData?.artNotifiedByWhom){
          setArtNotifiedByWhom(artData?.artNotifiedByWhom)
      }
      if( artData?.artFormFieldCons){
          setArtFormFieldCons(artData?.artFormFieldCons)
      }
      if( artData?.artPoliceAware){
          setArtPoliceAware(artData?.artPoliceAware)
      }
      if( artData?.artPoliceAwareWhen){
          setArtPoliceAwareWhen(artData?.artPoliceAwareWhen)
      }
      if( artData?.artSpanishFirstLang){
          setArtSpanishFirstLang(artData?.artSpanishFirstLang)
      }
      if( artData?.artSpeakingIndianLang){
          setArtSpeakingIndianLang(artData?.artSpeakingIndianLang)
      }
      if( artData?.artInterpInterrog){
          setArtInterpInterrog(artData?.artInterpInterrog)
      }
      if( artData?.artInterpTrial){
          setArtInterpTrial(artData?.artInterpTrial)
      }
      if( artData?.artInterrogEng){
          setArtInterrogEng(artData?.artInterrogEng)
      }
      if( artData?.artInterrogSpan){
          setArtInterrogSpan(artData?.artInterrogSpan)
      }
      if( artData?.artNeedInterpHearings){
          setArtNeedInterpHearings(artData?.artNeedInterpHearings)
      }
      if( artData?.artStatementB4Advised){
          setArtStatementB4Advised(artData?.artStatementB4Advised)
      }
      if( artData?.artStatementUsedAtTrial){
          setArtStatementUsedAtTrial(artData?.artStatementUsedAtTrial)
      }
      if( artData?.artDefStatedBornInMex){
          setArtDefStatedBornInMex(artData?.artDefStatedBornInMex)
      }
      if( artData?.artStatementRecorded){
          setArtStatementRecorded(artData?.artStatementRecorded)
      }
      if( artData?.artBookingSheetStates){
          setArtBookingSheetStates(artData?.artBookingSheetStates)
      }
      if( artData?.artImmigrationStatus){
          setArtImmigrationStatus(artData?.artImmigrationStatus)
      }
      if( artData?.artINSHold){
          setArtINSHold(artData?.artINSHold)
      }
      if( artData?.artDefClaimedCitizenship){
          setArtDefClaimedCitizenship(artData?.artDefClaimedCitizenship)
      }
      if( artData?.artWhenAdmittedMexNat){
          setArtWhenAdmittedMexNat(artData?.artWhenAdmittedMexNat)
      }
      if( artData?.artOtherSourcesExist){
          setArtOtherSourcesExist(artData?.artOtherSourcesExist)
      }
      if( artData?.artOtherSources){
          setArtOtherSources(artData?.artOtherSources)
      }
      if( artData?.artNotes){
          setArtNotes(artData?.artNotes)
      }
      if( artData?.artAdvised){
          setArtAdvised(artData?.artAdvised)
      }
      if( artData?.artEvidence){
          setArtEvidence(artData?.artEvidence)
      }
      setArticleData(appliedCaseFilters);
      if( props?.applyData?.artDateNotified){
          if(moment(props?.applyData?.artDateNotified).isValid()){
              setDateFiled(convertToUTCDate(props?.applyData?.artDateNotified));
          }
      }
    }
  }

  React.useEffect(() => {
    const fetchUserRoles = async () => {
      setIsLoading(false)
      const session = await getSession()
      // setUserRoles(session?.user?.roles || [])
    }

    fetchUserRoles()
    fetchData()
    console.log(appliedCaseFilters, "appliedCaseFilters--------------")
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
            <div className="thin-scrollbar mx-1 h-[calc(100vh-19rem)] overflow-y-auto p-4">
              <div className="flex items-center justify-start">
                <Label className="text-sm font-semibold">VCCR Rights</Label>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-2">
                <div>
                  <Label
                    className="whitespace-nowrap text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="VCCR-rights"
                  >
                    Does defendant remember being notified of VCCR rights?
                  </Label>
                  <Select
                    value={artDefRemembers}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artDefRemembers"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtDefRemembers(e)
                    }}
                  >
                    <SelectTrigger
                      id="VCCR-rights"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue placeholder="Select Option">
                        {artDefRemembers
                          ? artDefRemembers
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mx-2">
                  <Label
                    htmlFor="date-notified"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Date Notified
                  </Label>
                  <div>
                    <Popover
                      open={dateFiledIsOpen}
                      onOpenChange={(e) => {
                        setDateFiledIsOpen(e)
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 w-full md:w-[200px] justify-start text-left text-xs font-normal disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100",
                            !dateFiled && "text-muted-foreground"
                          )}
                          disabled={userRoles.includes("VIEWER")}
                        >
                          {dateFiled && moment(dateFiled).isValid() ? (
                            <>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {convertToUTCDate(dateFiled)}
                            </>
                          ) : userRoles.includes("VIEWER") ? (
                            "-"
                          ) : (
                            <>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span>Pick a date</span>
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        id="date-notified"
                        className="thin-scrollbar max-h-50 m-1 w-[250px] overflow-y-auto p-0 text-xs text-black"
                      >
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e)
                            // let day = dateObj.getDate()
                            // let month = dateObj.getMonth() + 1
                            // let year = dateObj.getFullYear()
                            // let dateStr = moment(dateObj).format("YYYY-MM-DD")
                            let newData = articleData
                            newData["artDateNotified"] =
                              moment(dateObj).format("YYYY/MM/DD")
                            setArticleData(newData)
                            setValue("data", newData)

                            setDateFiled(e)
                            setDateFiledIsOpen(false)
                          }}
                          value={dateFiled}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-2">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="notified-By-Whom"
                  >
                    Notified By Whom?
                  </Label>
                  <Input
                    value={artNotifiedByWhom}
                    disabled={userRoles.includes("VIEWER")}
                    placeholder={
                      userRoles.includes("VIEWER") ? "-" : "Type here"
                    }
                    onChange={(e) => {
                      let newData = articleData
                      newData["artNotifiedByWhom"] = e.target.value
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtNotifiedByWhom(e.target.value)
                    }}
                    className="w-full md:w-[350px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                  />
                </div>

                <div className="mx-2">
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="defendant-was-notified"
                  >
                    Is there a written form indicating the defendant was
                    notified?
                  </Label>
                  <Select
                    value={artFormFieldCons}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artFormFieldCons"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtFormFieldCons(e)
                    }}
                  >
                    <SelectTrigger
                      id="defendant-was-notified"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artFormFieldCons
                          ? artFormFieldCons
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-3 border-x-0 border-y" />
              <div className="my-2 flex items-center justify-start">
                <Label className="text-sm font-semibold">
                  Defendant&apos;s nationality and Immigration Status
                </Label>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="Mexican-national"
                  >
                    Were police aware that defendant was a Mexican national?
                  </Label>

                  <Select
                    value={artPoliceAware}
                    onValueChange={(e) => {
                      console.log("onValueChange---------",e)
                      let newData = articleData
                      newData["artPoliceAware"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtPoliceAware(e)
                    }}
                  >
                    <SelectTrigger
                      id="Mexican-national"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artPoliceAware
                          ? artPoliceAware
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="When-were-they-aware"
                  >
                    When were they aware?
                  </Label>
                  <Input
                    value={artPoliceAwareWhen}
                    disabled={userRoles.includes("VIEWER")}
                    placeholder={
                      userRoles.includes("VIEWER") ? "-" : "Type here"
                    }
                    onChange={(e) => {
                      let newData = articleData
                      newData["artPoliceAwareWhen"] = e.target.value
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtPoliceAwareWhen(e.target.value)
                    }}
                    className="select-custom w-full text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                  />
                </div>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="another-country"
                  >
                    Is there any evidence defendant pretended to be a US citizen
                    or citizen of another country?
                  </Label>
                  <Select
                    value={artDefClaimedCitizenship}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artDefClaimedCitizenship"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtDefClaimedCitizenship(e)
                    }}
                  >
                    <SelectTrigger
                      id="another-country"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artDefClaimedCitizenship
                          ? artDefClaimedCitizenship
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="defendant-admit"
                  >
                    If yes, When did defendant admit to being a Mexican
                    national?
                  </Label>
                  <Input
                    value={artWhenAdmittedMexNat}
                    onChange={(e) => {
                      let newData = articleData
                      newData["artWhenAdmittedMexNat"] = e.target.value
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtWhenAdmittedMexNat(e.target.value)
                    }}
                    disabled={userRoles.includes("VIEWER")}
                    placeholder={
                      userRoles.includes("VIEWER") ? "-" : "Type here"
                    }
                    className="w-full text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor=""
                  >
                    Are there other relevant sources to determine awareness of
                    the defendant&apos;s nationality?
                  </Label>
                  <Select
                    value={artOtherSourcesExist}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artOtherSourcesExist"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtOtherSourcesExist(e)
                    }}
                  >
                    <SelectTrigger
                      id="determine-awareness"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artOtherSourcesExist
                          ? artOtherSourcesExist
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="What-are-they">
                    If yes, what are they?
                  </Label>               
                  <Input
                    value={artOtherSources}
                    placeholder={
                      userRoles.includes("VIEWER") ? "-" : "Type here"
                    }
                    disabled={userRoles.includes("VIEWER")}
                    onChange={(e) => {
                      let newData = articleData
                      newData["artOtherSources"] = e.target.value
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtOtherSources(e.target.value)
                    }}
                    className="w-full text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                  />
                </div>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="jail-booking"
                  >
                    Does jail booking sheet list defendant’s nationality or
                    place of birth?
                  </Label>
                  <Select
                    value={artBookingSheetStates}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artBookingSheetStates"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtBookingSheetStates(e)
                    }}
                  >
                    <SelectTrigger
                      id="jail-booking"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artBookingSheetStates
                          ? artBookingSheetStates
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="status-of-defendant"
                  >
                    What was immigration status of defendant?
                  </Label>
                  <Select
                    value={artImmigrationStatus}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artImmigrationStatus"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtImmigrationStatus(e)
                    }}
                  >
                    <SelectTrigger
                      id="status-of-defendant"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artImmigrationStatus
                          ? artImmigrationStatus
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="Legal" className="text-xs">
                          Legal
                        </SelectItem>
                        <SelectItem
                          value="Permanent Resident"
                          className="text-xs"
                        >
                          Permanent Resident
                        </SelectItem>
                        <SelectItem
                          value="Temporary Resident"
                          className="text-xs"
                        >
                          Temporary Resident
                        </SelectItem>
                        <SelectItem value="Undocumented" className="text-xs">
                          Undocumented
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-2">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="placed-on-INS"
                  >
                    Has defendant ever been placed on INS hold?
                  </Label>
                  <Select
                    value={artINSHold}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artINSHold"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtINSHold(e)
                    }}
                  >
                    <SelectTrigger
                      id="placed-on-INS"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artINSHold
                          ? artINSHold
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-3 border-x-0 border-y" />
              <div className="my-2 flex items-center justify-start">
                <Label className="text-sm font-semibold">
                  Defendant&apos;s statement
                </Label>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="time-of-arrest"
                  >
                    Was defendant’s first language Spanish at time of arrest?
                  </Label>
                  <Select
                    value={artSpanishFirstLang}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artSpanishFirstLang"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtSpanishFirstLang(e)
                    }}
                  >
                    <SelectTrigger
                      id="time-of-arrest"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artSpanishFirstLang
                          ? artSpanishFirstLang
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="language-at-time-arrest"
                  >
                    Was defendant’s first language an indigenous language at
                    time of arrest?
                  </Label>
                  <Select
                    value={artSpeakingIndianLang}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artSpeakingIndianLang"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtSpeakingIndianLang(e)
                    }}
                  >
                    <SelectTrigger
                      id="language-at-time-arrest"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artSpeakingIndianLang
                          ? artSpeakingIndianLang
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="not-police-officer"
                  >
                    Was a neutral interpreter (not police officer) used during
                    interrogation?
                  </Label>
                  <Select
                    value={artInterpInterrog}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artInterpInterrog"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtInterpInterrog(e)
                    }}
                  >
                    <SelectTrigger
                      id="not-police-officer"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artInterpInterrog
                          ? artInterpInterrog
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="conducted-in-english"
                  >
                    Was interrogation conducted in English?
                  </Label>
                  <Select
                    value={artInterrogEng}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artInterrogEng"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtInterrogEng(e)
                    }}
                  >
                    <SelectTrigger
                      id="conducted-in-english"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artInterrogEng
                          ? artInterrogEng
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="conducted-in-Spanish"
                  >
                    Was interrogation conducted in Spanish?
                  </Label>
                  <Select
                    value={artInterrogSpan}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artInterrogSpan"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtInterrogSpan(e)
                    }}
                  >
                    <SelectTrigger
                      id="conducted-in-Spanish"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artInterrogSpan
                          ? artInterrogSpan
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="communicate-with-consulate"
                  >
                    If defendant gave statement to police, did they advise
                    defendant during interview of right to communicate with
                    consulate?
                  </Label>
                  <Select
                    value={artAdvised}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artAdvised"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtAdvised(e)
                    }}
                  >
                    <SelectTrigger
                      id="communicate-with-consulate"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artStatementB4Advised
                          ? artStatementB4Advised
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="prior-to-notification"
                  >
                    Was statement given prior to notification?
                  </Label>
                  <Select 
                  value={artStatementB4Advised}
                  onValueChange={(e) => {
                    let newData = articleData
                    newData["artStatementB4Advised"] = e
                    setArticleData(newData)
                    setValue("data", newData)
                    setArtStatementB4Advised(e)
                  }}>
                    <SelectTrigger
                      id="prior-to-notification"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {/* {artStatementB4Advised
                                                    ? artStatementB4Advised
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Option")} */}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="used-at-trial"
                  >
                    If yes, Was statement used at trial?
                  </Label>
                  <Select
                    value={artStatementUsedAtTrial}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artStatementUsedAtTrial"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtStatementUsedAtTrial(e)
                    }}
                  >
                    <SelectTrigger
                      id="used-at-trial"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artStatementUsedAtTrial
                          ? artStatementUsedAtTrial
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="born-in-Mexico"
                  >
                    During statement did defendant say she/he was born in
                    Mexico?
                  </Label>
                  <Select
                    value={artDefStatedBornInMex}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artDefStatedBornInMex"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtDefStatedBornInMex(e)
                    }}
                  >
                    <SelectTrigger
                      id="born-in-Mexico"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artDefStatedBornInMex
                          ? artDefStatedBornInMex
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="tape-recorded"
                  >
                    Was statement tape-recorded?
                  </Label>
                  <Select
                    value={artStatementRecorded}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artStatementRecorded"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtStatementRecorded(e)
                    }}
                  >
                    <SelectTrigger
                      id="tape-recorded"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artStatementRecorded
                          ? artStatementRecorded
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-3 border-x-0 border-y" />
              <div className="my-2 flex items-center justify-start">
                <Label className="text-sm font-semibold">
                  Trial and Appeal
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="did-trial-counsel-argue-state"
                  >
                    Did trial counsel argue state authorities violated Article
                    36?
                  </Label>
                  <Select
                    value={artViolated}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artViolated"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtViolated(e)
                    }}
                  >
                    <SelectTrigger
                      id="did-trial-counsel-argue-state"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artViolated
                          ? artViolated
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="appellate-counsel"
                  >
                    Did appellate counsel raise the argument?
                  </Label>
                  <Select
                    value={artAppellateRaised}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artAppellateRaised"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtAppellateRaised(e)
                      setArtAppellateRaised(e)
                    }}
                  >
                    <SelectTrigger
                      id="appellate-counsel"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artAppellateRaised
                          ? artAppellateRaised
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="did-trial-counsel"
                  >
                    Did state post-conviction counsel raise the argument?
                  </Label>
                  <Select
                    value={artPostConRaised}
                    onValueChange={(e) => {
                      let newData: any = articleData
                      newData["artPostConRaised"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtPostConRaised(e)
                    }}
                  >
                    <SelectTrigger
                      id="did-trial-counsel"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artPostConRaised
                          ? artPostConRaised
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="appellate-counsel"
                  >
                    Did federal post-conviction counsel raise the argument?
                  </Label>
                  <Select
                    value={artPostConFedRaised}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artPostConFedRaised"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtPostConFedRaised(e)
                    }}
                  >
                    <SelectTrigger
                      id="appellate-counsel"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artPostConFedRaised
                          ? artPostConFedRaised
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="did-trial-counsel"
                  >
                    Was argument raised in successive post-conviction
                    application?
                  </Label>
                  <Select
                    value={artPostConSuccRaised}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artPostConSuccRaised"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      SetArtPostConSuccRaised(e)
                    }}
                  >
                    <SelectTrigger
                      id="did-trial-counsel"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artPostConSuccRaised
                          ? artPostConSuccRaised
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="appellate-counsel"
                  >
                    If argument wasn’t raised, Is there evidence that defendant
                    was not properly notified of Article 36 rights?
                  </Label>
                  <Select
                    value={artDefNotNotified}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artDefNotNotified"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtDefNotNotified(e)
                    }}
                  >
                    <SelectTrigger
                      id="appellate-counsel"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artDefNotNotified
                          ? artDefNotNotified
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-1 grid grid-cols-1 md:grid-cols-2 justify-end gap-5">
                <div className="">
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="court-hearings"
                  >
                    Does defendant need interpreter in court hearings?
                  </Label>
                  <Select
                    value={artNeedInterpHearings}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artNeedInterpHearings"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtNeedInterpHearings(e)
                    }}
                  >
                    <SelectTrigger
                      id="court-hearings"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artNeedInterpHearings
                          ? artNeedInterpHearings
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-1 grid grid-cols-1 justify-end gap-2">
                <div>
                  <Label
                    className="text-[0.7rem] font-semibold text-gray-600"
                    htmlFor="used-at-trial"
                  >
                    Was a neutral interpreter used at trial?
                  </Label>
                  <Select
                    value={artInterpTrial}
                    onValueChange={(e) => {
                      let newData = articleData
                      newData["artInterpTrial"] = e
                      setArticleData(newData)
                      setValue("data", newData)
                      setArtInterpTrial(e)
                    }}
                  >
                    <SelectTrigger
                      id="used-at-trial"
                      disabled={userRoles.includes("VIEWER")}
                      className="select-custom h-8 w-full md:w-[200px] text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                    >
                      <SelectValue
                        placeholder="Select Option"
                        className="text-xs"
                      >
                        {artInterpTrial
                          ? artInterpTrial
                          : userRoles.includes("VIEWER")
                          ? "-"
                          : "Select Option"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs dark:bg-slate-900">
                      <SelectGroup>
                        <SelectItem value="NA" className="text-xs">
                          NA
                        </SelectItem>
                        <SelectItem value="Yes" className="text-xs">
                          Yes
                        </SelectItem>
                        <SelectItem value="No" className="text-xs">
                          No
                        </SelectItem>
                        <SelectItem value="Unknown" className="text-xs">
                          Unknown
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="my-3 border-x-0 border-y" />
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
                  <Icons.save className="mr-0.5 h-4 w-4" /> Apply Filters
                </Button>
              )}
            </DialogFooter>
          </div>
        )}
      </form>
    </div>
  )
}
