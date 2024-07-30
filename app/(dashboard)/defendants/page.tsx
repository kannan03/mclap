"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
// import "ka-table/style.css"
import { format } from "date-fns"
// import { ICellTextProps } from "ka-table/props"
// import { kaPropsUtils } from "ka-table/utils"
import { Calendar as CalendarIcon, View } from "lucide-react"
import Calendar from "react-calendar"
import * as z from "zod"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { cn, keyDownLengthValidation } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

import "react-calendar/dist/Calendar.css"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import moment from "moment"
import { getSession } from "next-auth/react"
import { Form, useForm } from "react-hook-form"
import { ComboboxCourts } from "@/components/cases/district-court-combobox."
import { DefendantSchema } from "@/lib/validations/defendant"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import DefendantCasesPage from "@/components/cases/defendantCasesPage"
import DefendantContactPage from "@/components/contact/defendantContactPage"
import DefendantNotesPage from "@/components/notes/defendantNotesPage"
import { AddressSelect } from "@/components/utils/states-cities-combobox"
import { convertToUTCDate } from "@/lib/utils"

type FormData = z.infer<typeof DefendantSchema>

interface Props{
  showcards :(val: any) => void;
  refreshApi : any
}

export function CardWithForm({showcards, refreshApi}:Props) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(DefendantSchema),
  })
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

  const searchParams = useSearchParams()
  const router = useRouter()
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [state, setState] = React.useState("")
  const [country, setCountry] = React.useState("")
  const [city, setCity] = React.useState("")
  const [dateIsOpen, setDateIsOpen] = React.useState(false)
  const [birthDate, setBirthDate] = React.useState<any>("")
  const [migrationDate, setMigrationDate] = React.useState<any>("")
  const [impDateDiagnosed, setImpDateDiagnosed] = React.useState<any>("")
  const [prisonNameList, setPrisonNameList] = React.useState<any>([])
  const [editDef, setEditDef] = React.useState<any>({})
  const [birthState, setBirthState] = React.useState<any>("")
  const [isSubmitDisable, setIsSubmitDisable] = React.useState(false)

  const [statusTypeList, setStatusTypeList] = React.useState<any>([])
  const [selectCaseStatus, setSelectCaseStatus] = React.useState<any>("")
  const [arrestDateofIsOpen, setArrestDateIsOpen] = React.useState(false)
  const [dateOfArrest, setDateOfArrest] = React.useState<any>("")


  const [date, setDate] = React.useState<any>("")
  const [age, setAge] = React.useState<number | "">("")
  // Radio button
  const [itWorks, SetItWorks] = React.useState(false)

  const setBirthStateValue = (value: any) => {
    setBirthState(value)
    setValue("defMexicanBirthState", String(value))
  }
  const setChargedStateValue = (value: any) => {
    setState(value)
    const ChargedStateValue = value === "Select State" ? "" : String(value)
    setValue("defChargedState", ChargedStateValue)
    setCity("")
    setValue("defChargedCounty", "")
  }
  const setChargedCountyValue = (value: any) => {
    setCity(value)
    const ChargedCountyValue = value === "Select County" ? "" : String(value)
    setValue("defChargedCounty", ChargedCountyValue)
  }
  const calculateAge = React.useMemo(
    () => (birthDate: string) => {
      birthDate = convertToUTCDate(birthDate)
      const currentDate = moment()
      const years = currentDate.diff(moment(birthDate), "years")
      return years
    },
    [birthDate]
  )

  //Mobile View
  const toggleCardForm = () => {
    showcards(!true)    
  }

  // const handleDateChange = async (newDate: Date) => {
  //   setDate(newDate);
  //   await setAge(calculateAge(String(newDate))); // Calculate age when date changes
  // };
  // const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputAge = parseInt(e.target.value);
  //   if (!isNaN(inputAge)) {
  //     setAge(inputAge);
  //   }
  // };

  const [aliasData, setAliasData] = React.useState<any>([
    { aliasFirst: "", aliasLast: "", aliasMiddle: "" },
  ])

  const [schoolData, setSchoolData] = React.useState<any>([
    {
      schoolType: "",
      schoolName: "",
      schoolYearStarted: null,
      schoolYearLeft: null,
      schoolAddress: "",
      schoolCountry: "",
      schoolState: "",
      schoolCity: "",
    },
  ])

  const [ImpairmentData, setImpairmentData] = React.useState<any>([
    {
      impType: "",
      impDeterminedBy: "",
      impDoctor: "",
      impDescription: "",
      impDateDiagnosed: null,
    },
  ])

  const [aliasDeleteData, setAliasDeleteData] = React.useState<any>([])
  const [schoolDeleteData, setSchoolDeleteData] = React.useState<any>([])
  const [ImpairmentDeleteData, setImpairmentDeleteData] = React.useState<any>(
    []
  )
  const getPrisonNameList = async () => {
    const response = await axiosInstance.get(`${baseURL}/v1/defendants/prison`)
    let data = response?.data?.data ? response?.data?.data : []
    setPrisonNameList([{ id: "", prisonName: "Select Option" }, ...data])
  }

  const [federalValue, setFederalValue] = React.useState<any>("")
  const [schoolYearsTotal, setSchoolYearsTotal] = React.useState<any>("")
  const [levelOfInvolvement, setLevelOfInvolvement] = React.useState<any>("")
  const [assignConsulate, setAssignConsulate] = React.useState<any>("")

  const onSubmit = async (payload: any) => {
    let defendantData = {
      defSex: payload?.defSex,
      defFirst: payload?.defFirst,
      defLast: payload?.defLast,
      defMiddle: payload?.defMiddle,
      defNickname: payload?.defNickname,
      defLiteracyNotes: payload?.defLiteracyNotes,
      defNotes: payload?.defNotes,
      defDOBapprox: birthApprox,
      defMexicanBirthState: payload?.defMexicanBirthState,
      defMigrationDate: migrationDate ? migrationDate : null,
      defMigrationApprox: payload?.defMigrationApprox || null,
      defBirthdate: birthDate ? birthDate : null,
      defSchoolYearsTotal: payload?.defSchoolYearsTotal || null,
      defSpeakEnglish: speakEng ? "Yes" : "no",
      defLiterateEnglish: literateEng ? "Yes" : "no",
      defLiterateSpanish: literateSpanish ? "Yes" : "no",
      defSpeakSpanish: speakSpanish ? "Yes" : "no",
      defSpeakOtherLanguage: otherLang ? "Yes" : "no",
      defWorkNotes: payload?.defWorkNotes,
      defChargedCountry: payload?.defChargedCountry,
      defChargedState: payload?.defChargedState,
      defChargedCounty: payload?.defChargedCounty,
      defIsFederal: payload?.defIsFederal || null,
      defFederalDistrict: payload?.defFederalDistrict,
      defPrisonID: payload?.defPrisonID ? payload?.defPrisonID : null,
      defHasImpairment: payload?.defHasImpairment
        ? payload?.defHasImpairment
        : false,
      defLevelInvolvement: payload?.defLevelInvolvement
        ? payload.defLevelInvolvement
        : "",
      defAsssignConsulate: payload?.defAsssignConsulate
        ? payload.defAsssignConsulate
        : "",
      defDateArrest: payload?.defDateArrest ? payload?.defDateArrest : null,
      defProgramAttorney: payload?.defProgramAttorney ? payload?.defProgramAttorney : null
    }


    // let ImpairmenPayload = {
    //   impType: payload?.ImpairmentType,
    //   impDeterminedBy: payload?.ImpDetermined,
    //   impDoctor: payload?.ImpairmentDoctor,
    //   impDateDiagnosed: payload?.impDateDiagnosed ? payload?.impDateDiagnosed : null,
    //   impDescription: payload?.ImpairmentDescription,
    // }
    let payloadData = {
      defendant: defendantData,
      school: schoolData,
      impairment: ImpairmentData,
      alias: aliasData,
      aliasDelete: aliasDeleteData,
      schoolDelete: schoolDeleteData,
      impairmentDelete: ImpairmentDeleteData,
    }

    if (isEdit || searchParams?.get("defendantId")) {
      // update
      let updateId = searchParams?.get("defendantId")
        ? searchParams?.get("defendantId")
        : editDef?.id        
      const res = await axiosInstance.patch(
        `${baseURL}/v1/defendants/${updateId}`,
        payloadData
      )
      getDefendantById(updateId)
      if (res?.status === 500) {
        toast({
          variant: "default",
          description: "Defendant updated failed",
          style: {
            background: "red",
          },
        })
      } else {
        toast({
          variant: "default",
          description: "Defendant information updated successfully",
          style: {
            background: "#03C03C",
          },
        })
      }
    } else {
      const res = await axiosInstance.post(
        baseURL + "/v1/defendants",
        payloadData
      )
      await getDefendantById(res?.data?.data?.id)
      if (res?.status === 500) {
        toast({
          variant: "default",
          description: "Defendant Created Failed",
          style: {
            background: "red",
          },
        })
      } else {
        router.push(`/defendants?defendantId=${res?.data?.data?.id}`)
        setIsAdd(false)
        setIsView(true)
        toast({
          variant: "default",
          description: "Defendant Created Successfully",
          style: {
            background: "#03C03C",
          },
        })
      }
    }
  }
  const [consulateTypeList, setConsulateTypeList] = React.useState<any>([])
  const [assignIsOpen, setAssignIsOpen] = React.useState(false)

  const [isAdd, setIsAdd] = React.useState<any>(false)
  const [isEdit, setIsEdit] = React.useState<any>(false)
  const [isView, setIsView] = React.useState<any>(false)

  const [gender, setGender] = React.useState<any>("")
  const [selectPrisonValue, setSelectPrisonValue] = React.useState<any>("")
  const [speakEng, setSpeakEng] = React.useState<any>(false)
  const [literateEng, setLiterateEng] = React.useState<any>(false)
  const [speakSpanish, setSpeakSpanish] = React.useState<any>(false)
  const [literateSpanish, setLiterateSpanish] = React.useState<any>(false)
  const [otherLang, setOtherLang] = React.useState<any>(false)
  const [birthApprox, setBirthApprox] = React.useState<any>(false)
  const [migrationApprox, setMigrationApprox] = React.useState<any>(false)
  const [federalDistrict, setFederalDistrict] = React.useState<any>("");
  const [hasImpairment, setHasImpairment] = React.useState<any>(false)
  const [impTypeList, setImpTypeList] = React.useState<any>([])
  const [schoolTypeList, setSchoolTypeList] = React.useState<any>([])
  const [validationError, setValidationError] = React.useState("")
  // combo box
  const [open, setOpen] = React.useState(false)
  const [prisonValue, setPrisonValue] = React.useState("")

  const selectCourt = (value: any) => {
    setValue("defFederalDistrict", value)
    setFederalDistrict(value)
  }

  const fetchStatusType = async () => {
    try {
      let params = "Case Status"
      const response = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/${params}`
      )
      const resp = response?.data?.data ? response?.data?.data : []
      setStatusTypeList(resp)
    } catch (error) { }
  }

  const getDefendantById = async (Id : any) => {
    try {
      if (Id) {
        const response = await axiosInstance.get(
          `${baseURL}/v1/defendants/${Id}`
        )
        let data = response?.data?.data ? response?.data?.data : []

        if (data?.school && data?.school?.length > 0) {
          setSchoolData(data?.school)
        }
        if (data?.alias && data?.alias?.length > 0) {
          setAliasData(data?.alias)
        }
        if (data?.impairments && data?.impairments?.length > 0) {
          setImpairmentData(data?.impairments)
        }

        if (data?.defSex) {
          setValue("defSex", data?.defSex)
          setGender(data.defSex)
        }

        if (data?.defFirst) {
          setValue("defFirst", data?.defFirst, { shouldValidate: true })
        }
        if (data?.defLast) {
          setValue("defLast", data?.defLast, { shouldValidate: true })
        }
        if (data?.defMiddle) {
          setValue("defMiddle", data?.defMiddle)
        }
        if (data?.defNickname) {
          setValue("defNickname", data?.defNickname)
        }
        if (data?.defNotes) {
          setValue("defNotes", data?.defNotes)
        }
        if (data?.defWorkNotes) {
          setValue("defWorkNotes", data?.defWorkNotes)
        }
        if (data?.defLiteracyNotes) {
          setValue("defLiteracyNotes", data?.defLiteracyNotes)
        }
        if(data?.defProgramAttorney){
          setValue("defProgramAttorney",data?.defProgramAttorney)
        }
        // if (data?.defAsssignConsulate) {
        //   setValue("defAsssignConsulate", String(data?.defAsssignConsulate), {
        //     shouldValidate: true,
        //   })
        //   setAssignConsulate(String(data?.defAsssignConsulate))
        // }
        if (data?.defDateArrest && moment(data?.defDateArrest).isValid()) {
          setDateOfArrest(convertToUTCDate(data?.defDateArrest));
          setValue("defDateArrest", convertToUTCDate(data?.defDateArrest));
        }
        if (data?.defSchoolYearsTotal) {
          setValue("defSchoolYearsTotal", String(data?.defSchoolYearsTotal))
          setSchoolYearsTotal(String(data?.defSchoolYearsTotal))
        }

        if (data?.defDOBapprox) {
          setValue("defDOBapprox", data?.defDOBapprox ? true : false)
          setBirthApprox(true)
        }

        if (data?.defMigrationDate) {
          if (moment(data?.defMigrationDate).isValid()) {
            let dateFormat = convertToUTCDate(data?.defMigrationDate)
            setMigrationDate(new Date(dateFormat))
            setValue("defMigrationDate", String(dateFormat))
          }
        }
        if (data?.defBirthdate) {
          if (moment(data?.defBirthdate).isValid()) {
            setBirthDate(convertToUTCDate(data?.defBirthdate))
            setValue("defBirthdate", String(convertToUTCDate(data?.defBirthdate)))
          }
        }

        if (data?.defMexicanBirthState) {
          setValue("defMexicanBirthState", String(data?.defMexicanBirthState))
          setBirthState(String(data?.defMexicanBirthState))
        }
        if (data?.defChargedState) {
          setValue("defChargedState", String(data?.defChargedState))
          setState(String(data?.defChargedState))
        }

        if (data?.defChargedCounty) {
          setCity(data?.defChargedCounty)
          setValue("defChargedCounty", String(data?.defChargedCounty))
        }
        if (data?.defIsFederal) {
          SetItWorks(true)
          setValue("defIsFederal", true)
        }
        if (!data?.defIsFederal) {
          SetItWorks(false)
          setValue("defIsFederal", false)
        }
        if (data?.defMigrationApprox) {
          setValue("defMigrationApprox", true)
          setMigrationApprox(true)
        }
        if (data?.defPrisonID) {
          setValue("defPrisonID", data?.defPrisonID)
          setSelectPrisonValue(data?.defPrisonID)
        }

        if (data?.defIsFederal) {
          SetItWorks(true)
          setValue("defIsFederal", true)
          setFederalValue("Federal")
          if (data?.defFederalDistrict) {
            setValue("defFederalDistrict", data.defFederalDistrict)
            setFederalDistrict(data.defFederalDistrict)
          }
        }
        if (!data?.defIsFederal) {
          SetItWorks(false)
          setValue("defIsFederal", false)
          setFederalValue("State")
        }

        setSpeakEng(data?.defSpeakEnglish == "Yes" ? true : false)
        setLiterateEng(data?.defLiterateEnglish == "Yes" ? true : false)
        setLiterateSpanish(data?.defLiterateSpanish == "Yes" ? true : false)
        setSpeakSpanish(data?.defSpeakSpanish == "Yes" ? true : false)
        setOtherLang(data?.defSpeakOtherLanguage == "Yes" ? true : false)

        setValue(
          "defSpeakEnglish",
          data?.defSpeakEnglish ? String(data?.defSpeakEnglish) : ""
        )
        setValue(
          "defLiterateEnglish",
          data?.defLiterateEnglish ? String(data?.defLiterateEnglish) : ""
        )
        setValue(
          "defLiterateSpanish",
          data?.defLiterateSpanish ? String(data?.defLiterateSpanish) : ""
        )
        setValue(
          "defSpeakSpanish",
          data?.defSpeakSpanish ? String(data?.defSpeakSpanish) : ""
        )
        setValue(
          "defSpeakOtherLanguage",
          data?.defSpeakOtherLanguage ? String(data?.defSpeakOtherLanguage) : ""
        )

        setValue("defHasImpairment", data?.defHasImpairment ? true : false)
        setHasImpairment(data?.defHasImpairment ? true : false)
        setValue(
          "defLevelInvolvement",
          data?.defLevelInvolvement ? data?.defLevelInvolvement : ""
        )
        setLevelOfInvolvement(data?.defLevelInvolvement)

        setEditDef(data)
      }
    } catch (err) { }
  }

  const fetchCodeType = async () => {
    try {
      const responseImp = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/Impairment`
      )
      const impType = responseImp?.data?.data ? responseImp?.data?.data : []
      setImpTypeList(impType)
      const responseSchool = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/School Type`
      )
      const resp = responseSchool?.data?.data ? responseSchool?.data?.data : []
      setSchoolTypeList(resp)

      const responseConsulate = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/Consulate Type`
      )
      const typeConsulate = responseConsulate?.data?.data
        ? responseConsulate?.data?.data
        : []
      setConsulateTypeList(typeConsulate)
    } catch (error) { }
  }

  const exportDefendantDetailsToPDF = async (id: any) => {
    const pdfFile = await axiosInstance.get(
      `${baseURL}/v1/defendants/downloadDefendantDetailsById/${id}`,
      { responseType: 'blob' }
    )

    const response = await axiosInstance.get(
      `${baseURL}/v1/defendants/${id}`
    )
    let defendantData = response?.data?.data ? response?.data?.data : '';

    if (pdfFile?.status == 200 && pdfFile?.data) {
      const fileURL = window.URL.createObjectURL(pdfFile?.data)
      let alink = document.createElement("a")
      alink.href = fileURL
      alink.download = `${defendantData?.defLast} ${defendantData?.defFirst} - Details.pdf`
      alink.click()
    }
    else {
      // Show error in toast
    }
  }

  const resetInitialState = () => {
    setIsEdit(false)
    setIsView(true)
    setGender("")
    setSelectPrisonValue("")
    setSpeakEng("")
    setSpeakSpanish("")
    setLiterateSpanish("")
    setOtherLang("")
    setBirthApprox(false)
    setMigrationApprox(false)
    setHasImpairment(false)
    setAliasData([{ aliasFirst: "", aliasLast: "", aliasMiddle: "" }])
    setSchoolData([
      {
        schoolType: "",
        schoolName: "",
        schoolYearStarted: null,
        schoolYearLeft: null,
        schoolAddress: "",
        schoolCountry: "",
        schoolState: "",
        schoolCity: "",
      },
    ])
    setImpairmentData([
      {
        impType: "",
        impDeterminedBy: "",
        impDoctor: "",
        impDescription: "",
        impDateDiagnosed: null,
      },
    ])
  }

  React.useEffect(() => {
    fetchCodeType()
    fetchStatusType()
    getPrisonNameList()
    setIsEdit(false)
    setAliasDeleteData([])
    setSchoolDeleteData([])
    setImpairmentDeleteData([])
    const fetchUserRoles = async () => {
      const session = await getSession()
      setUserRoles(session?.user?.roles || [])
    }

    fetchUserRoles()
    if (searchParams?.get("defendantId")) {
      setIsView(true)
      setIsAdd(false)
      getDefendantById(searchParams?.get("defendantId"))
    } else {
      setIsAdd(true)
      setEditDef({})
    }
  }, [])

  React.useEffect(() => {
    getDefendantById(searchParams?.get("defendantId"))
  }, [refreshApi]);

  return (
    <div className="border-t-none container  max-w-[400px] rounded-l-lg border-r bg-transparent px-1">
      <div>
        <div className="flex justify-between">
          <div className="flex ">
            {isAdd && <p className="">Create New Defendant </p>}
            {!isAdd && (
              <>
                <p className="text-l mt-0.5 font-bold whitespace-nowrap">
                  Defendant Details </p>
                <p className="ml-14 md:ml-36 mt-2 whitespace-nowrap text-[0.7rem] font-semibold text-gray-600">
                  ID :{" "}
                  {searchParams?.get("defendantId")
                    ? searchParams?.get("defendantId")
                    : editDef?.id}{" "}
                </p>
              </>
            )}
            <span className="mx-1 text-red-500"></span>
          </div>


          <div className="my-1 flex text-xs font-bold">
            {!isAdd && (
              <>
                <Icons.printer
                  onClick={() => {
                    exportDefendantDetailsToPDF(searchParams?.get("defendantId"))
                  }}
                  className="cursor-pointer mr-1.5 mt-1 pb-2 text-xs text-slate-500"
                />
              </>
            )}
          </div>
          {!userRoles.includes("VIEWER") && (
            <div className="my-1 flex text-xs font-bold">
              {!isAdd && (
                <>
                  {isView && (
                    <Icons.pencil
                      onClick={() => {
                        setIsEdit(true)
                        setIsView(false)
                      }}
                      className="cursor-pointer mr-0 md:mr-2 mt-1 pb-2 text-xs text-slate-500"
                    />
                  )}
                  {isEdit && (
                    <Icons.eye
                      onClick={(e: any) => {
                        setIsEdit(false)
                        setIsView(true)
                        if (searchParams?.get("defendantId")) {
                          e.preventDefault()
                          resetInitialState()
                          reset()
                          getDefendantById(searchParams?.get("defendantId"))
                        }
                      }}
                      className="cursor-pointer mr-0 md:mr-2 pb-2 mt-1 text-xs text-slate-500"
                    />
                  )}
                </>
              )}
            </div>
          )}   
          {!isAdd&& (

                    <Button
                        variant="ghost"
                        className="flex h-8 items-center rounded-lg bg-transparent hover:bg-transparent hover:text-inherit px-2 py-1 text-xs xl:py-1.5 ml-0.5 md:hidden"
                        onClick={toggleCardForm}
                      ><Icons.PiLeftArrow /></Button>
          )}
        </div>
        
        {!isAdd && (
          <div className="border-b p-0" />
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`thin-scrollbar ${isView ? "h-[calc(100vh-8.5rem)]" : "h-[calc(100vh-12rem)]"} overflow-y-auto overflow-x-hidden px-1 my-3`}>
            <h4 className=" text-sm font-bold mb-2"><Icons.PiPersonSimpleCircle /> Personal Details</h4>
            <div className="items-center">
              <div className="grid grid-cols-2 gap-2">
                <div className="">
                  <Label htmlFor="Lastname" className="text-[0.7rem] font-semibold text-gray-600">
                    Last Name
                  </Label>
                  <Input
                    id="Lastname"
                    placeholder={isView ? '-' : 'Last Name'}
                    disabled={isView ? true : false}
                    className="h-8 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    defaultValue={editDef?.defLast || ""}
                    {...register("defLast")}
                  />
                  {errors.defLast?.message && (
                    <small className="text-red-500">
                      {errors.defLast.message}
                    </small>
                  )}
                </div>
                <div>
                  <Label htmlFor="Firstname" className="text-[0.7rem] font-semibold text-gray-600">
                    First Name
                  </Label>
                  <Input
                    id="Firstname"
                    placeholder={isView ? '-' : 'First Name'}
                    className="h-8 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                    disabled={isView ? true : false}
                    {...register("defFirst")}
                  />
                  {errors.defFirst?.message && (
                    <small className="text-red-500">
                      {errors.defFirst.message}
                    </small>
                  )}
                </div>
                <div>
                  <Label htmlFor="middleName" className="text-[0.7rem] font-semibold text-gray-600">
                    Middle Name
                  </Label>
                  <Input
                    id="middleName"
                    placeholder={isView ? '-' : 'Middle name'}
                    disabled={isView ? true : false}
                    defaultValue={editDef?.defMiddle || ""}
                    className="h-8 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                    {...register("defMiddle")}
                  />
                </div>
              </div>
              <div className="flex mt-1.5">
                <div>
                  <Label htmlFor="birthDate" className="text-[0.7rem] font-semibold text-gray-600">
                    Birth Date
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
                          disabled={isView ? true : false}
                          variant={"outline"}
                          className={cn(
                            "h-8 w-[150px] md:w-[185px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text",
                            !birthDate && "text-muted-foreground"
                          )}
                        >
                          {moment(birthDate).isValid() ? (
                            <>
                            <div className="flex">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {convertToUTCDate(birthDate)}
                            </div>
                              {
                                isView ?
                              <></> :
                              <div className="">
                              <Icons.close className="h-4 w-4" onClick={()=>{
                                setBirthDate(null)
                              }}/>
                              </div>
                              }
                            </>
                          
                          ) : (
                            isView ? (
                              "-"
                            ) : (
                              <div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>Pick a date</span>
                              </div>
                            )
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
                            setBirthDate(e)
                            setValue("defBirthdate", String(dateStr))
                            setDateIsOpen(false)
                          }}
                          value={birthDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="mx-2">
                  <Label htmlFor="age" className="text-[0.7rem] font-semibold text-gray-600">
                    Age
                  </Label>
                  <div className="flex items-center">
                    {!birthDate ? (
                      <Input
                        id="age"
                        disabled={isView ? true : false}
                        className="h-8 w-[40px] md:w-[50px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                      />
                    ) : (
                      <Input
                        id="age"
                        className="h-8 w-[40px] md:w-[50px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                        disabled={isView ? true : false}
                        value={birthDate ? calculateAge(birthDate) : ""}
                      />
                    )}

                    <Checkbox
                      id="approximate"
                      checked={birthApprox}
                      disabled={isView ? true : false}
                      className="mx-2 items-center border-slate-600 text-xs  disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                      onCheckedChange={(e: any) => {
                        setValue("defDOBapprox", e)
                        setBirthApprox(e)
                      }}
                    />
                    <Label htmlFor="approximate" className="text-xs">Approximate</Label>
                  </div>
                </div>
              </div>
              <div className="mt-1.5">
                <Label htmlFor="nickName" className="text-[0.7rem] font-semibold text-gray-600">
                  Nick Name
                </Label>
                <Input
                  id="nickName"
                  placeholder={isView ? '-' : 'Nick Name'}
                  disabled={isView ? true : false}
                  defaultValue={
                    editDef?.defNickname ? editDef?.defNickname : ""
                  }
                  className="h-8 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                  {...register("defNickname")}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <div className="w-full">
                  <Label
                    htmlFor="birthState"
                    className="text-[0.7rem] font-semibold text-gray-600"
                  >
                    Birth State
                  </Label>
                  <AddressSelect
                    disabled={isView ? true : false}
                    category={"mexicoStatesAndCities"}
                    placeholdername={isView ? "-" : "Select state"}
                    defultselect={birthState}
                    selectedValue={setBirthStateValue}
                    wPage={190}
                    className={isView ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:cursor-text disabled:py-0 select-custom" : "w-36 md:w-[190px]"}
                  />
                  <Input
                    id="birthState"
                    type="hidden"
                    {...register("defMexicanBirthState")}
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="sex" className="text-[0.7rem] font-semibold text-gray-600">
                    Sex
                  </Label>
                  <Select
                    disabled={isView ? true : false}
                    value={gender}
                    onValueChange={(e) => {
                      setValue("defSex", e)
                      setGender(e)
                    }}
                  >
                    <SelectTrigger id="sex" className="h-8 w-36 md:w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text select-custom">
                      <SelectValue placeholder={isView ? '-' : 'Sex'} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 ">
                      <SelectItem value="" className="text-xs">
                        Select Option
                      </SelectItem>
                      <SelectItem value="Male" className="text-xs">
                        Male
                      </SelectItem>
                      <SelectItem value="Female" className="text-xs">
                        Female
                      </SelectItem>
                      <SelectItem value="Other" className="text-xs">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="w-full mt-1.5">
                <div className="my-3 flex items-center justify-between ">
                  <div>
                    <span className=" text-xs font-bold">Alias Name</span>
                  </div>
                  <div>
                    {!isView && (
                      <Icons.add
                        onClick={() => {
                          let addAlias = {
                            aliasFirst: "",
                            aliasLast: "",
                            aliasMiddle: "",
                          }
                          let newAlias = [...aliasData, addAlias]
                          setAliasData(newAlias)
                        }}
                        className="m-1 h-4 w-4 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
                <div className="container-xl border-t-2 border-dashed p-0 ">
                  {aliasData &&
                    aliasData?.map((map_alias: any, i: any) => {
                      if (aliasData[i] && typeof aliasData[i] == "object") {
                        return (
                          <div
                            key={i}
                            className="my-2"
                          >
                            <div className="float-right">
                              {!isView && (
                                <Icons.close
                                  onClick={() => {
                                    let newData: any = JSON.parse(
                                      JSON.stringify(aliasData)
                                    )
                                    if (newData[i]) {
                                      let deleteItem: any = JSON.parse(
                                        JSON.stringify(newData[i])
                                      )
                                      setAliasDeleteData([
                                        ...aliasDeleteData,
                                        deleteItem,
                                      ])
                                    }
                                    delete newData[i]
                                    setAliasData(newData)
                                  }}
                                  className="m-1 h-4 w-4  cursor-pointer"
                                />
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                              <div className="col-span-1 md:col-span-2">
                                <Label
                                  htmlFor="lastName"
                                  className="text-[0.7rem] font-semibold text-gray-600"
                                >
                                  Last Name
                                </Label>
                                <Input
                                  id="lastName"
                                  placeholder={isView ? "-" : "Last name"}
                                  disabled={isView ? true : false}
                                  onChange={(e) => {
                                    let Value = e.target.value
                                    let newAlias = [...aliasData]
                                    if (typeof newAlias[i] == "object") {
                                      newAlias[i]["aliasLast"] = Value
                                      setAliasData(newAlias)
                                    }
                                  }}
                                  defaultValue={aliasData[i]["aliasLast"]}
                                  className="h-8 text-xs w-48 md:w-[378px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                                />
                              </div>
                              <div className="">
                                <Label
                                  htmlFor="FirstName"
                                  className="text-[0.7rem] font-semibold text-gray-600"
                                >
                                  First Name
                                </Label>
                                <Input
                                  id="FirstName"
                                  placeholder={isView ? "-" : "First name"}
                                  disabled={isView ? true : false}
                                  className="h-8 text-xs w-48 md:w-[185px]  disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                                  defaultValue={aliasData[i]["aliasFirst"]}
                                  onChange={(e) => {
                                    let Value = e.target.value
                                    let newAlias = [...aliasData]
                                    if (typeof newAlias[i] == "object") {
                                      newAlias[i]["aliasFirst"] = Value
                                      setAliasData(newAlias)
                                    }
                                  }}
                                />
                              </div>
                              <div className="mx-0 md:mx-3">
                                <Label
                                  htmlFor="MiddleName"
                                  className="text-[0.7rem] font-semibold text-gray-600"
                                >
                                  Middle Name
                                </Label>
                                <Input
                                  id="MiddleName"
                                  placeholder={isView ? "-" : "Middle name"}
                                  disabled={isView ? true : false}
                                  onChange={(e) => {
                                    let Value = e.target.value
                                    let newAlias = [...aliasData]
                                    if (typeof newAlias[i] == "object") {
                                      newAlias[i]["aliasMiddle"] = Value
                                      setAliasData(newAlias)
                                    }
                                  }}
                                  defaultValue={aliasData[i]["aliasMiddle"]}
                                  className="h-8 text-xs w-48 md:w-[185px]  disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                                />
                              </div>
                            </div>
                            <div className="border-t-2 border-dashed p-0 my-4" />
                          </div>
                        )
                      }
                    })}
                </div>
              </div>
            </div>
            <div className="w-full mt-4">
              <h4 className="mt-2 text-sm font-bold mb-2"><Icons.PiInfo /> Defendant Information</h4>
              <div className="flex flex-row">
                <div className="">
                  <div className="my-2 w-[190px]">
                    <div>
                      <h4 className="text-[0.7rem] font-semibold text-gray-600">Charged State</h4>{" "}
                    </div>
                    <div>
                      <AddressSelect
                        disabled={isView ? true : false}
                        country={"USA"}
                        category={"usStatesAndCities"}
                        placeholdername={isView ? "-" : "Select state"}
                        defultselect={state}
                        selectedValue={setChargedStateValue}
                        wPage={190}
                        className={isView ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:cursor-text disabled:py-0 select-custom" : ""}
                      />
                    </div>
                  </div>

                  <div className="my-3">
                    <h4 className="text-[0.7rem] font-semibold text-gray-600">Charged County</h4>
                    <AddressSelect
                      disabled={isView ? true : false}
                      category={"county"}
                      placeholdername={isView ? "-" : "Select County"}
                      state={state}
                      defultselect={city}
                      selectedValue={setChargedCountyValue}
                      wPage={190}
                      className={isView ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:cursor-text disabled:py-0 select-custom" : ""}
                    />
                  </div>
                </div>
                <div className="flex mx-5 mt-[3.5rem] md:mt-[4.5rem]">
                  <RadioGroup
                    disabled={isView ? true : false}
                    value={federalValue}
                    className="flex flex-wrap"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        id="option-one"
                        value="State"
                        onClick={() => {
                          SetItWorks(false)
                          setValue("defIsFederal", false)
                          setFederalValue("State")
                        }}
                        className="border-slate-600"
                      />
                      <Label htmlFor="option-one" className="text-xs">State</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        id="option-two"
                        value="Federal"
                        onClick={() => {
                          SetItWorks(true)
                          setValue("defIsFederal", true)
                          setFederalValue("Federal")
                        }}
                        className="border-slate-600"
                      />
                      <Label htmlFor="option-two" className="text-xs">Federal</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="flex flex-col mb-2">
                {itWorks && federalValue == "Federal" ? (
                  <>
                    <Label htmlFor="district" className="text-[0.7rem] font-semibold text-gray-600">District Court</Label>
                    <ComboboxCourts
                      selectedValue={selectCourt}
                      defultselect={federalDistrict}
                      disabled={isView ? true : false}
                    />

                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="grid grid-cols-1">
                <div className="mb-3">
                  <Label htmlFor="Date-of-arrest" className="text-[0.7rem] font-semibold text-gray-600">
                    Date of arrest
                  </Label>
                  <div>
                    <Popover
                      open={arrestDateofIsOpen}
                      onOpenChange={(e) => {
                        setArrestDateIsOpen(e)
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          disabled={isView ? true : false}
                          variant={"outline"}
                          className={cn(
                            "h-8 w-[270px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text",
                            !dateOfArrest && "text-muted-foreground"
                          )}>
                          {dateOfArrest && moment(dateOfArrest).isValid() ? (
                            <>
                            <div className="flex">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {convertToUTCDate(dateOfArrest)}
                            </div>
                              {
                                isView ? <></> :
                              
                              <div className="">
                                <Icons.close className="h-4 w-4" onClick={
                                  (()=>{setDateOfArrest(null)})
                                }/>
                              </div>
                              }
                            </>
                          ) : (
                            isView ? (
                              "-"
                            ) : (
                              <div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>Pick a date</span>
                              </div>
                            )
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
                            setDateOfArrest(dateStr)
                            // setValue("defBirthdate", String(dateStr))
                            setValue("defDateArrest", dateStr)
                            setDateIsOpen(false)
                          }}
                          value={dateOfArrest}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className=" col-span-2">
                  <h4 className="text-[0.7rem] font-semibold text-gray-600">Assigned Consulate</h4>
                  <Input
                    disabled={true}
                    value={editDef?.asssignConsulate ? editDef?.asssignConsulate : "-"}
                    className="h-8 text-xs w-[378px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 my-3">
                  <h4 className="text-[0.7rem] font-semibold text-gray-600">Prison</h4>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={isView ? true : false}
                        aria-expanded={open}
                        className="h-8 w-[270px] font-normal select-custom justify-between whitespace-nowrap text-xs  disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                      >
                        {isView && !selectPrisonValue
                          ? "-"
                          : (selectPrisonValue
                            ? prisonNameList.find(
                              (framework: any) =>
                                framework.id == selectPrisonValue
                            )?.prisonName
                            : "Select Prison")}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0">
                      <Command className="text-xs dark:bg-slate-900">
                        <CommandInput
                          placeholder="Prison Name"
                          className="h-8 text-xs"
                        />
                        <CommandEmpty>No Prison Found</CommandEmpty>
                        <CommandGroup className="thin-scrollbar h-[150px] overflow-y-scroll text-xs dark:bg-slate-900">
                          {prisonNameList.map((framework: any) => (
                            <CommandItem
                              key={framework.id}
                              value={framework}
                              className="whitespace-nowrap text-xs"
                              onSelect={(currentValue) => {
                                setValue("defPrisonID", framework.id)
                                setSelectPrisonValue(framework.id)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectPrisonValue === framework.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {framework?.prisonName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="ml-9 my-1">
                  <Label htmlFor="prison-id" className="text-[0.7rem] font-semibold text-gray-600">Prison ID</Label>
                  <Input id="prison-id" className="w-2/3  disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text" value={selectPrisonValue} disabled />
                </div>
              </div>
              <hr className="my-3" />
            </div>
            <div className="container-sm">
              <h4 className="mt-4 text-sm font-bold mb-2">
                <Icons.PiGraduationCap />  Language, Education and Employment
              </h4>
              <div className="grid grid-cols-2 mb-3">
                <div>
                  <div >
                    <div className="flex flex-row mt-3 ml-[138px]">
                      <span className="mx-2 text-xs">English</span>
                      <span className="mx-9 text-xs">Spanish</span>
                    </div>
                    <div className="flex flex-row mt-3">
                      <span className=" flex  text-xs whitespace-nowrap">Speaks </span>
                      <div className="ml-[6.5rem]">
                        <Checkbox
                          checked={speakEng}
                          disabled={isView ? true : false}
                          onCheckedChange={(e: any) => {
                            console.log("new", e)
                            setValue("defSpeakEnglish", String(e))
                            setSpeakEng(e)
                          }}
                          className="border-slate-600 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                        />
                      </div>
                      <div className="mx-[4.5rem]">
                        <Checkbox
                          checked={speakSpanish}
                          disabled={isView ? true : false}
                          defaultChecked={
                            editDef?.defSpeakSpanish == "Yes" ? true : false
                          }
                          onCheckedChange={(e: any) => {
                            console.log("new", e)
                            setValue("defSpeakSpanish", String(e))
                            setSpeakSpanish(e)
                          }}
                          className="border-slate-600 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row items-center mt-2 ">
                      <span className="flex text-xs whitespace-nowrap">Literate </span>
                      <div className="flex ml-[103px]">
                        <Checkbox
                          checked={literateEng}
                          disabled={isView ? true : false}
                          onCheckedChange={(e: any) => {
                            console.log("new", e)
                            setValue("defLiterateEnglish", String(e))
                            setLiterateEng(e)
                          }}
                          className="border-slate-600  disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                        />
                      </div>
                      <div className=" flex mx-[71px]">
                        <Checkbox
                          checked={literateSpanish}
                          disabled={isView ? true : false}
                          onCheckedChange={(e: any) => {
                            setValue("defLiterateSpanish", String(e))
                            setLiterateSpanish(e)
                          }}
                          className="border-slate-600  disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                        />
                      </div>
                    </div>
                    <div className="mt-4 my-2 flex items-center">
                      <Checkbox
                        checked={otherLang}
                        disabled={isView ? true : false}
                        onCheckedChange={(e: any) => {
                          console.log("new", e)
                          setValue("defSpeakOtherLanguage", String(e))
                          setOtherLang(e)
                        }}
                        className="border-slate-600 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                      />
                      <span className="mx-2 text-center text-xs">
                        Speaks other languages
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="my-1">
                  <Label
                    htmlFor="literacyandlanguagenotes"
                    className="text-[0.7rem] font-semibold text-gray-600">
                    Literacy and Language Notes
                  </Label>
                  <Textarea
                    disabled={isView ? true : false}
                    id="literacyandlanguagenotes"
                    defaultValue={editDef?.defLiteracyNotes || ""}
                    placeholder={isView ? "-" : "Type here..."}
                    className="w-full text-xs disabled:resize-none disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                    {...register("defLiteracyNotes")}
                  ></Textarea>
                </div>
                <div className="mt-2">
                  <Label
                    htmlFor="totalYearSofEducation"
                    className="text-[0.7rem] font-semibold text-gray-600">
                    Total years of education
                  </Label>
                  <Select
                    value={schoolYearsTotal}
                    disabled={isView ? true : false}
                    onValueChange={(e) => {
                      setValue("defSchoolYearsTotal", e)
                      setSchoolYearsTotal(e)
                    }}
                  >
                    <SelectTrigger
                      id="totalYearSofEducation"
                      className="h-8 w-full text-xs disabled:border-0 select-custom disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                    >
                      <SelectValue placeholder={isView ? "-" : "years of education"} />
                    </SelectTrigger>
                    <SelectContent className="h-[150px] dark:bg-slate-900">
                      <SelectItem value="" className="text-xs">
                        Select Option
                      </SelectItem>
                      {Array.from({ length: 20 }, (_, index) => (
                        <SelectItem
                          key={index + 1}
                          value={(index + 1).toString()}
                          className="text-xs"
                        >
                          {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="my-3 flex items-center justify-between">
                <h4 className="mt-2 text-sm font-bold mb-2">&nbsp;</h4>
                  {/* <div>
                    <span className="px-3 text-xs font-bold">Schooling</span>
                  </div> */}
                  <div>
                    {!isView && (
                      <Icons.add
                        onClick={() => {
                          let AddSchool = {
                            schoolType: "",
                            schoolName: "",
                            schoolYearStarted: null,
                            schoolYearLeft: null,
                            schoolAddress: "",
                            schoolCountry: "",
                            schoolState: "",
                            schoolCity: "",
                          }
                          let newSchool = [...schoolData, AddSchool]
                          setSchoolData(newSchool)
                        }}
                        className="m-1 h-4 w-4  cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="container-sm border-t-2 border-dashed">
              {schoolData &&
                schoolData?.map((map_school: any, i: any) => {
                  if (schoolData[i] && typeof schoolData[i] === "object") {
                    return (
                      <div className="mb-2">
                        <div className="float-right">
                          {!isView && (
                            <Icons.close
                              onClick={() => {
                                let newData: any = JSON.parse(
                                  JSON.stringify(schoolData)
                                )
                                if (newData[i]) {
                                  let deleteItem: any = JSON.parse(
                                    JSON.stringify(newData[i])
                                  )
                                  setSchoolDeleteData([
                                    ...schoolDeleteData,
                                    deleteItem,
                                  ])
                                }
                                delete newData[i]
                                setSchoolData(newData)
                              }}
                              className="m-1 h-4 w-4  cursor-pointer"
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 my-2">
                          <div >
                            <div className="my-2">
                              <Label
                                htmlFor="Type"
                                className="text-[0.7rem] font-semibold text-gray-600"
                              >
                                Type of education
                              </Label>
                              <Select
                                disabled={isView ? true : false}
                                value={schoolData[i]["schoolType"]}
                                onValueChange={(value: any) => {
                                  let newSchool = [...schoolData]
                                    if (typeof newSchool[i] == "object") {
                                      newSchool[i]["schoolType"] = String(value)
                                      setSchoolData(newSchool)
                                    }
                                 }}
                              >
                                <SelectTrigger className="h-8 w-[120px] md:w-[175px] text-xs select-custom disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text">
                                  <SelectValue placeholder={isView ? "-" : "Select Type"} />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-slate-900">
                                  <SelectGroup>
                                    <SelectItem value="" className="text-xs">
                                      Select Type
                                    </SelectItem>
                                    {schoolTypeList &&
                                      schoolTypeList?.map(
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
                            <div className="my-2">
                              <Label
                                htmlFor="country"
                                className="text-[0.7rem] font-semibold text-gray-600"
                              >
                                Country
                              </Label>
                              <Select
                                disabled={isView ? true : false}
                                value={schoolData[i]["schoolCountry"]}
                                onValueChange={(value: any) => {
                                  let newSchool = [...schoolData]
                                  if (typeof newSchool[i] == "object") {
                                    newSchool[i]["schoolCountry"] = value
                                    newSchool[i]["schoolState"] = ""
                                    newSchool[i]["schoolCity"] = ""
                                    setSchoolData(newSchool)
                                  }

                                  // setCountry(value)
                                  // setValue(
                                  //   "conCountry",
                                  // )
                                  // setState('')
                                  // setCity('')
                                }}
                              >
                                <SelectTrigger className="w-[120px] md:w-[175px] text-xs select-custom disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text">
                                  <SelectValue placeholder={isView ? "-" : "Select Country"} />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-slate-900">
                                  <SelectItem value="" className="text-xs">
                                    Select Country
                                  </SelectItem>
                                  <SelectItem value="USA" className="text-xs">
                                    USA
                                  </SelectItem>
                                  <SelectItem
                                    value="Mexico"
                                    className="text-xs"
                                  >
                                    Mexico
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="my-2">
                              <div>
                                <Label
                                  htmlFor="city"
                                  className="text-[0.7rem] font-semibold text-gray-600"
                                >
                                  City
                                </Label>
                              </div>
                              <div>
                                <AddressSelect
                                  category={"city"}
                                  country={
                                    map_school?.schoolCountry
                                      ? map_school?.schoolCountry
                                      : ""
                                  }
                                  state={
                                    map_school?.schoolState
                                      ? map_school?.schoolState
                                      : ""
                                  }
                                  defultselect={map_school?.schoolCity}
                                  placeholdername={isView ? "-" : "Select city"}
                                  selectedValue={(value: any) => {
                                    let newSchool = [...schoolData]
                                    if (typeof newSchool[i] == "object") {
                                      newSchool[i]["schoolCity"] = value
                                      setSchoolData(newSchool)
                                    }
                                  }}
                                  wPage={175}
                                  disabled={isView ? true : false}
                                  className={isView ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:cursor-text disabled:py-0 select-custom" : "w-[120px] md:w-[175px]"}
                                />
                              </div>
                            </div>

                            <div>
                              <Label
                                htmlFor="startyear"
                                className="text-[0.7rem] font-semibold text-gray-600"
                              >
                                Start Year
                              </Label>
                              <Input
                                id="startyear"
                                placeholder={isView ? "-" : "Start Year"}
                                className="text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                                disabled={isView ? true : false}
                                onChange={(e) => {
                                  let Value: any = e.target.value
                                  let newSchool = [...schoolData]
                                  if (
                                    typeof newSchool[i] == "object" &&
                                    !isNaN(Value)
                                  ) {
                                    newSchool[i]["schoolYearStarted"] = Value
                                    setSchoolData(newSchool)
                                  }
                                }}
                                defaultValue={
                                  map_school?.schoolYearStarted || ""
                                }
                                onKeyDown={(event) =>
                                  keyDownLengthValidation(event, 4)
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <div className="my-2">
                              <Label
                                htmlFor="schoolname"
                                className="text-[0.7rem] font-semibold text-gray-600"
                              >
                                School Name
                              </Label>
                              <Input
                                id="schoolname"
                                disabled={isView ? true : false}
                                placeholder={isView ? "-" : "School Name"}
                                className="text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                                onChange={(e) => {
                                  let Value = e.target.value
                                  let newSchool = [...schoolData]
                                  if (typeof newSchool[i] == "object") {
                                    newSchool[i]["schoolName"] = Value
                                    setSchoolData(newSchool)
                                  }
                                }}
                                defaultValue={map_school?.schoolName || ""}
                              />
                            </div>
                            <div className="w-[165px]">
                              <div>
                                <Label
                                  htmlFor="state"
                                  className="text-[0.7rem] font-semibold text-gray-600"
                                >
                                  State
                                </Label>
                              </div>
                              <div>
                                <AddressSelect
                                  category={
                                    map_school?.schoolCountry == "Mexico"
                                      ? "mexicoStatesAndCities"
                                      : "usStatesAndCities"
                                  }
                                  country={
                                    map_school?.schoolCountry
                                      ? map_school?.schoolCountry
                                      : ""
                                  }
                                  placeholdername={isView ? "-" : "Select state"}
                                  defultselect={
                                    map_school?.schoolState
                                      ? map_school?.schoolState
                                      : ""
                                  }
                                  selectedValue={(value: any) => {
                                    let newSchool = [...schoolData]
                                    if (typeof newSchool[i] == "object") {
                                      newSchool[i]["schoolState"] = value
                                      newSchool[i]["schoolCity"] = ""
                                      setSchoolData(newSchool)
                                    }
                                  }}
                                  wPage={175}
                                  disabled={isView ? true : false}
                                  className={isView ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:cursor-text disabled:py-0 select-custom" : "w-[140px] md:w-[175px]"}
                                />
                              </div>
                            </div>
                            <div className="my-2">
                              <Label
                                htmlFor="address"
                                className="text-[0.7rem] font-semibold text-gray-600"
                              >
                                Address
                              </Label>
                              <Input
                                disabled={isView ? true : false}
                                id="address"
                                placeholder={isView ? "-" : "Address"}
                                className="text-xs  disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                                onChange={(e) => {
                                  let Value = e.target.value
                                  let newSchool = [...schoolData]
                                  if (typeof newSchool[i] == "object") {
                                    newSchool[i]["schoolAddress"] = Value
                                    setSchoolData(newSchool)
                                  }
                                }}
                                defaultValue={map_school?.schoolAddress || ""}
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="yearleft"
                                className="text-[0.7rem] font-semibold text-gray-600"
                              >
                                End Year
                              </Label>
                              <Input
                                id="yearleft"
                                disabled={isView ? true : false}
                                placeholder={isView ? "-" : "End Year"}
                                className="text-xs  disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                                onChange={(e) => {
                                  let Value: any = e.target.value
                                  let newSchool = [...schoolData]
                                  if (
                                    typeof newSchool[i] == "object" &&
                                    !isNaN(Value)
                                  ) {
                                    newSchool[i]["schoolYearLeft"] = Value
                                    setSchoolData(newSchool)
                                  }
                                }}
                                defaultValue={map_school?.schoolYearLeft || ""}
                                onKeyDown={(event) =>
                                  keyDownLengthValidation(event, 4)
                                }
                                onBlur={() => {
                                  const startYear = parseInt(
                                    map_school?.schoolYearStarted || 0
                                  )
                                  const endYear = parseInt(
                                    map_school?.schoolYearLeft || 0
                                  )
                                  if (
                                    startYear &&
                                    endYear &&
                                    endYear <= startYear
                                  ) {
                                    setValidationError(
                                      "End year should be greater than start year"
                                    )
                                    setIsSubmitDisable(true)
                                  } else {
                                    setValidationError("")
                                    setIsSubmitDisable(false)
                                  }
                                }}
                              />
                              {validationError && (
                                <span className="text-xs text-red-500">
                                  {validationError}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="border-t-2 border-dashed p-0 my-4" />
                      </div>
                    )
                  }
                })}
            </div>
            <div className="my-4">
              <Label
                htmlFor="Employmentnotes"
                className="text-[0.7rem] font-semibold text-gray-600"
              >
                Employment Notes
              </Label>
              <Textarea
                id="Employmentnotes"
                disabled={isView ? true : false}
                defaultValue={editDef?.defWorkNotes || ""}
                placeholder={isView ? "-" : "Type here..."}
                className="w-full text-xs disabled:resize-none disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                {...register("defWorkNotes")}
              ></Textarea>
            </div>

            <hr className="my-2" />
            <div className="container-sm">
              <div className="my-1 flex items-center justify-between ">
                <h4 className="mt-2 text-sm font-bold mb-2"><Icons.PiHospital />Mental Impairments</h4>
                <div>
                  {!isView && (
                    <Icons.add
                      onClick={() => {
                        let newImp = [
                          ...ImpairmentData,
                          {
                            impType: "",
                            impDeterminedBy: "",
                            impDoctor: "",
                            impDescription: "",
                            impDateDiagnosed: null,
                          },
                        ]
                        setImpairmentData(newImp)
                      }}
                      className="m-1 h-4 w-4  cursor-pointer"
                    />
                  )}
                </div>
              </div>
              <div className="my-2 flex items-center  cursor-pointer">
                <Checkbox
                  checked={hasImpairment}
                  disabled={isView ? true : false}
                  onCheckedChange={(e: any) => {
                    setValue("defHasImpairment", e)
                    setHasImpairment(e)
                  }}
                  className="border-slate-600 my-2  disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                />
                <span className="px-1 text-center text-xs">
                  Suspected intellectual disability
                </span>
              </div>
              <div className="container-sm border-t-2 border-dashed">
                {ImpairmentData &&
                  ImpairmentData?.map((imp_data: any, i: any) => {
                    if (
                      ImpairmentData[i] &&
                      typeof ImpairmentData[i] === "object"
                    ) {
                      return (
                        <div>
                          <div className="float-right">
                            {!isView && (
                              <Icons.close
                                onClick={() => {
                                  let newData: any = JSON.parse(
                                    JSON.stringify(ImpairmentData)
                                  )
                                  if (newData[i]) {
                                    let deleteItem: any = JSON.parse(
                                      JSON.stringify(newData[i])
                                    )
                                    setImpairmentDeleteData([
                                      ...ImpairmentDeleteData,
                                      deleteItem,
                                    ])
                                  }
                                  delete newData[i]
                                  setImpairmentData(newData)
                                }}
                                className="m-1 h-4 w-4  cursor-pointer"
                              />
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="my-2">
                              <Label
                                htmlFor="type"
                                className="text-[0.7rem] font-semibold text-gray-600"
                              >
                                Type
                              </Label>
                              <Select
                                value={ImpairmentData[i]["impType"]}
                                disabled={isView ? true : false}
                                onValueChange={(value: any) => {
                                    let newImp = [...ImpairmentData]
                                    if (typeof newImp[i] == "object") {
                                      newImp[i]["impType"] = value
                                      setImpairmentData(newImp)
                                    }
                                }}
                              >
                                <SelectTrigger className="h-8 w-full text-xs select-custom disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text">
                                  <SelectValue placeholder={isView ? "-" : "Select Type"} />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-slate-900">
                                  <SelectGroup>
                                    <SelectItem value="" className="text-xs">
                                      Select Type
                                    </SelectItem>
                                    {impTypeList &&
                                      impTypeList?.map(
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
                            <div className="my-2">
                              <Label
                                htmlFor="methodofdetermination"
                                className="text-[0.7rem] font-semibold text-gray-600"
                              >
                                Method of Determination
                              </Label>
                              <Input
                                id="methodofdetermination"
                                disabled={isView ? true : false}
                                className="text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text w-full md:w-[195px]"
                                placeholder={isView ? "-" : "Method of Determination"}
                                onChange={(e) => {
                                  let Value = e.target.value
                                  let newImp = [...ImpairmentData]
                                  if (typeof newImp[i] == "object") {
                                    newImp[i]["impDeterminedBy"] = Value
                                    setImpairmentData(newImp)
                                  }
                                }}
                                defaultValue={
                                  imp_data?.impDeterminedBy
                                    ? imp_data?.impDeterminedBy
                                    : ""
                                }
                              />
                            </div>
                            <div className="">
                              <Label
                                htmlFor="doctor"
                                className="text-[0.7rem] font-semibold text-gray-600"
                              >
                                Doctor
                              </Label>
                              <Input
                                id="doctor"
                                placeholder={isView ? "-" : "Doctor"}
                                className="text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                                disabled={isView ? true : false}
                                onChange={(e) => {
                                  let Value = e.target.value
                                  let newImp = [...ImpairmentData]
                                  if (typeof newImp[i] == "object") {
                                    newImp[i]["impDoctor"] = Value
                                    setImpairmentData(newImp)
                                  }
                                }}
                                defaultValue={
                                  imp_data?.impDoctor ? imp_data?.impDoctor : ""
                                }
                              />
                            </div>
                            <div className="my-2">
                              <h4 className="text-[0.7rem] font-semibold text-gray-600">Date</h4>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    disabled={isView ? true : false}
                                    variant={"outline"}
                                    className={cn(
                                      "h-8 w-full md:w-[195px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text",
                                      !imp_data?.impDateDiagnosed &&
                                      "text-muted-foreground"
                                    )}
                                  >
                                    {imp_data?.impDateDiagnosed && moment(imp_data?.impDateDiagnosed).isValid() ? (
                                      <>
                                      <div className="flex">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {convertToUTCDate(imp_data?.impDateDiagnosed)}
                                      </div>
                                        {isView ? <></> :
                                        <div className="h-4 w-4">
                                          <Icons.close className="mr-2 h-4" 
                                        onClick={(()=>{ 
                                        let newImp = [...ImpairmentData]
                                        if (typeof newImp[i] == "object") {
                                          newImp[i]["impDateDiagnosed"] = null
                                          setImpairmentData(newImp)
                                        }})}/>
                                        </div>
                                        }
                                      </>
                                    ) : (
                                      isView ? "-" : <div className="flex">
                                        <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                      </div>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="thin-scrollbar m-1 w-[250px] overflow-y-auto p-0 text-xs text-black">
                                  <Calendar
                                    defaultView="century"
                                    onChange={(e: any) => {
                                      let dateObj = new Date(e)
                                      let day = dateObj.getDate()
                                      let month = dateObj.getMonth() + 1
                                      let year = dateObj.getFullYear()
                                      let dateStr = `${month}/${day}/${year}`
                                      // setImpDateDiagnosed(e)
                                      if (
                                        typeof ImpairmentData[i] == "object"
                                      ) {
                                        let newImp = [...ImpairmentData]
                                        newImp[i]["impDateDiagnosed"] =
                                          String(dateStr)
                                        setImpairmentData(newImp)
                                      }
                                    }}
                                    defaultValue={
                                      imp_data?.impDateDiagnosed &&
                                        moment(
                                          imp_data?.impDateDiagnosed
                                        ).isValid()
                                        ?
                                        convertToUTCDate(imp_data?.impDateDiagnosed)
                                        : null
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="flex mb-5">
                              <div>
                                <Label
                                  htmlFor="description"
                                  className="text-[0.7rem] font-semibold text-gray-600"
                                >
                                  Description
                                </Label>
                                <Textarea
                                  id="description"
                                  disabled={isView ? true : false}
                                  placeholder={isView ? "-" : "Type here..."}
                                  className="w-[300px] md:w-[375px] text-xs disabled:resize-none disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                                  onChange={(e) => {
                                    let Value = e.target.value
                                    let newImp = [...ImpairmentData]
                                    if (typeof newImp[i] == "object") {
                                      newImp[i]["impDescription"] = Value
                                      setImpairmentData(newImp)
                                    }
                                  }}
                                  defaultValue={
                                    imp_data?.impDescription
                                      ? imp_data?.impDescription
                                      : ""
                                  }
                                ></Textarea>
                              </div>
                            </div>
                          </div>
                          <div className="border-t-2 border-dashed p-0 my-2" />
                        </div>
                      )
                    }
                  })}
              </div>

              <div className="">
                <Label
                  htmlFor="notesonthisdefendant"
                  className="text-[0.7rem] font-semibold text-gray-600">
                  Notes on this Defendant
                </Label>
                <Textarea
                  id="notesonthisdefendant"
                  disabled={isView ? true : false}
                  defaultValue={editDef?.defNotes || ""}
                  placeholder={isView ? "-" : "Type here..."}
                  className="w-full text-xs disabled:resize-none disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                  {...register("defNotes")}
                ></Textarea>
              </div>

              <div className="my-4 mt-3">
                <Label htmlFor="program attorney"
                  // className="text-[0.7rem] font-semibold text-gray-600"
                  className="mt-2 text-sm font-bold mb-2"
                  >
                  Program Attorney
                </Label>
                <Input
                  id="programAttorney"
                  placeholder={isView ? "-" : "Program Attorney"}
                  disabled={isView ? true : false}
                  className="text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                  defaultValue={editDef?.defProgramAttorney}
                  {...register("defProgramAttorney")}
                />
              </div>
              <div className=" col-span-2">
                  <h4
                   className="mt-2 text-sm font-bold mb-2"
                  //  className="text-[0.7rem] font-semibold text-gray-600"
                  >Case Status</h4>
                  <Input
                    disabled={true}
                    value={editDef?.linkStatus ? editDef?.linkStatus : "-"}
                    className="h-8 text-xs w-[378px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text"
                  />
              </div>

              <hr className="my-2" />
              <div className="my-1">
                <div className="my-1 flex items-center justify-between">
                  <h4 className="mt-2 text-sm font-bold mb-2"><Icons.PiSealWarning />MCLAP level of involvement</h4>
                </div>

                {/* <Label
                  htmlFor="totalYearSofEducation"
                  className="text-sm font-bold">

                </Label> */}
                <Select
                  value={levelOfInvolvement}
                  disabled={isView ? true : false}
                  onValueChange={(e) => {
                    setValue("defLevelInvolvement", e)
                    setLevelOfInvolvement(e)
                  }}
                >
                  <SelectTrigger
                    id="totalYearSofEducation"
                    className="h-8 w-full text-xs select-custom  disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0  disabled:cursor-text">
                    <SelectValue placeholder={isView ? "-" : "years of education"} >
                      <span className={`${levelOfInvolvement ? "text-xs" : "text-gray-500"}`}>
                      {isView ? (levelOfInvolvement || "-") : (levelOfInvolvement || "Select Type")}
                      </span></SelectValue>
                  </SelectTrigger>
                  <SelectContent className="h-[150px] dark:bg-slate-900">
                    <SelectItem value="" className="text-xs">
                      Select Option
                    </SelectItem>
                    {Array.from({ length: 4 }, (_, index) => (
                      <SelectItem
                        key={index + 1}
                        value={(index + 1).toString()}
                        className="text-xs"
                      >
                        {index + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {(isAdd || isEdit) && (
            <div className="mt-1.5 flex w-full justify-between border-t border-inherit bg-inherit">
              <div className="">
                {" "}
                <Link
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "mx-3 mt-1 rounded-lg px-3 py-2 text-xs hover:bg-transparent xl:py-2"
                  )}
                  href={`/viewdefendant`}
                  onClick={(e) => {
                    if (searchParams?.get("defendantId")) {
                      e.preventDefault()
                      resetInitialState()
                      reset()
                      getDefendantById(searchParams?.get("defendantId"))
                    }
                  }}
                >
                  Discard
                </Link>
              </div>
              <div className="mr-2 mt-1">
                {" "}
                <Button
                  className="mx-3 my-1 h-8 bg-transparent py-2 text-xs"
                  type="submit"
                  variant="outline"
                  disabled={isSubmitDisable}
                >
                  <Icons.save className="w-4 h-4 mr-0.5" /> Save
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default function Defendants() {
  const searchParams = useSearchParams()
  const [codesData, setCodesData] = React.useState([])
  const [editobj, setEditObj] = React.useState<any>("")
  const [editEnable, setEditEnable] = React.useState(true)
  const [deleteids, setDeleteIds] = React.useState<any>([])
  const [deleteEnable, setDeleteEnable] = React.useState(true)
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const [isOpen, setIsOpen] = React.useState(false)
  const [timer, setTimer] = React.useState(null)
  const [codeType, setCodeType] = React.useState([])
  const [showCardForm, setShowCardForm] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState(
    searchParams?.get("active") || "contacts"
  )

  const toggleCardForm = () => {
    setShowCardForm(!showCardForm)
  }

  //filter search
  const filterSearch = async (Value: any) => {
    let url = `${baseURL}/v1/codes?filter=${Value}&page=10&limit=100`
    const response = await axiosInstance.get(url)
    let listData = response?.data?.data?.rows ? response?.data?.data?.rows : []
    let modified = listData.map((map_ele: any) => {
      map_ele.check = false
      return map_ele
    })
    setCodesData(modified)
    setDeleteEnable(true)
    setEditEnable(true)
    setDeleteIds([])
    setEditObj("")
  }
  const [filterValue, setFilterValue] = React.useState<any>("")
  const handleSearch = async (event: any) => {
    let Value = event.target.value
    setFilterValue(Value)
    clearTimeout(timer)
    const newTimer = setTimeout(() => {
      if (Value) {
        filterSearch(Value)
      } else {
        fetchData()
      }
    }, 500)
    setTimer(newTimer)
  }
  const selectAllChecked = (value: any) => {
    try {
      if (value) {
        let IDs: any = []
        let collectionBoxes = document.querySelectorAll(".mycheckbox")
        collectionBoxes.forEach((checkbox: any) => {
          checkbox.checked = true
          if (checkbox.id) {
            IDs.push(checkbox.id)
          }
        })
        setDeleteEnable(false)
        setEditEnable(true)
        setDeleteIds(IDs)
        setEditObj("")
      } else {
        let collectionBoxes = document.querySelectorAll(".mycheckbox")
        collectionBoxes.forEach((checkbox: any) => {
          checkbox.checked = false
        })
        setDeleteEnable(true)
        setEditEnable(true)
        setDeleteIds([])
        setEditObj("")
      }
    } catch (err) { }
  }
  const CodesTypeData = async () => {
    try {
      const response = await axiosInstance.get(baseURL + "/v1/codes/codeType")
      const stateValue = response?.data?.data
      setCodeType(stateValue)
      if (
        stateValue !== null &&
        stateValue !== undefined &&
        stateValue.length > 0
      ) {
        sessionStorage.setItem("CodeTypeData", JSON.stringify(stateValue))
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }
  const fetchData = async () => {
    const response = await axiosInstance.get(`${baseURL}/v1/codes`)
    let data = response?.data?.data?.rows ? response?.data?.data?.rows : []
    setCodesData(data)
  }
  const deleteCodesData = async (id: any) => {
    try {
      if (!id) {
        return
      }
      let url = `${baseURL}/v1/codes/${id}`
      const response = await axiosInstance.delete(url)
      toast({
        variant: "default",
        description: "Codes Deleted Successfully",
        style: {
          background: "#03C03C",
        },
      })
      // fetchData(currentPage,limitPage)
      // setIsOpen(false);
      fetchData()
    } catch (error: any) {
      console.log("Error deleting item:", error.message)
    }
  }
  React.useEffect(() => {
    CodesTypeData()
    fetchData()
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.has("defendantId")) {
      if (!queryParams.has("active")) {
        queryParams.set("defendantId", String(queryParams.get("defendantId")))
        queryParams.set("active", "contacts")
        const newUrl = `${window.location.pathname}?${queryParams.toString()}`
        window.history.pushState({}, "", newUrl)
      }
    }
  }, [])

  React.useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    queryParams.set("active", activeTab)
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`
    window.history.pushState({}, "", newUrl)
  }, [activeTab])

  const [isTheme, setIsTheme] = React.useState(false)

  const showCards = (cardVisibilty:any)=> {
    setShowCardForm(cardVisibilty)
  }

  const [refreshApi, setRefreshApi] = React.useState<any>('');
  return (
    <div className="overscroll-y-none px-2 pb-1 pt-2">
      <div className="dark-container h-[calc(100vh-4.5rem)] rounded-lg border bg-white p-2">
        <div className="flex h-[calc(100vh-5.6rem)] ">
          {showCardForm && <CardWithForm showcards={showCards} refreshApi = {refreshApi} />}
          <div
            className={`thin-scrollbar ${showCardForm
              ? "w-3/4 transition-all ease-in-out hidden md:block"
              : "w-full transition-all duration-300 ease-in-out"
              } h-[calc(100vh-6.6rem)]`}
          >
            <div className="bg-transparent">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="border-t-none sticky top-0 z-10 flex justify-between border-b bg-white dark:bg-inherit">
                  <TabsList className="bg-white dark:bg-inherit h-9 p-0">
                    {showCardForm && (
                      <Button
                        variant="ghost"
                        className="flex h-8 items-center rounded-lg bg-transparent hover:bg-transparent hover:text-inherit px-2 py-1 text-xs xl:py-1.5 ml-0.5"
                        onClick={toggleCardForm}
                      ><Icons.PiLeftArrow /></Button>
                    )}
                    {!showCardForm && (
                      <Button
                        variant="ghost"
                        className="flex h-8 items-center rounded-lg bg-transparent hover:bg-transparent hover:text-inherit px-2 py-1 text-xs xl:py-1.5"
                        onClick={toggleCardForm}
                      ><Icons.PiRightArrow /></Button>
                    )}
                    <TabsTrigger
                      value="contacts"
                      className={`border-transparent text-xs decoration-red-500 decoration-2 ${activeTab === "contacts" ? "font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""}  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      disabled={searchParams?.get("defendantId") ? false : true}
                    >
                      Contacts
                    </TabsTrigger>
                    <TabsTrigger
                      value="case-information"
                      className={`border-none text-xs decoration-red-500 decoration-2 underline-offset-2 ${activeTab === "case-information" ? "  font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""} focus:shadow-none focus:outline-none dark:text-white`} disabled={searchParams?.get("defendantId") ? false : true}
                    >
                      Case Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="notes"
                      className={`border-none text-xs decoration-red-500 decoration-2 ${activeTab === "notes" ? " font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""}  focus:shadow-none focus:outline-none dark:text-white`}
                      disabled={searchParams?.get("defendantId") ? false : true}
                    >
                      Notes/Events
                    </TabsTrigger>
                  </TabsList>
                  <div className="mr-5 mt-2">
                    {!showCardForm && (
                      <p className="text-[0.7rem] text-gray-600">
                        Defendant ID : {searchParams?.get("defendantId")}{" "}
                      </p>
                    )}
                  </div>
                </div>
                <TabsContent value="contacts">
                  {searchParams?.get("defendantId") ? (
                    <DefendantContactPage
                      defendantId={searchParams?.get("defendantId")}
                      refreshAssignConsulate = {(e : any)=>{
                        setRefreshApi(e)
                      }}
                    />
                  ) : (
                    <p></p>
                  )}
                </TabsContent>
                <TabsContent value="case-information" className="text-center">
                  {searchParams?.get("defendantId") ? (
                    <DefendantCasesPage />
                  ) : (
                    <p></p>
                  )}
                </TabsContent>
                <TabsContent value="notes" className="text-center">
                  {searchParams?.get("defendantId") ? (
                    <DefendantNotesPage />
                  ) : (
                    <p></p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
