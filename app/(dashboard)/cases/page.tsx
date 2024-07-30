"use client"

import * as React from "react"
import { useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Label } from "@radix-ui/react-label"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns"
import {
  ArrowUpDown,
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
} from "lucide-react"
import moment from "moment"
import { getSession } from "next-auth/react"
import Calendar from "react-calendar"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { cn, convertToUTCDate } from "@/lib/utils"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toggle } from "@/components/ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import AddPrisonAlert from "@/components/lookup/addPrisonAlertDialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { CustomActionToast } from "@/components/utils/custom-action-toast"

import "react-calendar/dist/Calendar.css"
import { CaseFilterContext } from "@/context/caseFilterContext"

import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { CaseDialogFilter } from "@/components/cases/case-dialogFilter"
import { CoDefendantCombobox } from "@/components/cases/co-defendant-combobox"
import { CrimeTypeCombobox } from "@/components/cases/crimetype-combobox"
import { ComboboxCourts } from "@/components/cases/district-court-combobox."
import { AddressSelect } from "@/components/utils/states-cities-combobox"

export default function Case() {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const [isLoading, setIsLoading] = React.useState(true)
  const prisonButtonRef = useRef<HTMLButtonElement>(null)
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [viewRowData, setViewRowData] = React.useState(null)
  const [currentPage, setCurrentpage] = React.useState<number>(1)
  const [limitPage, setLimitPage] = React.useState<any>("25")
  const [totalPage, setTotalPage] = React.useState<number>(1)
  const [totalItems, setTotalItems] = React.useState<number>(0)
  const [timer, setTimer] = React.useState(null)
  const [editobj, setEditObj] = React.useState<any>(null)
  const [editEnable, setEditEnable] = React.useState(true)
  const [deleteEnable, setDeleteEnable] = React.useState(true)
  const [isOpen, setIsOpen] = React.useState(false)
  const [isOpen1, setIsOpen1] = React.useState(false)
  const [isTheme, setIsTheme] = React.useState(false)
  const [deleteids, setDeleteIds] = React.useState<any>([])
  const [caseDate, setCaseDate] = React.useState<any[]>([])
  const searchParams = useSearchParams()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [selectedRows, setSelectedRows] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const hiddenColumns = {
    caseTitle: false,
    linkCaseID: false,
    linkDefID: false,
    defLast: false,
    defFirst: false,
    defMiddle: false,
    defNickname: false,
    defBirthdate: false,
    defDOBapprox: false,
    defAge: false,
    aliasLast: false,
    aliasFirst: false,
    aliasMiddle: false,
    aliasnamemulti: false,
    defPrisonID: false,
    defMexicanBirthState: false,
    defSex: false,
    defSpeakSpanish: false,
    defSpeakEnglish: false,
    defLiterateSpanish: false,
    defLiterateEnglish: false,
    defSpeakOtherLanguage: false,
    defLiteracyNotes: false,
    defSchoolYearsTotal: false,
    schooltypemulti: false,
    schoolnamemulti: false,
    schoolcountrymulti: false,
    schooladdressmulti: false,
    schoolyearstartedmulti: false,
    schoolyearleftmulti: false,
    schoolcitymulti: false,
    schoolstatemulti: false,
    imptypemulti: false,
    impdeterminedbymulti: false,
    defNotes: false,
    defWorkNotes: false,
    impdocmulti: false,
    impdatediagnosedmulti: false,
    impdescmulti: false,
    defHasImpairment: false,
    defProgramAttorney: false,
    defLevelInvolvement: false,
    caseNumber: false,
    caseCrimeDescription: false,
    caseCaseSummary: false,
    caseCrimeDate: false,
    multicrimetypes: false,
    vicLast: false,
    vicFirst: false,
    vicMiddle: false,
    vicAge: false,
    vicSex: false,
    vicRace: false,
    victimsinfo: false,
    npdLast: false,
    npdFirst: false,
    npdMiddle: false,
    noprogdefnamemulti: false,
    nonprogdefnotesmulti: false,
    linkPleaBargainRefused: false,
    linkPleaBargainTermsOffered: false,
    mitThemeOther: false,
    // caseState: false,
    // caseCounty: false,
    // caseDistrict: false,
    multicodefnames: false,
    linkArrestDate: false,
    linkArrestPlace: false,
    linkState: false,
    linkCounty: false,
    linkCustody: false,
    linkDeathPenSought: false,
    linkDeathNoticed: false,
    linkDateDeathNoticed: false,
    linkPleaBargain: false,
    linkTrial: false,
    linkProceduralStatus: false,
    linkPleaBargainAccepted: false,
    multiaggravfactors: false,
    multimit: false,
    multimitnotes: false,
    pleadingnamesmulti: false,
    pleadingdatefiledmulti: false,
    pleadingnotesmulti: false,
    artDefRemembers: false,
    artDateNotified: false,
    artNotifiedByWhom: false,
    artFormFieldCons: false,
    artPoliceAware: false,
    artPoliceAwareWhen: false,
    artDefClaimedCitizenship: false,
    artWhenAdmittedMexNat: false,
    artOtherSources: false,
    artOtherSourcesExist: false,
    artBookingSheetStates: false,
    artImmigrationStatus: false,
    artINSHold: false,
    artSpanishFirstLang: false,
    artSpeakingIndianLang: false,
    artInterpInterrog: false,
    artInterrogEng: false,
    artInterrogSpan: false,
    artAdvised: false,
    artStatementB4Advised: false,
    artStatementUsedAtTrial: false,
    artDefStatedBornInMex: false,
    artStatementRecorded: false,
    artViolated: false,
    artAppellateRaised: false,
    artPostConRaised: false,
    artPostConFedRaised: false,
    artPostConSuccRaised: false,
    artDefNotNotified: false,
    artNeedInterpHearings: false,
    artInterpTrial: false,
    artNotes: false,
    artEvidence: false,
    ciDateNotified: false,
    ciNotified: false,
    ciNotifiedByWhom: false,
    ciNotifiedHow: false,
    ciDateFirstVisit: false,
    ciDateFirstVisitApprox: false,
    ciMetWithDefAtt: false,
    ciDateMetDefAtt: false,
    ciMetWithPros: false,
    ciDateMet: false,
    ciRecordsCheck: false,
    ciRecordsObtained: false,
    ciRecordsDesc: false,
    ciAssistDefenseMex: false,
    ciInterpretation: false,
    ciLegalMaterials: false,
    ciDeathPenPosLtrToPros: false,
    ciDeathPenPosLtrToCourt: false,
    ciContactedFamily: false,
    ciAssistWithVisas: false,
    ciPaidFamilyTravel: false,
    ciNotes: false,
    piDateFirstInvolvement: false,
    piMetWithDef: false,
    piDateMetWithDef: false,
    piDateMetWithDefApprox: false,
    piMetWithDefCouns: false,
    piMetWithDefCounsDate: false,
    piMetWithDefCounseDateApprox: false,
    piPAAppearedCourt: false,
    piDatePAAppearedCourt: false,
    piPAAppearedCourtNotes: false,
    piPAMetWithPros: false,
    piDatePAMetWithPros: false,
    piLtrToPros: false,
    piPAMetWithGov: false,
    piDatePAMetWithGov: false,
    piPAMetWithParoleBd: false,
    piDatePAMetWithParoleBd: false,
    piPARepresented: false,
    piProgRecruitedDefCouns: false,
    piProgRetainedDefCouns: false,
    piProgFundedExperts: false,
    // piInvitedDefCounsToTraining: false,
    legalmaterialnotesmulti: false,
    piInvitedDefCounsToTrainingNotes: false,
    legalmaterialtypemulti: false,
    traininginvitemulti: false,
    trainingattendedmulti: false,
    legalmaterialdatefiledmulti: false,
    trainingtypemulti: false,
    trainingdatefiledmulti: false,
    lmInvited: false,
    piAmicusBriefStateTrial: false,
    piDateAmicusBriefStateTrial: false,
    piDateAmicusBriefStatePostCon: false,
    piAmicusBriefStatePostCon: false,
    piDateAmicusBriefStateSupr: false,
    piAmicusBriefStateSupr: false,
    piAmicusBrieFedTrial: false,
    piDateAmicusBrieFedTrial: false,
    piAmicusBriefFedHabeas: false,
    piDateAmicusBriefFedHabeas: false,
    piAmicusBriefFedAppeals: false,
    piDateAmicusBriefFedAppeals: false,
    piAmicusBriefUSSupr: false,
    piDateAmicusBriefUSSupr: false,
    piPetitionToIACHR: false,
    piDatePetitionToIACHR: false,
    piIACHRPrecaution: false,
    piDateIACHRPrecaution: false,
    piIACHRMerits: false,
    piDateIACHRMerits: false,
    linkConvictionDate: false,
    linkDateDSJury: false,
    linkConvictionCharges: false,
    // linkDateDSImposed: false,
    // linkNoLongerCapital: false,
    multiaggravfactorsfound: false,
    linkProgClemencyPetition: false,
    linkNoLongerCapitalNotes: false,
    linkDateProgClemencyPetition: false,
    linkPAMetWithClemencyOff: false,
    linkDatePAMetWithClemencyOff: false,
    linkPAAtCommutationHrg: false,
    linkDatePAAtCommutationHrg: false,
    linkClemencyNotes: false,
    linkDiplomaticNoteFiled: false,
    linkDateDiplomaticNoteFiled: false,
    linkDOSResponse: false,
    linkDateDOSResponse: false,
    linkFollowUpNotesFiled: false,
    linkDateFollowUpNotesFiled: false,
    linkDiplomaticInterventionNotes: false,
  }

  const [advcaseFilterObject, setAdvcaseFilterObject] = React.useState<any>(null);
  const [filterCaseID, setFilterCaseID] = React.useState<any>("")
  const [filterDefendantID, setFilterDefendantID] = React.useState<any>("")
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(hiddenColumns)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columns, setColumns] = React.useState([
    // {
    //   accessorKey: "id",
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "deffullname",
      header: "Name",
    },
    {
      accessorKey: "linkDateOpened",
      header: "Case Opened",
      accessorFn: (row: any) => {
        if (row?.linkDateOpened) {
          return convertToUTCDate(row?.linkDateOpened)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkDateClosed",
      header: "Case Closed",
      accessorFn: (row: any) => {
        if (row?.linkDateClosed) {
          return convertToUTCDate(row?.linkDateClosed)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkDateInvestigationOpened",
      header: "Investigation Opened",
      accessorFn: (row: any) => {
        if (row?.linkDateInvestigationOpened) {
          return convertToUTCDate(row?.linkDateInvestigationOpened)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkDateInvestigationClosed",
      header: "Investigation Closed",
      accessorFn: (row: any) => {
        if (row?.linkDateInvestigationClosed) {
          return convertToUTCDate(row?.linkDateInvestigationClosed)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkStatus",
      header: "Case Status",
    },
    {
      accessorKey: "linkNoLongerCapital",
      header: "Case no longer capital because",
    },
    {
      accessorKey: "linkDateDSImposed",
      header: "Date death sentence imposed by court",
      accessorFn: (row: any) => {
        if (row?.linkDateDSImposed) {
          return convertToUTCDate(row?.linkDateDSImposed)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "caseState",
      header: "State of prosecution",
    },
    {
      accessorKey: "caseCounty",
      header: "County of prosecution",
    },
    {
      accessorKey: "caseDistrict",
      header: "District court",
    },
    {
      accessorKey: "assignconsulate",
      header: "Assigned Consulate",
    },
    {
      accessorKey: "linkCaseID",
      header: "Case ID",
    },
    {
      accessorKey: "linkDefID",
      header: "Defendant ID",
    },
    {
      accessorKey: "caseTitle",
      header: "Case Title",
    },

    {
      accessorKey: "defLast",
      header: "Last Name",
    },
    {
      accessorKey: "defFirst",
      header: "First Name",
    },
    {
      accessorKey: "defMiddle",
      header: "Middle Name",
    },
    {
      accessorKey: "defNickname",
      header: "Nick Name",
    },
    {
      accessorKey: "defBirthdate",
      header: "Birth date",
      accessorFn: (row: any) => {
        if (row?.defBirthdate) {
          return convertToUTCDate(row?.defBirthdate)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "defAge",
      header: "Age",
      accessorFn: (row: any) => {
        if (row?.defBirthdate) {
          convertToUTCDate(row?.defBirthdate)
          const currentDate = moment()
          const years = currentDate.diff(moment(row?.defBirthdate), "years")
          return years
          // return
          // calculateAge(row?.defBirthdate)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "defDOBapprox",
      header: "Age - Approximate",
    },
    {
      accessorKey: "defMexicanBirthState",
      header: "Birth state",
    },
    {
      accessorKey: "defSex",
      header: "Sex",
    },
    // {
    //   accessorKey: "aliasLast",
    //   header: "Alias name- last name"
    // }, {
    //   accessorKey: "aliasFirst",
    //   header: "Alias name- first name"
    // },
    // {
    //   accessorKey: "aliasMiddle",
    //   header: "Alias name- Middle name"
    // },
    {
      accessorKey: "aliasnamemulti",
      header: "Alias Names",
    },
    {
      accessorKey: "defPrisonID",
      header: "Prison",
    },
    {
      accessorKey: "defSpeakSpanish",
      header: "Speaks Spanish",
    },
    {
      accessorKey: "defSpeakEnglish",
      header: "Speaks English",
    },
    {
      accessorKey: "defLiterateSpanish",
      header: "Literate in Spanish",
    },
    {
      accessorKey: "defLiterateEnglish",
      header: "Literate in English",
    },
    {
      accessorKey: "defSpeakOtherLanguage",
      header: "Speaks other languages",
    },
    {
      accessorKey: "defLiteracyNotes",
      header: "Literacy and Language Notes",
    },
    {
      accessorKey: "defSchoolYearsTotal",
      header: "Total years of education",
    },
    {
      accessorKey: "schooltypemulti",
      header: "Type of education",
    },
    {
      accessorKey: "schoolnamemulti",
      header: "School-Name",
    },
    {
      accessorKey: "schoolcountrymulti",
      header: "School-Country",
    },
    {
      accessorKey: "schoolstatemulti",
      header: "School-State",
    },
    {
      accessorKey: "schoolcitymulti",
      header: "School-City",
    },
    {
      accessorKey: "schooladdressmulti",
      header: "School-Address",
    },
    {
      accessorKey: "schoolyearstartedmulti",
      header: "School-Start Year",
    },
    {
      accessorKey: "schoolyearleftmulti",
      header: "School-End Year",
    },
    {
      accessorKey: "defWorkNotes",
      header: "Employment Notes",
    },
    {
      accessorKey: "defHasImpairment",
      header: "Mental Impairments - Suspected intellectual disability",
    },
    {
      accessorKey: "imptypemulti",
      header: "Mental Impairments - Type",
    },
    {
      accessorKey: "impdeterminedbymulti",
      header: "Mental Impairments - Method of Determination",
    },
    {
      accessorKey: "impdocmulti",
      header: "Mental Impairments - Doctor",
    },
    {
      accessorKey: "impdatediagnosedmulti",
      header: "Mental Impairments - Date",
    },
    {
      accessorKey: "impdescmulti",
      header: "Mental Impairments - Description",
    },
    {
      accessorKey: "defNotes",
      header: "Notes on this Defendant",
    },
    {
      accessorKey: "defProgramAttorney",
      header: "Program Attorney",
    },
    {
      accessorKey: "defLevelInvolvement",
      header: "MCLAP level of involvement",
    },
    {
      accessorKey: "caseNumber",
      header: "Case Number",
    },
    {
      accessorKey: "caseCrimeDate",
      header: "Crime Date",
      accessorFn: (row: any) => {
        if (row?.caseCrimeDate) {
          return convertToUTCDate(row?.caseCrimeDate)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "caseCrimeDescription",
      header: "Crime description",
    },
    {
      accessorKey: "multicrimetypes",
      header: "Crime Types",
    },
    {
      accessorKey: "caseCaseSummary",
      header: "Case summary",
    },
    // {
    //   accessorKey: "caseDistrict",
    //   header: "Federal"
    // },

    // {
    //   accessorKey: "vicLast",
    //   header: "Victims - Last name"
    // },
    // {
    //   accessorKey: "vicFirst",
    //   header: "Victims - First name"
    // },
    // {
    //   accessorKey: "vicMiddle",
    //   header: "Victims - Middle name"
    // },
    // {
    //   accessorKey: "vicSex",
    //   header: "Victims - Sex"
    // },
    // {
    //   accessorKey: "vicAge",
    //   header: "Victims - Age"
    // },
    // {
    //   accessorKey:"",
    //   header:"Victims – Relationship"
    // },
    // {
    //   accessorKey: "vicRace",
    //   header: "Victims - Race"
    // },
    {
      accessorKey: "victimsinfo",
      header: "Victims - Info",
    },
    {
      accessorKey: "multicodefnames",
      header: "Co-Defendants",
    },
    // {
    //   header: "Non program Co-Defendants - Last name",
    //   accessorKey: "npdLast"
    // },
    // {
    //   header: "Non program Co-Defendants - First name",
    //   accessorKey: "npdFirst"
    // },
    // {
    //   header: "Non program Co-Defendants - Middle name",
    //   accessorKey: "npdMiddle"
    // },
    {
      header: "Non program Co-Defendants - Name",
      accessorKey: "noprogdefnamemulti",
    },
    {
      header: "Non program Co-Defendants - Notes",
      accessorKey: "nonprogdefnotesmulti",
    },
    {
      accessorKey: "linkArrestDate",
      header: "Date of arrest",
      accessorFn: (row: any) => {
        if (row?.linkArrestDate) {
          return convertToUTCDate(row?.linkArrestDate)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkArrestPlace",
      header: "Place of arrest",
    },
    {
      accessorKey: "linkState",
      header: "Place of Arrest - State",
    },
    {
      accessorKey: "linkCounty",
      header: "Place of arrest County",
    },
    {
      accessorKey: "linkCustody",
      header: "Already in custody",
    },
    {
      accessorKey: "linkTrial",
      header: "Trial?",
    },
    {
      accessorKey: "linkProceduralStatus",
      header: "Procedural Status?",
    },
    {
      accessorKey: "linkDeathPenSought",
      header: "Death Penalty Sought at trail?",
    },
    {
      accessorKey: "linkDeathNoticed",
      header: "Death Noticed?",
    },
    {
      accessorKey: "linkDateDeathNoticed",
      header: "Date death sought?",
      accessorFn: (row: any) => {
        if (row?.linkDateDeathNoticed) {
          return convertToUTCDate(row?.linkDateDeathNoticed)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkPleaBargain",
      header: "Plea bargain offered?",
    },
    {
      accessorKey: "linkPleaBargainTermsOffered",
      header: "Terms of offer",
    },
    {
      accessorKey: "linkPleaBargainAccepted",
      header: "Plea bargain accepted?",
    },
    {
      accessorKey: "linkPleaBargainRefused",
      header: "If not why?",
    },
    {
      accessorKey: "multiaggravfactors",
      header: "Aggravating Factor(s)",
    },
    {
      accessorKey: "multimit",
      header: "Mitigation Theme(s) - Type",
    },
    {
      accessorKey: "multimitnotes",
      header: "Mitigation Theme(s) - Type - Notes",
    },
    {
      accessorKey: "pleadingnamesmulti",
      header: "Pleadings",
    },
    {
      accessorKey: "pleadingdatefiledmulti",
      header: "Pleadings - Type - Date filed",
      // accessorFn: (row: any) => {
      //   if (row?.pleadDateFiled) {
      //     return convertToUTCDate(row?.pleadDateFiled)
      //   } else {
      //     return ""
      //   }
      // },
    },
    {
      accessorKey: "pleadingnotesmulti",
      header: "Pleadings - Type - Notes",
    },
    {
      accessorKey: "artDefRemembers",
      header: "Does defendant remember being notified of VCCR rights?",
    },
    {
      accessorKey: "artDateNotified",
      header: "Date Notified",
      accessorFn: (row: any) => {
        if (row?.artDateNotified) {
          return convertToUTCDate(row?.artDateNotified)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "artNotifiedByWhom",
      header: "Notified By Whom?",
    },
    {
      accessorKey: "artFormFieldCons",
      header: "Is there a written form indicating the defendant was notified?",
    },
    {
      accessorKey: "artPoliceAware",
      header: "Were police aware that defendant was a Mexican national?",
    },
    {
      accessorKey: "artPoliceAwareWhen",
      header: "When were they aware?",
    },
    {
      accessorKey: "artDefClaimedCitizenship",
      header:
        "Is there any evidence defendant pretended to be a US citizen or citizen of another country?",
    },
    {
      accessorKey: "artWhenAdmittedMexNat",
      header: "If yes, When did defendant admit to being a Mexican national?  ",
    },
    {
      accessorKey: "artOtherSourcesExist",
      header:
        "Are there other relevant sources to determine awareness of the defendant's nationality?",
    },
    {
      accessorKey: "artOtherSources",
      header: "If yes, what are they?",
    },
    {
      accessorKey: "artBookingSheetStates",
      header:
        "Does jail booking sheet list defendant’s nationality or place of birth?",
    },
    {
      accessorKey: "artImmigrationStatus",
      header: "What was immigration status of defendant?",
    },
    {
      accessorKey: "artINSHold",
      header: "Has defendant ever been placed on INS hold?",
    },
    {
      accessorKey: "artSpanishFirstLang",
      header: "Was defendant’s first language Spanish at time of arrest?",
    },
    {
      accessorKey: "artSpeakingIndianLang",
      header:
        "Was defendant’s first language an indigenous language at time of arrest?",
    },
    {
      accessorKey: "artInterpInterrog",
      header:
        "Was a neutral interpreter (not police officer) used during interrogation?",
    },
    {
      accessorKey: "artInterrogEng",
      header: "Was interrogation conducted in English?",
    },
    {
      accessorKey: "artInterrogSpan",
      header: "Was interrogation conducted in Spanish?",
    },
    {
      accessorKey: "artAdvised",
      header:
        "If defendant gave statement to police, did they advise defendant during interview of right to communicate with consulate?",
    },
    {
      accessorKey: "artStatementB4Advised",
      header: "Was statement given prior to notification?",
    },
    {
      accessorKey: "artStatementUsedAtTrial",
      header: "If yes, Was statement used at trial?",
    },
    {
      accessorKey: "artDefStatedBornInMex",
      header: "During statement did defendant say she/he was born in Mexico?",
    },
    {
      accessorKey: "artStatementRecorded",
      header: "Was statement tape-recorded?",
    },
    {
      accessorKey: "artViolated",
      header: "Did trial counsel argue state authorities violated Article 36?",
    },
    {
      accessorKey: "artAppellateRaised",
      header: "Did appellate counsel raise the argument?",
    },
    {
      accessorKey: "artPostConRaised",
      header: "Did state post-conviction counsel raise the argument?",
    },
    {
      accessorKey: "artPostConFedRaised",
      header: "Did federal post-conviction counsel raise the argument?",
    },
    {
      accessorKey: "artPostConSuccRaised",
      header: "Was argument raised in successive post-conviction application?",
    },
    {
      accessorKey: "artDefNotNotified",
      header:
        "If argument wasn’t raised, Is there evidence that defendant was not properly notified of Article 36 rights?",
    },
    {
      accessorKey: "artEvidence",
      header: "What is that evidence?",
    },
    {
      accessorKey: "artNeedInterpHearings",
      header: "Does defendant need interpreter in court hearings?",
    },
    {
      accessorKey: "artInterpTrial",
      header: "Was a neutral interpreter used at trial?",
    },
    {
      accessorKey: "artNotes",
      header: "General Article 36 Comments",
    },
    {
      accessorKey: "ciDateNotified",
      header: "Date consulate learned of case",
      accessorFn: (row: any) => {
        if (row?.ciDateNotified) {
          return convertToUTCDate(row?.ciDateNotified)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "ciNotified",
      header:
        "Was consulate notified by law enforcement of defendant’s detention?",
    },
    {
      accessorKey: "ciNotifiedByWhom",
      header: "Who notified consulate?",
    },
    {
      accessorKey: "ciNotifiedHow",
      header: "How?",
    },
    {
      accessorKey: "ciDateFirstVisit",
      header: "Date of first consular visit to defendant",
      accessorFn: (row: any) => {
        if (row?.ciDateFirstVisit) {
          return convertToUTCDate(row?.ciDateFirstVisit)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "ciDateFirstVisitApprox",
      header: "Is this date approximate?",
      accessorFn: (row: any) => {
        if (row?.ciDateFirstVisitApprox) {
          return convertToUTCDate(row?.ciDateFirstVisitApprox)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "ciMetWithDefAtt",
      header: "Did consulate meet with defense attorney?",
    },
    {
      accessorKey: "ciDateMetDefAtt",
      header: "Did consulate meet with defense attorney-Date",
      accessorFn: (row: any) => {
        if (row?.ciDateMetDefAtt) {
          return convertToUTCDate(row?.ciDateMetDefAtt)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "ciMetWithPros",
      header: "Did consulate meet with prosecutor?",
    },
    {
      accessorKey: "ciDateMet",
      header: "Did consulate meet with prosecutor-Date",
      accessorFn: (row: any) => {
        if (row?.ciDateMet) {
          return convertToUTCDate(row?.ciDateMet)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "ciRecordsCheck",
      header: "Did consulate complete a criminal records check in Mexico?",
    },
    {
      accessorKey: "ciRecordsObtained",
      header: "Did consulate obtain other records from Mexico?",
    },
    {
      accessorKey: "ciRecordsDesc",
      header: "If yes, What records?",
    },
    {
      accessorKey: "ciAssistDefenseMex",
      header:
        "Did consulate provide assistance to attorneys or investigators travelling to Mexico?",
    },
    {
      accessorKey: "ciInterpretation",
      header: "Did consulate provide interpretation services?",
    },
    {
      accessorKey: "ciLegalMaterials",
      header: "Did consulate provide legal materials?",
    },
    {
      accessorKey: "ciDeathPenPosLtrToPros",
      header:
        "Did consulate present letter to prosecutors regarding Mexico’s position on the death penalty?",
    },
    {
      accessorKey: "ciDeathPenPosLtrToCourt",
      header:
        "Did consulate present letter to Court regarding Mexico’s position on the death penalty?",
    },
    {
      accessorKey: "ciContactedFamily",
      header: "Did consulate contact family members?",
    },
    {
      accessorKey: "ciAssistWithVisas",
      header: "Did consulate assist defense witnesses in obtaining visas?",
    },
    {
      accessorKey: "ciPaidFamilyTravel",
      header: "Did consulate pay for family members to travel to the U.S?",
    },
    {
      accessorKey: "ciNotes",
      header: "General Comments on Consular Involvement",
    },
    {
      accessorKey: "piDateFirstInvolvement",
      header: "Date of Program’s first involvement",
      accessorFn: (row: any) => {
        if (row?.piDateFirstInvolvement) {
          return convertToUTCDate(row?.piDateFirstInvolvement)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piMetWithDef",
      header: "Program attorney met with defendant?",
    },
    {
      accessorKey: "piDateMetWithDef",
      header: "Program attorney met with defendant-Initial Date",
      accessorFn: (row: any) => {
        if (row?.piDateMetWithDef) {
          return convertToUTCDate(row?.piDateMetWithDef)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piDateMetWithDefApprox",
      header: "Program attorney met with defendant-Approximate",
    },
    {
      accessorKey: "piMetWithDefCouns",
      header: "Program attorneys met with defense counsel?",
    },
    {
      accessorKey: "piMetWithDefCounsDate",
      header: "Program attorneys met with defense counsel-Initial Date",
      accessorFn: (row: any) => {
        if (row?.piMetWithDefCounsDate) {
          return convertToUTCDate(row?.piMetWithDefCounsDate)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piMetWithDefCounseDateApprox",
      header: "Program attorneys met with defense counsel-Approximate",
    },
    {
      accessorKey: "piPAAppearedCourt",
      header: "Program attorneys appeared in court?",
    },
    {
      accessorKey: "piDatePAAppearedCourt",
      header: "Program attorneys appeared in court -Initial Date",
      accessorFn: (row: any) => {
        if (row?.piDatePAAppearedCourt) {
          return convertToUTCDate(row?.piDatePAAppearedCourt)
        } else {
          return ""
        }
      },
    },
    {
      header: "Program involvement - Notes",
      accessorKey: "piPAAppearedCourtNotes",
    },
    {
      accessorKey: "piPAMetWithPros",
      header: "Program attorneys met with prosecutors?",
    },
    {
      accessorKey: "piDatePAMetWithPros",
      header: "Program attorneys met with prosecutors-Date",
      accessorFn: (row: any) => {
        if (row?.piDatePAMetWithPros) {
          return convertToUTCDate(row?.piDatePAMetWithPros)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piLtrToPros",
      header:
        "Letter to prosecutor written by program attorney for signature by Mexican consular official?",
    },
    {
      accessorKey: "piPAMetWithGov",
      header:
        "Program attorneys met with governor and/or governor’s legal counsel?",
    },
    {
      accessorKey: "piDatePAMetWithGov",
      header:
        "Program attorneys met with governor and/or governor’s legal counsel-Date",
      accessorFn: (row: any) => {
        if (row?.piDatePAMetWithGov) {
          return convertToUTCDate(row?.piDatePAMetWithGov)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piPAMetWithParoleBd",
      header: "Program attorneys met with parole board members?",
    },
    {
      accessorKey: "piDatePAMetWithParoleBd",
      header: "Program attorneys met with parole board members-Date",
      accessorFn: (row: any) => {
        if (row?.piDatePAMetWithParoleBd) {
          return convertToUTCDate(row?.piDatePAMetWithParoleBd)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piPARepresented",
      header: "Program attorney represented defendant?",
    },
    {
      accessorKey: "piProgRecruitedDefCouns",
      header: "Program recruited defense council?",
    },
    {
      accessorKey: "piProgRetainedDefCouns",
      header: "Program retained defense council?",
    },
    {
      accessorKey: "piProgFundedExperts",
      header: "Program provided funds for experts/investigators?",
    },
    // {
    //   accessorKey: "piInvitedDefCounsToTraining",
    //   header:
    //     "Program invited defense counsel to training on defense of Mexican nationals?",
    // },
    {
      accessorKey: "legalmaterialtypemulti",
      header: "Counsel legal material-Item sent",
    },
    {
      accessorKey: "legalmaterialdatefiledmulti",
      header: "Counsel legal material-Date",
      // accessorFn: (row: any) => {
      //   if (row?.lmDateSent) {
      //     return convertToUTCDate(row?.lmDateSent)
      //   } else {
      //     return ""
      //   }
      // },
    },
    {
      accessorKey: "legalmaterialnotesmulti",
      header: "Counsel legal material-Item sent-To whom?",
    },
    {
      accessorKey: "trainingtypemulti",
      header: "Counsel legal material-Type of training",
    },
    {
      accessorKey: "trainingdatefiledmulti",
      header: "Counsel legal material-Type of training-Date",
      // accessorFn: (row: any) => {
      //   if (row?.ptDateTypeTraining) {
      //     return convertToUTCDate(row?.ptDateTypeTraining)
      //   } else {
      //     return ""
      //   }
      // },
    },
    {
      accessorKey: "traininginvitemulti",
      header: "Counsel legal material-Type of training-Who was invited?",
    },
    {
      accessorKey: "trainingattendedmulti",
      header: "Counsel legal material-Type of training-Who attended?",
    },
    {
      accessorKey: "piAmicusBriefStateTrial",
      header: "State trial court?",
    },
    {
      accessorKey: "piDateAmicusBriefStateTrial",
      header: "State trial court-Date",
      accessorFn: (row: any) => {
        if (row?.piDateAmicusBriefStateTrial) {
          return convertToUTCDate(row?.piDateAmicusBriefStateTrial)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piAmicusBriefStateSupr",
      header: "State supreme court?",
    },
    {
      accessorKey: "piDateAmicusBriefStateSupr",
      header: "State supreme court-Date",
      accessorFn: (row: any) => {
        if (row?.piDateAmicusBriefStateSupr) {
          return convertToUTCDate(row?.piDateAmicusBriefStateSupr)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piAmicusBriefStatePostCon",
      header: "State Post-Conv. court?",
    },
    {
      accessorKey: "piDateAmicusBriefStatePostCon",
      header: "State Post-Conv. court-Date",
      accessorFn: (row: any) => {
        if (row?.piDateAmicusBriefStatePostCon) {
          return convertToUTCDate(row?.piDateAmicusBriefStatePostCon)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piAmicusBrieFedTrial",
      header: "Federal trial court?",
    },
    {
      accessorKey: "piDateAmicusBrieFedTrial",
      header: "Federal trial court-Date",
      accessorFn: (row: any) => {
        if (row?.piDateAmicusBrieFedTrial) {
          return convertToUTCDate(row?.piDateAmicusBrieFedTrial)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piAmicusBriefFedHabeas",
      header: "Federal habeas court?",
    },
    {
      accessorKey: "piDateAmicusBriefFedHabeas",
      header: "Federal habeas court-Date",
      accessorFn: (row: any) => {
        if (row?.piDateAmicusBriefFedHabeas) {
          return convertToUTCDate(row?.piDateAmicusBriefFedHabeas)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piAmicusBriefFedAppeals",
      header: "Federal appeals court?",
    },
    {
      accessorKey: "piDateAmicusBriefFedAppeals",
      header: "Federal appeals court-Date",
      accessorFn: (row: any) => {
        if (row?.piDateAmicusBriefFedAppeals) {
          return convertToUTCDate(row?.piDateAmicusBriefFedAppeals)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piAmicusBriefUSSupr",
      header: "U.S. supreme court?",
    },
    {
      accessorKey: "piDateAmicusBriefUSSupr",
      header: "U.S. supreme court-Date",
      accessorFn: (row: any) => {
        if (row?.piDateAmicusBriefUSSupr) {
          return convertToUTCDate(row?.piDateAmicusBriefUSSupr)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piPetitionToIACHR",
      header: "Program attorneys prepared petition to IACHR?",
    },
    {
      accessorKey: "piDatePetitionToIACHR",
      header: "Program attorneys prepared petition to IACHR-Date",
      accessorFn: (row: any) => {
        if (row?.piDatePetitionToIACHR) {
          return convertToUTCDate(row?.piDatePetitionToIACHR)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piIACHRPrecaution",
      header: "IACHR issue precautionary measures?",
    },
    {
      accessorKey: "piDateIACHRPrecaution",
      header: "IACHR issue precautionary measures-Date",
      accessorFn: (row: any) => {
        if (row?.piDateIACHRPrecaution) {
          return convertToUTCDate(row?.piDateIACHRPrecaution)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "piIACHRMerits",
      header: "IACHR issue decision based on merits?",
    },
    {
      accessorKey: "piDateIACHRMerits",
      header: "IACHR issue decision based on merits-Date",
      accessorFn: (row: any) => {
        if (row?.piDateIACHRMerits) {
          return convertToUTCDate(row?.piDateIACHRMerits)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkConvictionDate",
      header: "Date of Conviction",
      accessorFn: (row: any) => {
        if (row?.linkConvictionDate) {
          return convertToUTCDate(row?.linkConvictionDate)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkDateDSJury",
      header: "Date jury recommended death sentence",
      accessorFn: (row: any) => {
        if (row?.linkDateDSJury) {
          return convertToUTCDate(row?.linkDateDSJury)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkConvictionCharges",
      header: "Charges",
    },
    {
      accessorKey: "multiaggravfactorsfound",
      header: "Aggravating Factor(s)",
    },
    {
      accessorKey: "linkNoLongerCapitalNotes",
      header: "Notes",
    },
    {
      accessorKey: "linkProgClemencyPetition",
      header: "Program drafted clemency petition?",
    },
    {
      accessorKey: "linkDateProgClemencyPetition",
      header: "Program drafted clemency petition-Date",
      accessorFn: (row: any) => {
        if (row?.linkDateProgClemencyPetition) {
          return convertToUTCDate(row?.linkDateProgClemencyPetition)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkPAMetWithClemencyOff",
      header: "Program attorneys met with clemency officials?",
    },
    {
      accessorKey: "linkDatePAMetWithClemencyOff",
      header: "Program attorneys met with clemency officials-Date",
      accessorFn: (row: any) => {
        if (row?.linkDatePAMetWithClemencyOff) {
          return convertToUTCDate(row?.linkDatePAMetWithClemencyOff)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkPAAtCommutationHrg",
      header: "Program appeared at commutation hearing?",
    },
    {
      accessorKey: "linkDatePAAtCommutationHrg",
      header: "Program appeared at commutation hearing-Date",
      accessorFn: (row: any) => {
        if (row?.linkDatePAAtCommutationHrg) {
          return convertToUTCDate(row?.linkDatePAAtCommutationHrg)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkClemencyNotes",
      header: "General Clemency Related Notes",
    },
    {
      accessorKey: "linkDiplomaticNoteFiled",
      header: "Diplomatic note filed?",
    },
    {
      accessorKey: "linkDateDiplomaticNoteFiled",
      header: "Diplomatic note filed-Date",
      accessorFn: (row: any) => {
        if (row?.linkDateDiplomaticNoteFiled) {
          return convertToUTCDate(row?.linkDateDiplomaticNoteFiled)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkDOSResponse",
      header: "Response received from Department of State?",
    },
    {
      accessorKey: "linkDateDOSResponse",
      header: "Response received from Department of State-Date",
      accessorFn: (row: any) => {
        if (row?.linkDateDOSResponse) {
          return convertToUTCDate(row?.linkDateDOSResponse)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkFollowUpNotesFiled",
      header: "Follow-up notes filed?",
    },
    {
      accessorKey: "linkDateFollowUpNotesFiled",
      header: "Follow-up notes filed-Initial Date",
      accessorFn: (row: any) => {
        if (row?.linkDateFollowUpNotesFiled) {
          return convertToUTCDate(row?.linkDateFollowUpNotesFiled)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "linkDiplomaticInterventionNotes",
      header: "General Diplomatic Intervention Notes",
    },
  ])
  const [crimeTypeList, setCrimeTypeList] = React.useState<any>([])
  const [proceduralStatusIsOpen, setProceduralStatusIsOpen] =
    React.useState<any>(false)
  const [filterCaseTitle, setFilterCaseTitle] = React.useState<any>("")
  const [filterFirstName, setFilterFirstName] = React.useState<any>("")
  const [filterLastName, setFilterLastName] = React.useState<any>("")
  const [filterStatus, setFilterStatus] = React.useState<any>("")
  const [filterOpenDate, setFilterOpenDate] = React.useState<any>([])
  const [filterClosedDate, setFilterClosedDate] = React.useState<any>([])
  const [filterCaseOpenDate, setFilterCaseOpenDate] = React.useState<any>([])
  const [filterAssignConsulate, setFilterAssignConsulate] =
    React.useState<any>("")
  const [filterCaseClosedDate, setFilterCaseClosedDate] = React.useState<any>(
    []
  )

  const [filterCaseNumber, setFilterCaseNumber] = React.useState<any>("")
  const [filterCrimeDate, setFilterCrimeDate] = React.useState<any>([])
  const [filterCrimeType, setFilterCrimeType] = React.useState<any>([])
  const [filterState, setFilterState] = React.useState<any>("")
  const [filterCounty, setFilterCounty] = React.useState<any>("")
  const [filterDistrictCourt, setFilterDistrictCourt] = React.useState<any>("")
  const [filterCodef, setFilterCodef] = React.useState<any>([])
  const [filterArrestDate, setFilterArrestDate] = React.useState<any>([])
  const [filterArrestPlace, setFilterArrestPlace] = React.useState<any>("")
  const [filterArrestState, setFilterArrestState] = React.useState<any>("")
  const [filterArrestCounty, setFilterArrestCounty] = React.useState<any>("")
  const [filterCustody, setFilterCustody] = React.useState<any>(false)
  const [filterProceduralStatus, setFilterProceduralStatus] =
    React.useState<any>("")
  const [filterDeathPenalityTrail, setFilterDeathPenalityTrail] =
    React.useState<any>("")
  const [filterDeathNoticed, setFilterDeathNoticed] = React.useState<any>("")
  const [filterDateDealthSought, setFilterDateDealthSought] =
    React.useState<any>([])
  const [filterPleaBargainOffered, setFilterPleaBargainOffered] =
    React.useState<any>("")
  const [filterAggravatingFactors, setFilterAggravatingFactors] =
    React.useState<any>("")

  const [showFilters, setShowFilters] = React.useState(false)
  const [filtersApplied, setFiltersApplied] = React.useState(false)
  const [filterIsOpen, setFilterIsOpen] = React.useState<any>(false)
  const [statusTypeList, setStatusTypeList] = React.useState<any>([])
  const [consulateTypeList, setConsulateTypeList] = React.useState<any>([])
  const [assignIsOpen, setAssignIsOpen] = React.useState(false)
  const [caseOpenDateIsOpen, setCaseOpenDateIsOpen] = React.useState<any>(false)
  const [caseCloseDateIsOpen, setCaseCloseDateIsOpen] =
    React.useState<any>(false)
  const [investOpenDateIsOpen, setInvestOpenDateIsOpen] =
    React.useState<any>(false)
  const [investCloseDateIsOpen, setInvestCloseDateIsOpen] =
    React.useState<any>(false)
  const [filterHeight, setFilterHeight] = React.useState<any>("")
  const showfilterRef = React.useRef(null)

  const [crimeDateIsOpen, setCrimeDateIsOpen] = React.useState<any>(false)
  const [arrestDateIsOpen, setArrestDateIsOpen] = React.useState<any>(false)
  const [dateDealthSoughtIsOpen, setDateDealthSoughtIsOpen] =
    React.useState<any>(false)
  const [courtTypeList, setCourtTypeList] = React.useState([])
  const [aggravFactorTypeList, setAggravFactorTypeList] = React.useState<any>(
    []
  )

  const [advanceFilterCheck, setAdvanceFilterCheck] = React.useState<any>(false)
  const [filterObject, setFilterObject] = React.useState<any>(null)
  const [showAllColumns, setShowAllColumns] = React.useState(false)

  const [appliedCaseFilters, setAppliedCaseFilters] = React.useState<any>(null)

  const [caseFilterIsOpen, setCaseFilterIsOpen] = React.useState<any>(false)
  const [filterDateRange, setFilterDateRange] = React.useState<any>([])
  const [dateRangeIsOpen, setDateRangeIsOpen] = React.useState<any>(false)
  const [dateRangeGroupApplied, setDateRangeGroupApplied] =
    React.useState(false)

  const removeBatchFilter = async (removeBatchKey: any) => {
    try {
      let dateRange = ""
      let caseOpen = ""
      let caseClosed = ""
      let Invest_Open = ""
      let Invest_Closed = ""
      let CrimeDate = ""
      let arrestDate = ""
      let DateDealthSought = ""
      let factors = ""
      let codefs = ""

      if (filterDateRange && filterDateRange?.length > 0) {
        dateRange = filterDateRange.join(",")
      }

      if (filterCaseOpenDate && filterCaseOpenDate?.length > 0) {
        caseOpen = filterCaseOpenDate.join(",")
      }
      if (filterCaseClosedDate && filterCaseClosedDate?.length > 0) {
        caseClosed = filterCaseClosedDate.join(",")
      }
      if (filterOpenDate && filterOpenDate?.length > 0) {
        Invest_Open = filterOpenDate.join(",")
      }
      if (filterClosedDate && filterClosedDate?.length > 0) {
        Invest_Closed = filterClosedDate.join(",")
      }
      if (filterCrimeDate && filterCrimeDate?.length > 0) {
        CrimeDate = filterCrimeDate.join(",")
      }

      if (filterArrestDate && filterArrestDate?.length > 0) {
        arrestDate = filterArrestDate.join(",")
      }
      if (filterDateDealthSought && filterDateDealthSought?.length > 0) {
        DateDealthSought = filterDateDealthSought.join(",")
      }
      if (filterAggravatingFactors && filterAggravatingFactors?.length > 0) {
        factors = filterDateDealthSought.join(",")
      }

      if (filterCodef && filterCodef?.length > 0) {
        let mapCodef = filterCodef?.map((map_ele: any) => {
          let defId = "0"
          if (map_ele) {
            let splitArray = String(map_ele).split(" - ")
            if (splitArray[0]) {
              defId = splitArray[0]
            }
          }
          return defId
        })
        codefs = mapCodef.join(",")
      }

      let filterAllObject: any = {
        caseOpen: caseOpen,
        caseClosed: caseClosed,
        investigationOpen: Invest_Open,
        investigationClose: Invest_Closed,
        crimeDate: CrimeDate,
        codefendant: codefs,
        dateDealthSought: DateDealthSought,
        arrestDate: arrestDate,
        caseID: filterCaseID,
        defID: filterDefendantID,
        caseTitle: filterCaseTitle,
        firstName: filterFirstName,
        lastName: filterLastName,
        status: filterStatus,
        consulate: filterAssignConsulate,
        caseNumber: filterCaseNumber,
        crimeType: filterCrimeType,
        state: filterState,
        county: filterCounty,
        districtCourt: filterDistrictCourt,
        arrestPlace: filterArrestPlace,
        arrestState: filterArrestState,
        arrestCounty: filterCustody ? filterCustody : "",
        proceduralStatus: filterProceduralStatus,
        deathNoticed: filterDeathNoticed,
        deathPenalityTrail: filterDeathPenalityTrail,
        pleaBargainOffered: filterPleaBargainOffered,
        aggravatingFactors: factors,
        caseOpenedNullCheck: caseOpenedNullCheck,
        caseClosedNullCheck: caseClosedNullCheck,
        investigationOpenedNullCheck: investigationOpenedNullCheck,
        investigationClosedNullCheck: investigationClosedNullCheck,
        dateRange : dateRange,
      }

    if( removeBatchKey){
      delete filterAllObject[removeBatchKey]
    }
    let filterAllempty = Object.values(filterAllObject).filter((filter_ele)=>{
      return filter_ele !== '';
    });

    if( filterAllempty?.length === 0){
      // All clear badge
      setShowFilters(false)
      setFiltersApplied(false)
      fetchData(currentPage, limitPage)
    }else{
      applyFilter(filterObject, currentPage, limitPage, removeBatchKey, "")
    }

    } catch (err) {}
  }

  const table = useReactTable({
    data: caseDate,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const PreviousPage = () => {
    try {
      let updatePage = currentPage - 1
      setCurrentpage(updatePage)
      if (filterValue) {
        filterSearch(filterValue, updatePage, limitPage)
      } else {
        if (filtersApplied) {
          applyFilter(filterObject, updatePage, limitPage, "", "")
        } else {
          fetchData(updatePage, limitPage)
        }
      }
    } catch (err) {}
  }
  const NextPage = () => {
    try {
      let updatePage = currentPage + 1
      setCurrentpage(updatePage)
      if (filterValue) {
        filterSearch(filterValue, updatePage, limitPage)
      } else {
        if (filtersApplied) {
          applyFilter(filterObject, updatePage, limitPage, "", "")
        } else {
          fetchData(updatePage, limitPage)
        }
      }
    } catch (err) {}
  }
  const LimitPerPage = (limitValue: any) => {
    setLimitPage(limitValue)
    if (filterValue) {
      filterSearch(filterValue, 1, limitValue)
    } else {
      if (filtersApplied) {
        applyFilter(filterObject, currentPage, limitValue, "", "")
      } else {
        fetchData(1, limitValue)
      }
    }
  }
  const filterSearch = async (
    Value: any,
    updatePage: any,
    updateLimit: any
  ) => {
    setIsLoading(true)
    let url = `${baseURL}/v1/case`
    const response = await axiosInstance.post(url, {
      page: updatePage,
      limit: updateLimit,
      filter: Value,
    })
    let listData = response?.data?.data?.rows ? response?.data?.data?.rows : []
    let modified = listData.map((map_ele: any) => {
      map_ele.check = false
      return map_ele
    })
    setCaseDate(modified)
    setDeleteEnable(true)
    setEditEnable(true)
    setDeleteIds([])
    setEditObj("")
    table?.toggleAllPageRowsSelected(false)
    setCurrentpage(updatePage)
    setLimitPage(updateLimit)
    setTotalPage(
      response?.data?.data?.totalPages ? response?.data?.data?.totalPages : 1
    )
    setTotalItems(
      response?.data?.data?.totalItems ? response?.data?.data?.totalItems : 0
    )
    setIsLoading(false)
  }
  const [filterValue, setFilterValue] = React.useState<any>("")
  const handleSearch = async (event: any) => {
    let Value = event.target.value
    setFilterValue(Value)
    clearTimeout(timer)
    const newTimer = setTimeout(() => {
      if (Value) {
        filterSearch(Value, currentPage, limitPage)
      } else {
        fetchData(currentPage, limitPage)
      }
    }, 500)
    setTimer(newTimer)
  }
  const fetchData = async (updatePage: any, updateLimit: any) => {
    setIsLoading(true)
    if (!updatePage) {
      updatePage = 1
    }
    if (!updateLimit) {
      updateLimit = 25
    }
    setDeleteEnable(true)
    setEditEnable(true)
    setDeleteIds([])
    setEditObj("")
    setFilterValue("")
    try {
      const response = await axiosInstance.post(`${baseURL}/v1/case`, {
        page: updatePage,
        limit: updateLimit,
      })
      let listData = response?.data?.data?.rows
        ? response?.data?.data?.rows
        : []

      console.log("response------", listData)
      setCaseDate(listData)
      setIsLoading(false)
      if (
        !totalItems ||
        updateLimit != limitPage ||
        (response?.data?.data?.totalItems &&
          totalItems != response?.data?.data?.totalItems)
      ) {
        setCurrentpage(1)
        setTotalPage(
          response?.data?.data?.totalPages
            ? response?.data?.data?.totalPages
            : 1
        )
        setTotalItems(
          response?.data?.data?.totalItems
            ? response?.data?.data?.totalItems
            : 0
        )
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const buildQueryStringForFilterAndExport = () => {
    let caseOpen = ""
    let caseClosed = ""
    let Invest_Open = ""
    let Invest_Closed = ""
    let CrimeDate = ""
    let arrestDate = ""
    let DateDealthSought = ""
    let factors = ""
    let codefs = ""

    if (filterCaseOpenDate && filterCaseOpenDate?.length > 0) {
      caseOpen = filterCaseOpenDate.join(",")
    }
    if (filterCaseClosedDate && filterCaseClosedDate?.length > 0) {
      caseClosed = filterCaseClosedDate.join(",")
    }
    if (filterOpenDate && filterOpenDate?.length > 0) {
      Invest_Open = filterOpenDate.join(",")
    }
    if (filterClosedDate && filterClosedDate?.length > 0) {
      Invest_Closed = filterClosedDate.join(",")
    }
    if (filterCrimeDate && filterCrimeDate?.length > 0) {
      CrimeDate = filterCrimeDate.join(",")
    }

    if (filterArrestDate && filterArrestDate?.length > 0) {
      arrestDate = filterArrestDate.join(",")
    }
    if (filterDateDealthSought && filterDateDealthSought?.length > 0) {
      DateDealthSought = filterDateDealthSought.join(",")
    }
    if (filterAggravatingFactors && filterAggravatingFactors?.length > 0) {
      factors = filterDateDealthSought.join(",")
    }

    if (filterCodef && filterCodef?.length > 0) {
      let mapCodef = filterCodef?.map((map_ele: any) => {
        let defId = "0"
        if (map_ele) {
          let splitArray = String(map_ele).split(" - ")
          if (splitArray[0]) {
            defId = splitArray[0]
          }
        }
        return defId
      })
      codefs = mapCodef.join(",")
    }

    let queryString = `?page=1&limit=${limitPage}`

    queryString += `&caseTitle=${filterCaseTitle}`
    queryString += `&firstName=${filterFirstName}`
    queryString += `&lastName=${filterLastName}`
    queryString += `&status=${filterStatus}`
    queryString += `&caseOpen=${caseOpen}`
    queryString += `&caseClosed=${caseClosed}`
    queryString += `&openDate=${Invest_Open}`
    queryString += `&closedDate=${Invest_Closed}`
    queryString += `&consulate=${filterAssignConsulate}`

    queryString += `&caseNumber=${filterCaseNumber}`
    queryString += `&crimeDate=${CrimeDate}`
    queryString += `&crimeType=${filterCrimeType}`
    queryString += `&state=${filterState}`
    queryString += `&county=${filterCounty}`
    queryString += `&districtCourt=${filterDistrictCourt}`
    queryString += `&codefendant=${codefs}`

    queryString += `&dateDealthSought=${DateDealthSought}`
    queryString += `&arrestDate=${arrestDate}`
    queryString += `&arrestPlace=${filterArrestPlace}`
    queryString += `&arrestState=${filterArrestState}`
    queryString += `&arrestCounty=${filterArrestCounty}`
    queryString += `&custody=${filterCustody ? filterCustody : ""}`
    queryString += `&proceduralStatus=${filterProceduralStatus}`
    queryString += `&deathNoticed=${filterDeathNoticed}`
    queryString += `&deathPenalityTrail=${filterDeathPenalityTrail}`
    queryString += `&pleaBargainOffered=${filterPleaBargainOffered}`
    queryString += `&aggravatingFactors=${factors}`

    return queryString
  }

  const applyFilter = async (
    advanceFilter: any,
    updatePage: any,
    updateLimit: any,
    removeKey: any,
    groupDateRange: any
  ) => {
    try {
      setTimeout(() => {
        let divElement: any = showfilterRef.current
        let elemRect = divElement?.getBoundingClientRect()
        if (elemRect) {
          let elemHeight = Math.ceil(
            Number(elemRect?.height ? elemRect?.height : 0) + 82
          )
          setFilterHeight(`${elemHeight}px`)
        }
      }, 3000)

      setFilterIsOpen(false)
      setIsLoading(true)
      const queryString = buildQueryStringForFilterAndExport()
      let dateRange = ""
      let caseOpen = ""
      let caseClosed = ""
      let Invest_Open = ""
      let Invest_Closed = ""
      let CrimeDate = ""
      let arrestDate = ""
      let DateDealthSought = ""
      let factors = ""
      let codefs = ""

      if (filterDateRange && filterDateRange?.length > 0) {
        dateRange = filterDateRange.join(",")
      }

      if (filterCaseOpenDate && filterCaseOpenDate?.length > 0) {
        caseOpen = filterCaseOpenDate.join(",")
      }
      if (filterCaseClosedDate && filterCaseClosedDate?.length > 0) {
        caseClosed = filterCaseClosedDate.join(",")
      }
      if (filterOpenDate && filterOpenDate?.length > 0) {
        Invest_Open = filterOpenDate.join(",")
      }
      if (filterClosedDate && filterClosedDate?.length > 0) {
        Invest_Closed = filterClosedDate.join(",")
      }
      if (filterCrimeDate && filterCrimeDate?.length > 0) {
        CrimeDate = filterCrimeDate.join(",")
      }

      if (filterArrestDate && filterArrestDate?.length > 0) {
        arrestDate = filterArrestDate.join(",")
      }
      if (filterDateDealthSought && filterDateDealthSought?.length > 0) {
        DateDealthSought = filterDateDealthSought.join(",")
      }
      if (filterAggravatingFactors && filterAggravatingFactors?.length > 0) {
        factors = filterDateDealthSought.join(",")
      }

      if (filterCodef && filterCodef?.length > 0) {
        let mapCodef = filterCodef?.map((map_ele: any) => {
          let defId = "0"
          if (map_ele) {
            let splitArray = String(map_ele).split(" - ")
            if (splitArray[0]) {
              defId = splitArray[0]
            }
          }
          return defId
        })
        codefs = mapCodef.join(",")
      }

      let filterObj: any = {
        caseOpen: caseOpen,
        caseClosed: caseClosed,
        investigationOpen: Invest_Open,
        investigationClose: Invest_Closed,
        crimeDate: CrimeDate,
        codefendant: codefs,
        dateDealthSought: DateDealthSought,
        arrestDate: arrestDate,
        caseID: filterCaseID,
        defID: filterDefendantID,
        caseTitle: filterCaseTitle,
        firstName: filterFirstName,
        lastName: filterLastName,
        status: filterStatus,
        consulate: filterAssignConsulate,
        caseNumber: filterCaseNumber,
        crimeType: filterCrimeType,
        state: filterState,
        county: filterCounty,
        districtCourt: filterDistrictCourt,
        arrestPlace: filterArrestPlace,
        arrestState: filterArrestState,
        arrestCounty: filterCustody ? filterCustody : "",
        proceduralStatus: filterProceduralStatus,
        deathNoticed: filterDeathNoticed,
        deathPenalityTrail: filterDeathPenalityTrail,
        pleaBargainOffered: filterPleaBargainOffered,
        aggravatingFactors: factors,
        caseOpenedNullCheck: caseOpenedNullCheck,
        caseClosedNullCheck: caseClosedNullCheck,
        investigationOpenedNullCheck: investigationOpenedNullCheck,
        investigationClosedNullCheck: investigationClosedNullCheck,
        page: updatePage,
        limit: updateLimit,
      }

      if (groupDateRange) {
        filterObj.dateRange = dateRange
      }

      let mergeFilter: any = filterObj
      if (advanceFilter && typeof advanceFilter === "object") {
        mergeFilter = { ...filterObj, ...advanceFilter }
        setFilterObject(advanceFilter)
        setAdvcaseFilterObject(advanceFilter)
      }

      // removeBatch
      if (removeKey) {
        if (mergeFilter.hasOwnProperty(removeKey)) {
          delete mergeFilter[removeKey]
        }
      }

      setAppliedCaseFilters(mergeFilter)

      let url = `${baseURL}/v1/case`
      const response = await axiosInstance.post(url, mergeFilter)
      let listData = response?.data?.data?.rows
        ? response?.data?.data?.rows
        : []

      setCaseDate(listData)
      setShowFilters(true)
      setFiltersApplied(true)
      setAdvanceFilterCheck(false)

      setDeleteEnable(true)
      setEditEnable(true)
      setDeleteIds([])
      setEditObj("")
      setCurrentpage(updatePage)
      setLimitPage(updateLimit)
      table?.toggleAllPageRowsSelected(false)
      setTotalPage(
        response?.data?.data?.totalPages ? response?.data?.data?.totalPages : 1
      )
      setTotalItems(
        response?.data?.data?.totalItems ? response?.data?.data?.totalItems : 0
      )
      setIsLoading(false)
    } catch (error) {}
  }

  const advanceCaseFilter = async (
    filterData: any,
    updatePage: any,
    updateLimit: any
  ) => {
    try {
      console.log("filterData-----", filterData)
      if (typeof filterData === "object") {
        filterData.page = updatePage ? updatePage : 0
        filterData.limit = updateLimit ? updateLimit : 1
      }
      setAdvanceFilterCheck(true)
      setFiltersApplied(false)
      setFilterObject(filterData)

      setFilterIsOpen(false)
      const filterResult = await axiosInstance.post(
        `${baseURL}/v1/case/defendantCaseLink/filter`,
        filterData
      )
      console.log("filterResult", filterResult?.data?.data?.rows)
      setCaseDate(
        filterResult?.data?.data?.rows ? filterResult?.data?.data?.rows : []
      )
      setShowFilters(true)
      setCurrentpage(updatePage)
      setLimitPage(updateLimit)
      setTotalPage(
        filterResult?.data?.data?.totalPages
          ? filterResult?.data?.data?.totalPages
          : 0
      )
      setTotalItems(
        filterResult?.data?.data?.totalItems
          ? filterResult?.data?.data?.totalItems
          : 0
      )
    } catch (err) {}
  }

  const handlePage = async (event: any) => {
    if (event.key === "Enter") {
      if (event.target.value) {
        const queryParams = new URLSearchParams()
        queryParams.set("page", event.target.value)
        queryParams.set("limit", limitPage)
        if (window.location.pathname) {
          const newUrl = window.location.pathname + "?" + queryParams.toString()
          window.history.pushState({}, "", newUrl)
        }
      }
      let Value = event.target.value
      setCurrentpage(Value)
      clearTimeout(timer)
      const newTimer = setTimeout(() => {
        // if (Value) {
        //   fetchData(Value, limitPage)
        // } else {
        //   fetchData(currentPage, limitPage)
        // }
        if (filterValue) {
          filterSearch(filterValue, currentPage, limitPage)
        } else {
          if (filtersApplied) {
            applyFilter(filterObject, currentPage, limitPage, "", "")
          } else {
            fetchData(currentPage, limitPage)
          }
        }
      }, 500)
      setTimer(newTimer)
    }
  }

  const selectAllChecked = (value: any) => {
    try {
      if (value) {
        let deleteAllIds: any = []
        let collectionBoxes = document.querySelectorAll(".mycheckbox")
        collectionBoxes.forEach((checkbox: any) => {
          checkbox.checked = true
          if (checkbox.id) {
            deleteAllIds.push(checkbox.id)
          }
        })

        setDeleteEnable(false)
        setEditEnable(true)
        setDeleteIds(deleteAllIds)
        setEditObj("")
        handleSelectedRows(deleteAllIds)
      } else {
        let collectionBoxes = document.querySelectorAll(".mycheckbox")
        collectionBoxes.forEach((checkbox: any) => {
          checkbox.checked = false
        })
        setDeleteEnable(true)
        setEditEnable(true)
        setDeleteIds([])
        setEditObj("")
        handleSelectedRows([])
      }
    } catch (err) {}
  }

  React.useEffect(() => {
    const InitaialFecthData = async () => {
      let page: any = searchParams?.get("page")
        ? searchParams?.get("page")
        : currentPage
      setCurrentpage(page)
      let limit: any = searchParams?.get("limit")
        ? searchParams?.get("limit")
        : limitPage
      setLimitPage(limit)
      fetchData(page, limit)
    }
    InitaialFecthData()
    const fetchUserRoles = async () => {
      const session = await getSession()
      setUserRoles(session?.user?.roles || [])
    }

    fetchUserRoles()
    getCodeTypes()
  }, [])

  const handleDelete = async (id: any) => {
    try {
      if (!id) {
        return
      }
      setIsLoading(true)
      await axiosInstance.delete(`${baseURL}/v1/case/${id}`)
      toast({
        variant: "default",
        description: "Prison Deleted Successfully",
        style: {
          background: "#03C03C",
        },
      })
      let uncheckAll = document.querySelectorAll("input[type=checkbox]")
      uncheckAll.forEach((checkbox: any) => {
        checkbox.checked = false
      })
      table?.toggleAllPageRowsSelected(false)
      setIsOpen(false)
      setIsOpen1(false)
      fetchData(currentPage, limitPage)
      setSelectedRows([])
    } catch (error: any) {
      console.log("Error deleting item:", error.message)
    }
  }
  const [showColumnIsOpen, setShowColumnIsOpen] = React.useState(false)

  function handleSelectedRows(selectedRows: any) {
    setSelectedRows(selectedRows)
  }

  const getCodeTypes = async () => {
    let params = "Case Status"
    const response = await axiosInstance.get(
      `${baseURL}/v1/codes/codeType/${params}`
    )
    const resp = response?.data?.data ? response?.data?.data : []
    setStatusTypeList(resp)

    const responseConsulate = await axiosInstance.get(
      `${baseURL}/v1/codes/codeType/Consulate Type`
    )
    const typeConsulate = responseConsulate?.data?.data
      ? responseConsulate?.data?.data
      : []
    setConsulateTypeList(typeConsulate)

    const responseCrime = await axiosInstance.get(
      `${baseURL}/v1/codes/codeType/Crime Type`
    )
    const CrimeList = responseCrime?.data?.data ? responseCrime.data.data : []
    setCrimeTypeList(CrimeList)

    let courtType = await axiosInstance.get(
      `${baseURL}/v1/codes/codeType/Court Type`
    )
    if (courtType?.data?.data) {
      setCourtTypeList(courtType?.data?.data)
    }

    let factorList = await axiosInstance.get(
      `${baseURL}/v1/codes/codeType/Aggravating Factor`
    )
    if (factorList?.data?.data) {
      setAggravFactorTypeList(factorList?.data?.data)
    }
  }

  function DeleteButton() {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="ml-1">
          <DialogTrigger asChild>
            <Button
              disabled={deleteEnable}
              variant="outline"
              className="flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
            >
              <Icons.deleteIcon className="mb-1 h-3.5 w-5" /> Delete
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[400px] dark:bg-slate-900">
            <DialogHeader className="border-b border-inherit ">
              <DialogTitle className="mb-2">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <DialogDescription className="py-2 text-sm">
              Are you sure you want to delete {deleteids.length}{" "}
              {deleteids.length === 1 ? "item" : "items"}?
            </DialogDescription>
            <DialogFooter>
              <DialogClose className="text-black-600 pr-6 text-xs">
                Cancel
              </DialogClose>
              <Button
                type="submit"
                variant="outline"
                onClick={() => handleDelete(deleteids)}
                className="h-8 bg-transparent py-3 text-xs"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </div>
      </Dialog>
    )
  }

  const showAllColumnsHandler = (table: any) => {
    setShowAllColumns(!showAllColumns)
    if (showAllColumns) {
      table.setColumnVisibility(hiddenColumns)
    } else {
      const makeAllColumnsVissible = Object.fromEntries(
        Object.entries(hiddenColumns).map(([key, value]) => [
          key,
          value === false ? true : value,
        ])
      )
      table.setColumnVisibility(makeAllColumnsVissible)
    }
  }

  const handleExport = async (table: any) => {
    const visibleColumnsArray = table.getVisibleFlatColumns()
    let visibleColumns = visibleColumnsArray.reduce(
      (visibleColumns: [], column: any) => {
        if (column?.id !== "id") {
          visibleColumns.push(column?.id)
        }
        return visibleColumns
      },
      []
    )
    let exportPayload = appliedCaseFilters || {}
    exportPayload.visibleColumns = visibleColumns
    let url = `${baseURL}/v1/case/exportFilteredCases?filter=${filterValue} `
    const response = await axiosInstance.post(url, exportPayload, {
      responseType: "blob",
    })
    if (response?.status == 200 && response?.data) {
      const fileURL = window.URL.createObjectURL(response?.data)
      let alink = document.createElement("a")
      alink.href = fileURL
      alink.download = `Cases.xlsx`
      alink.click()
      toast({
        variant: "default",
        description: "Cases are getting exported",
        style: {
          background: "#03C03C",
        },
      })
    } else {
      toast({
        variant: "default",
        description: "Error while exporting the cases",
        style: {
          background: "red",
        },
      })
    }
  }
  // Include Null Check
  const [caseOpenedNullCheck, setCaseOpenedNullCheck] = React.useState(false)
  const [caseClosedNullCheck, setCaseClosedNullCheck] = React.useState(false)
  const [investigationOpenedNullCheck, setInvestigationOpenedNullCheck] =
    React.useState(false)
  const [investigationClosedNullCheck, setCaseInvestigationClosedNullCheck] =
    React.useState(false)

  return (
    <div className="overscroll-y-none px-2 pb-1 pt-2">
      <div className="dark-container relative h-[calc(100vh-72px)] rounded-lg border bg-white p-2">
        <div className="flex">
          <h2 className="text-l ml-2 mt-0.5 font-bold">Cases</h2>
          <div className="relative ml-5 h-8">
            <Input
              className="w-36 md:w-[384px] pl-9 text-xs"
              onChange={handleSearch}
              value={filterValue}
              placeholder="Search for Case ID, Case Title, Defendant Name"
            />
            <Icons.search className="absolute top-0 ml-2.5  h-8 w-4 text-muted-foreground" />
          </div>

          <div className="relative mb-2 ml-auto flex">
            <div>
              <Button
                variant="outline"
                onClick={() => handleExport(table)}
                className="mr-2 flex h-8 items-center rounded-lg bg-transparent px-1.5 md:px-3.5 py-1 text-xs xl:py-1.5"
              >
                <Icons.save className="h-3.5 w-5" />
              <span className="hidden md:block">Export</span>  
              </Button>
            </div>
            <div>
              <Sheet
                open={filterIsOpen}
                onOpenChange={(e) => {
                  setFilterIsOpen(e)
                  setCaseFilterIsOpen(false)
                }}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex h-8 items-center rounded-lg bg-transparent px-1.5 md:px-3.5 py-1 text-xs xl:py-1.5"
                  >
                    <Icons.filter className="h-3.5 w-5" />
                     <span className="hidden md:block">Filter</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="p-4 md:p-6">
                  <SheetHeader className="text-start">
                    <SheetTitle className="border-b">
                      <div className="flex justify-between">
                        <div className="pt-2"> Filter</div>
                        <div className="flex">
                          <div className="mb-1">
                            <div className="">
                              <CaseFilterContext.Provider
                                value={appliedCaseFilters}
                              >
                                <CaseDialogFilter
                                  text={"filter"}
                                  applyFilterData={filterObject}
                                  closeCase={(filterData: any) => {
                                    applyFilter(
                                      filterData,
                                      currentPage,
                                      limitPage,
                                      "",
                                      ""
                                    )
                                  }}
                                />
                              </CaseFilterContext.Provider>
                            </div>
                          </div>
                          <div className="mb-1 pt-1 font-thin">|</div>
                          <div>
                            <Dialog
                              open={caseFilterIsOpen}
                              onOpenChange={(e) => {
                                setCaseFilterIsOpen(e)
                              }}
                            >
                              <DialogTrigger asChild>
                                <div className="flex">
                                  <div className="ml-2">
                                    <CalendarIcon
                                      className="mt-3 h-4 w-4 cursor-pointer"
                                      onClick={() => {
                                        setCaseFilterIsOpen(true)
                                      }}
                                    />
                                    {/* <Button
                                      variant="outline"
                                      className="h-4 w-4"
                                      size="icon"
                                      onClick={() => {
                                        setCaseFilterIsOpen(true)
                                      }}
                                    >
                                      <CalendarIcon className="mt-3 h-4 w-4 cursor-pointer" />
                                    </Button> */}
                                  </div>
                                </div>
                              </DialogTrigger>

                              <DialogContent className="max-w-[350px] dark:bg-slate-900">
                                <DialogHeader className="border-b border-inherit">
                                  <DialogTitle className="mb-2">
                                    Case Date Range Filter
                                  </DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                  <div className="grid grid-cols-1 items-center gap-2">
                                    <div>
                                      <Label className="items-center text-[0.7rem] font-semibold text-gray-600">
                                        Date Range
                                      </Label>
                                      <div>
                                        <Popover
                                          open={dateRangeIsOpen}
                                          onOpenChange={(e) => {
                                            if (!e) {
                                              setDateRangeIsOpen(e)
                                            }
                                          }}
                                        >
                                          <PopoverTrigger asChild>
                                            <div className="flex h-8 w-[320px] items-center rounded-md border py-2">
                                              <Input
                                                defaultValue={
                                                  filterDateRange &&
                                                  filterDateRange[0] &&
                                                  moment(
                                                    filterDateRange[0]
                                                  ).isValid()
                                                    ? convertToUTCDate(
                                                        filterDateRange[0]
                                                      )
                                                    : ""
                                                }
                                                onChange={(e) => {
                                                  let filterDate =
                                                    e.target.value
                                                  if (
                                                    moment(
                                                      filterDate,
                                                      "MM/DD/YYYY",
                                                      true
                                                    ).isValid()
                                                  ) {
                                                    let oldDateFilter = [
                                                      ...filterDateRange,
                                                    ]
                                                    oldDateFilter[0] =
                                                      moment(filterDate).format(
                                                        "YYYY-MM-DD"
                                                      )
                                                    setFilterDateRange(
                                                      oldDateFilter
                                                    )
                                                  }
                                                }}
                                                className="w-[110px] appearance-none border-none bg-transparent py-1 text-xs  text-gray-500 focus:outline-none  focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                                type="text"
                                                placeholder="MM/DD/YYYY"
                                              />
                                              <label className="mx-2">
                                                {" "}
                                                to{" "}
                                              </label>
                                              <Input
                                                defaultValue={
                                                  filterDateRange &&
                                                  filterDateRange[1] &&
                                                  moment(
                                                    filterDateRange[1]
                                                  ).isValid()
                                                    ? convertToUTCDate(
                                                        filterDateRange[1]
                                                      )
                                                    : ""
                                                }
                                                onChange={(e) => {
                                                  let filterDate =
                                                    e.target.value
                                                  if (
                                                    moment(
                                                      filterDate,
                                                      "MM/DD/YYYY",
                                                      true
                                                    ).isValid()
                                                  ) {
                                                    let oldDateFilter = [
                                                      ...filterDateRange,
                                                    ]
                                                    oldDateFilter[1] =
                                                      moment(filterDate).format(
                                                        "YYYY-MM-DD"
                                                      )
                                                    setFilterDateRange(
                                                      oldDateFilter
                                                    )
                                                  }
                                                }}
                                                className="w-[110px] appearance-none border-none bg-transparent py-1 text-xs text-gray-500 focus:outline-none  focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                                type="text"
                                                placeholder="MM/DD/YYYY"
                                              />
                                              <div className="flex w-full justify-end">
                                                <CalendarIcon
                                                  className="mr-3 h-4 w-4"
                                                  onClick={() => {
                                                    setDateRangeIsOpen(true)
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          </PopoverTrigger>
                                          <PopoverContent className="thin-scrollbar max-h-50 m-1 w-[410px] overflow-hidden whitespace-nowrap p-0 text-xs text-black">
                                            <Calendar
                                              defaultView="century"
                                              selectRange={true}
                                              showDoubleView={true}
                                              onChange={(dateFields: any) => {
                                                let startDate = moment(
                                                  dateFields[0]
                                                ).format("YYYY-MM-DD")
                                                let endDate = moment(
                                                  dateFields[1]
                                                ).format("YYYY-MM-DD")
                                                let dateArray = [
                                                  startDate,
                                                  endDate,
                                                ]
                                                setFilterDateRange(dateArray)
                                                setDateRangeIsOpen(false)
                                              }}
                                            />
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                    </div>
                                  </div>
                                </DialogDescription>
                                <DialogFooter className="gap-5">
                                  {/* <DialogClose className="text-black-600 pr-1 text-xs">
                  </DialogClose> */}
                                  <div className="">
                                    <Button
                                      variant="link"
                                      type="button"
                                      onClick={(e) => {
                                        setFilterDateRange([])
                                        setFiltersApplied(false)
                                        setShowFilters(false)
                                        setFilterIsOpen(false)
                                        setDateRangeGroupApplied(false)
                                        fetchData(currentPage, limitPage)
                                      }}
                                      className="text-black-700 items-center px-2 py-1 text-xs hover:underline"
                                    >
                                      <Icons.close className="mr-1 h-3 w-3" />
                                      Clear Filter
                                    </Button>
                                    <Button
                                      className="ml-2 h-8 rounded-lg bg-red-700 px-3 py-2 text-xs text-destructive-foreground hover:bg-red-400"
                                      type="button"
                                      onClick={() => {
                                        setDateRangeGroupApplied(true)
                                        applyFilter(
                                          "",
                                          currentPage,
                                          limitPage,
                                          "",
                                          true
                                        )
                                      }}
                                    >
                                      Apply Filter
                                    </Button>
                                  </div>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </SheetTitle>
                    <SheetDescription className="thin-scrollbar mb-2 h-[calc(100vh-144px)] overflow-y-auto p-0">
                      <div className="mt-2 grid grid-cols-1">
                        <div className="flex">
                          <div className="">
                            <Label
                              className="text-[0.7rem] font-semibold text-gray-600"
                              htmlFor="case-ID"
                            >
                              Case ID
                            </Label>
                            <Input
                              id="case-ID"
                              type="text"
                              className="mt-1 h-8 w-[155px] rounded-lg border py-2 text-xs"
                              placeholder="Case ID"
                              value={filterCaseID}
                              onChange={(e) => {
                                setFilterCaseID(e.target.value)
                              }}
                            />
                          </div>
                          <div className="ml-2">
                            <Label
                              className="text-[0.7rem] font-semibold text-gray-600"
                              htmlFor="Defendant-ID"
                            >
                              Defendant ID
                            </Label>
                            <Input
                              id="Defendant-ID"
                              type="text"
                              className="mt-1 h-8 w-[155px] rounded-lg border text-xs"
                              placeholder="Defendant ID"
                              value={filterDefendantID}
                              onChange={(e) => {
                                setFilterDefendantID(e.target.value)
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-2 items-center gap-2">
                        <div className="col-span-2">
                          <Label
                            className="text-[0.7rem] font-semibold text-gray-600"
                            htmlFor="maternal-lastname"
                          >
                            Case Title
                          </Label>
                          <Input
                            id="maternal-lastname"
                            type="text"
                            className="mt-1 h-8 w-[270px] md:w-[320px] rounded-lg border py-2 pl-3 text-xs"
                            placeholder="Case Title"
                            value={filterCaseTitle}
                            onChange={(e) => {
                              setFilterCaseTitle(e.target.value)
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 items-center gap-2">
                        <div className="col-span-2">
                          <Label
                            className="text-[0.7rem] font-semibold text-gray-600"
                            htmlFor="maternal-lastname"
                          >
                            Last Name
                          </Label>
                          <Input
                            id="maternal-lastname"
                            type="text"
                            className="mt-1 h-8 w-[270px] md:w-[320px] rounded-lg border py-2 pl-3 text-xs"
                            placeholder="Last Name"
                            value={filterLastName}
                            onChange={(e) => {
                              setFilterLastName(e.target.value)
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label
                          className="text-[0.7rem] font-semibold text-gray-600"
                          htmlFor="firstName"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          className="mt-1 h-8 w-[270px] md:w-[320px] rounded-lg border py-2 pl-3 text-xs"
                          placeholder="First Name"
                          value={filterFirstName}
                          onChange={(e) => {
                            setFilterFirstName(e.target.value)
                          }}
                        />
                      </div>
                      <div className="mt-3 grid grid-cols-2 items-center gap-2">
                        <div className="col-span-2">
                          <h4 className="text-[0.7rem] font-semibold text-gray-600">
                            Assign Consulate
                          </h4>
                          <Popover
                            open={assignIsOpen}
                            onOpenChange={setAssignIsOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={assignIsOpen}
                                className="h-8 w-[270px] md:w-[320px] justify-between text-xs"
                              >
                                <span className="text-xs">
                                  {filterAssignConsulate
                                    ? filterAssignConsulate
                                    : "Select Consulate"}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[270px] md:w-[320px] p-0 text-xs">
                              <Command className="text-xs dark:bg-slate-900">
                                <CommandInput
                                  placeholder="Select Assign"
                                  className="h-8 text-xs"
                                />
                                <CommandEmpty>No Found Assign</CommandEmpty>
                                <CommandGroup className="thin-scrollbar h-[150px] overflow-y-scroll text-xs dark:bg-slate-900">
                                  {consulateTypeList.map((framework: any) => {
                                    return (
                                      <CommandItem
                                        key={framework.codeCode}
                                        value={framework}
                                        className="whitespace-nowrap text-xs"
                                        onSelect={(currentValue) => {
                                          setFilterAssignConsulate(
                                            framework.codeCode
                                          )
                                          setAssignIsOpen(false)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            filterAssignConsulate ==
                                              framework.codeCode
                                              ? "opacity-100"
                                              : "opacity-0"
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
                        </div>

                        <div>
                          <Label className="text-[0.7rem] font-semibold text-gray-600">
                            Case Status
                          </Label>
                          <Select
                            value={filterStatus}
                            onValueChange={(e) => {
                              setFilterStatus(String(e))
                            }}
                          >
                            <SelectTrigger className="mt-1 h-8 w-[270px] md:w-[320px] text-xs">
                              <SelectValue
                                placeholder="Select Type"
                                className="text-xs"
                              >
                                {filterStatus ? filterStatus : "Select Type"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="h-[300px] overflow-y-auto text-xs dark:bg-slate-900">
                              <SelectGroup>
                                {statusTypeList &&
                                  statusTypeList?.map(
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
                      <div className="mt-2 grid grid-cols-1 items-center gap-2">
                        <div>
                          {/* <div className="flex item-center justify-between">
                          <Label className="text-[0.7rem] items-center font-semibold text-gray-600">
                            Case Opened
                          </Label>
                        </div> */}
                          <div className="my-2 mt-4 flex items-center">
                            <Label className="items-center text-[0.7rem] font-semibold text-gray-600">
                              Case Opened
                            </Label>
                            <div className="flex items-center">
                            <Checkbox
                              checked={caseOpenedNullCheck}
                              onCheckedChange={(e: any) => {
                                setCaseOpenedNullCheck(e)
                              }}
                              className="ml-5 border-slate-600 disabled:cursor-text disabled:p-0 disabled:opacity-100"
                            />
                            <span className="mx-2 text-center text-xs">
                              Include Null
                            </span>
                            </div>
                          </div>
                          <div>
                            <Popover
                              open={caseOpenDateIsOpen}
                              onOpenChange={(e) => {
                                if (!e) {
                                  setCaseOpenDateIsOpen(e)
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <div className="flex h-8 w-[320px] items-center rounded-md border py-2">
                                  <Input
                                    defaultValue={
                                      filterCaseOpenDate &&
                                      filterCaseOpenDate[0] &&
                                      moment(filterCaseOpenDate[0]).isValid()
                                        ? convertToUTCDate(
                                            filterCaseOpenDate[0]
                                          )
                                        : ""
                                    }
                                    onChange={(e) => {
                                      let filterDate = e.target.value
                                      if (
                                        moment(
                                          filterDate,
                                          "MM/DD/YYYY",
                                          true
                                        ).isValid()
                                      ) {
                                        let oldDateFilter = [
                                          ...filterCaseOpenDate,
                                        ]
                                        oldDateFilter[0] =
                                          moment(filterDate).format(
                                            "YYYY-MM-DD"
                                          )
                                        setFilterCaseOpenDate(oldDateFilter)
                                      }
                                    }}
                                    className="w-[110px] appearance-none border-none bg-transparent py-1 text-xs  text-gray-500 focus:outline-none  focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="MM/DD/YYYY"
                                  />
                                  <label className="mx-2"> to </label>
                                  <Input
                                    defaultValue={
                                      filterCaseOpenDate &&
                                      filterCaseOpenDate[1] &&
                                      moment(filterCaseOpenDate[1]).isValid()
                                        ? convertToUTCDate(
                                            filterCaseOpenDate[1]
                                          )
                                        : ""
                                    }
                                    onChange={(e) => {
                                      let filterDate = e.target.value
                                      if (
                                        moment(
                                          filterDate,
                                          "MM/DD/YYYY",
                                          true
                                        ).isValid()
                                      ) {
                                        let oldDateFilter = [
                                          ...filterCaseOpenDate,
                                        ]
                                        oldDateFilter[1] =
                                          moment(filterDate).format(
                                            "YYYY-MM-DD"
                                          )
                                        setFilterCaseOpenDate(oldDateFilter)
                                      }
                                    }}
                                    className="w-[110px] appearance-none border-none bg-transparent py-1 text-xs text-gray-500 focus:outline-none  focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="MM/DD/YYYY"
                                  />
                                  {/* <Button onClick={() => {
                                    setCaseOpenDateIsOpen(true)
                                  }}
                                    variant={"outline"}
                                    className={cn(
                                      "w-full h-8 justify-end text-left border-none text-xs font-normal hover:bg-transparent px-1",
                                      !filterCaseOpenDate &&
                                      "text-muted-foreground"
                                    )}
                                  > */}
                                  <div className="flex w-full justify-end">
                                    <CalendarIcon
                                      className="mr-3 h-4 w-4"
                                      onClick={() => {
                                        setCaseOpenDateIsOpen(true)
                                      }}
                                    />
                                  </div>
                                  {/* {filterCaseOpenDate?.length > 0 &&
                                    filterCaseOpenDate[0] &&
                                    moment(filterCaseOpenDate[0]).isValid()
                                    ? convertToUTCDate(filterCaseOpenDate[0])
                                    : "Pick a date"}{" "}
                                  {filterCaseOpenDate?.length == 2
                                    ? " to "
                                    : ""}
                                  {filterCaseOpenDate?.length > 0 &&
                                    filterCaseOpenDate[1] &&
                                    moment(filterCaseOpenDate[1]).isValid()
                                    ? convertToUTCDate(filterCaseOpenDate[1])
                                    : ""} */}
                                  {/* </Button> */}
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="thin-scrollbar max-h-50 m-1 w-[380px] md:w-[410px] overflow-hidden whitespace-nowrap p-0 text-xs text-black">
                                <Calendar
                                  defaultView="century"
                                  selectRange={true}
                                  showDoubleView={true}
                                  onChange={(dateFields: any) => {
                                    let startDate = moment(
                                      dateFields[0]
                                    ).format("YYYY-MM-DD")
                                    let endDate = moment(dateFields[1]).format(
                                      "YYYY-MM-DD"
                                    )
                                    let dateArray = [startDate, endDate]
                                    setFilterCaseOpenDate(dateArray)
                                    setCaseOpenDateIsOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 items-center gap-2">
                        <div>
                          {/* <Label className="text-[0.7rem] font-semibold text-gray-600">
                            Case Closed
                          </Label> */}
                          <div className="my-2 mt-4 flex items-center">
                            <Label className="items-center text-[0.7rem] font-semibold text-gray-600">
                              Case Closed
                            </Label>
                            <div className="flex items-center">
                            <Checkbox
                              checked={caseClosedNullCheck}
                              onCheckedChange={(e: any) => {
                                setCaseClosedNullCheck(e)
                              }}
                              className="ml-5 border-slate-600 disabled:cursor-text disabled:p-0 disabled:opacity-100"
                            />
                            <span className="mx-2 text-center text-xs">
                              Include Null
                            </span>
                            </div>
                          </div>
                          <div>
                            <Popover
                              open={caseCloseDateIsOpen}
                              // onOpenChange={setCaseCloseDateIsOpen}
                              onOpenChange={(e) => {
                                if (!e) {
                                  setCaseCloseDateIsOpen(e)
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <div className="flex h-8 w-[320px] items-center rounded-md border py-2">
                                  <Input
                                    defaultValue={
                                      filterCaseClosedDate &&
                                      filterCaseClosedDate[0] &&
                                      moment(filterCaseClosedDate[0]).isValid()
                                        ? convertToUTCDate(
                                            filterCaseClosedDate[0]
                                          )
                                        : ""
                                    }
                                    onChange={(e) => {
                                      let filterDate = e.target.value
                                      if (
                                        moment(
                                          filterDate,
                                          "MM/DD/YYYY",
                                          true
                                        ).isValid()
                                      ) {
                                        let oldDateFilter = [
                                          ...filterCaseClosedDate,
                                        ]
                                        oldDateFilter[0] =
                                          moment(filterDate).format(
                                            "YYYY-MM-DD"
                                          )
                                        setFilterCaseClosedDate(oldDateFilter)
                                      }
                                    }}
                                    className="w-[110px] appearance-none border-none bg-transparent py-1 text-xs  text-gray-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="MM/DD/YYYY"
                                  />
                                  <label className="mx-2"> to </label>
                                  <Input
                                    defaultValue={
                                      filterCaseClosedDate &&
                                      filterCaseClosedDate[1] &&
                                      moment(filterCaseClosedDate[1]).isValid()
                                        ? convertToUTCDate(
                                            filterCaseClosedDate[1]
                                          )
                                        : ""
                                    }
                                    onChange={(e) => {
                                      let filterDate = e.target.value
                                      if (
                                        moment(
                                          filterDate,
                                          "MM/DD/YYYY",
                                          true
                                        ).isValid()
                                      ) {
                                        let oldDateFilter = [
                                          ...filterCaseClosedDate,
                                        ]
                                        oldDateFilter[1] =
                                          moment(filterDate).format(
                                            "YYYY-MM-DD"
                                          )
                                        setFilterCaseClosedDate(oldDateFilter)
                                      }
                                    }}
                                    className="w-[110px] appearance-none border-none bg-transparent py-1 text-xs text-gray-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="MM/DD/YYYY"
                                  />
                                  {/* <Button
                                onClick={() => {
                                  setCaseCloseDateIsOpen(true)
                                }}
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-8 justify-end text-left text-xs font-normal border-none hover:bg-transparent px-1",
                                    !filterCaseClosedDate &&
                                    "text-muted-foreground"
                                  )}
                                > */}
                                  <div className="flex w-full justify-end">
                                    <CalendarIcon
                                      className="mr-3 h-4 w-4"
                                      onClick={() => {
                                        setCaseCloseDateIsOpen(true)
                                      }}
                                    />
                                  </div>
                                  {/* {filterCaseClosedDate?.length > 0 &&
                                    filterCaseClosedDate[0] &&
                                    moment(filterCaseClosedDate[0]).isValid()
                                    ? convertToUTCDate(filterCaseClosedDate[0])
                                    : "Pick a date"}{" "}
                                  {filterCaseClosedDate?.length == 2
                                    ? " to "
                                    : ""}
                                  {filterCaseClosedDate?.length > 0 &&
                                    filterCaseClosedDate[1] &&
                                    moment(filterCaseClosedDate[1]).isValid()
                                    ? convertToUTCDate(filterCaseClosedDate[1])
                                    : ""} */}
                                  {/* </Button> */}
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="thin-scrollbar max-h-50 m-1 w-[380px] md:w-[410px] overflow-hidden whitespace-nowrap p-0 text-xs text-black">
                                <Calendar
                                  defaultView="century"
                                  selectRange={true}
                                  showDoubleView={true}
                                  onChange={(dateFields: any) => {
                                    let startDate = moment(
                                      dateFields[0]
                                    ).format("YYYY-MM-DD")
                                    let endDate = moment(dateFields[1]).format(
                                      "YYYY-MM-DD"
                                    )
                                    let dateArray = [startDate, endDate]
                                    setFilterCaseClosedDate(dateArray)
                                    setCaseCloseDateIsOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-1 items-center gap-2">
                        <div>
                          {/* <Label className="text-[0.7rem] font-semibold text-gray-600">
                            Investigation Opened
                          </Label> */}
                          <div className="my-2 mt-4 flex items-center">
                            <Label className="items-center text-[0.7rem] font-semibold text-gray-600">
                              Investigation Opened
                            </Label>
                            <div className="flex items-center">
                            <Checkbox
                              checked={investigationOpenedNullCheck}
                              onCheckedChange={(e: any) => {
                                setInvestigationOpenedNullCheck(e)
                              }}
                              className="ml-5 border-slate-600 disabled:cursor-text disabled:p-0 disabled:opacity-100"
                            />
                            <span className="mx-2 text-center text-xs">
                              Include Null
                            </span>
                            </div>
                          </div>
                          <div>
                            <Popover
                              open={investOpenDateIsOpen}
                              // onOpenChange={setInvestOpenDateIsOpen}
                              onOpenChange={(e) => {
                                if (!e) {
                                  setInvestOpenDateIsOpen(e)
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <div className="flex h-8 w-[320px] items-center rounded-md border py-2">
                                  <Input
                                    defaultValue={
                                      filterOpenDate &&
                                      filterOpenDate[0] &&
                                      moment(filterOpenDate[0]).isValid()
                                        ? convertToUTCDate(filterOpenDate[0])
                                        : ""
                                    }
                                    onChange={(e) => {
                                      let filterDate = e.target.value
                                      if (
                                        moment(
                                          filterDate,
                                          "MM/DD/YYYY",
                                          true
                                        ).isValid()
                                      ) {
                                        let oldDateFilter = [...filterOpenDate]
                                        oldDateFilter[0] =
                                          moment(filterDate).format(
                                            "YYYY-MM-DD"
                                          )
                                        setFilterOpenDate(oldDateFilter)
                                      }
                                    }}
                                    className="w-[110px] appearance-none border-none bg-transparent py-1 text-xs  text-gray-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="MM/DD/YYYY"
                                  />
                                  <label className="mx-2"> to </label>
                                  <Input
                                    defaultValue={
                                      filterOpenDate &&
                                      filterOpenDate[1] &&
                                      moment(filterOpenDate[1]).isValid()
                                        ? convertToUTCDate(filterOpenDate[1])
                                        : ""
                                    }
                                    onChange={(e) => {
                                      let filterDate = e.target.value
                                      if (
                                        moment(
                                          filterDate,
                                          "MM/DD/YYYY",
                                          true
                                        ).isValid()
                                      ) {
                                        let oldDateFilter = [...filterOpenDate]
                                        oldDateFilter[1] =
                                          moment(filterDate).format(
                                            "YYYY-MM-DD"
                                          )
                                        setFilterOpenDate(oldDateFilter)
                                      }
                                    }}
                                    className="w-[110px] appearance-none border-none bg-transparent py-1 text-xs text-gray-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="MM/DD/YYYY"
                                  />
                                  {/* <Button
                                onClick={() => {
                                  setInvestOpenDateIsOpen(true)
                                }}
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-8 justify-end text-left text-xs font-normal border-none hover:bg-transparent px-1",
                                    !filterOpenDate && "text-muted-foreground"
                                  )}
                                > */}
                                  <div className="flex w-full justify-end">
                                    <CalendarIcon className="mr-3 h-4 w-4" />
                                  </div>
                                  {/* {filterOpenDate?.length > 0 &&
                                    filterOpenDate[0] &&
                                    moment(filterOpenDate[0]).isValid()
                                    ? convertToUTCDate(filterOpenDate[0])
                                    : "Pick a date"}{" "}
                                  {filterOpenDate?.length == 2 ? " to " : ""}
                                  {filterOpenDate?.length > 0 &&
                                    filterOpenDate[1] &&
                                    moment(filterOpenDate[1]).isValid()
                                    ? convertToUTCDate(filterOpenDate[1])
                                    : ""} */}
                                  {/* </Button> */}
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="thin-scrollbar max-h-50 m-1 w-[380px] md:w-[410px] overflow-hidden whitespace-nowrap p-0 text-xs text-black">
                                <Calendar
                                  defaultView="century"
                                  selectRange={true}
                                  showDoubleView={true}
                                  onChange={(dateFields: any) => {
                                    let startDate = moment(
                                      dateFields[0]
                                    ).format("YYYY-MM-DD")
                                    let endDate = moment(dateFields[1]).format(
                                      "YYYY-MM-DD"
                                    )
                                    let dateArray = [startDate, endDate]
                                    setFilterOpenDate(dateArray)
                                    setInvestOpenDateIsOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 items-center gap-2">
                        <div>
                          {/* <Label className="text-[0.7rem] font-semibold text-gray-600">
                            Investigation Closed
                          </Label> */}
                          <div className="my-2 mt-4 flex items-center">
                            <Label className="text-[0.7rem] font-semibold text-gray-600">
                              Investigation Closed
                            </Label>
                            <div className="flex items-center">
                            <Checkbox
                              checked={investigationClosedNullCheck}
                              onCheckedChange={(e: any) => {
                                setCaseInvestigationClosedNullCheck(e)
                              }}
                              className="ml-5 border-slate-600 disabled:cursor-text disabled:p-0 disabled:opacity-100"
                            />
                            <span className="mx-2 text-center text-xs">
                              Include Null
                            </span>
                            </div>
                          </div>
                          <div>
                            <Popover
                              open={investCloseDateIsOpen}
                              // onOpenChange={setInvestCloseDateIsOpen}
                              onOpenChange={(e) => {
                                if (!e) {
                                  setInvestCloseDateIsOpen(e)
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <div className="flex h-8 w-[320px] items-center rounded-md border py-2">
                                  <Input
                                    defaultValue={
                                      filterClosedDate &&
                                      filterClosedDate[0] &&
                                      moment(filterClosedDate[0]).isValid()
                                        ? convertToUTCDate(filterClosedDate[0])
                                        : ""
                                    }
                                    onChange={(e) => {
                                      let filterDate = e.target.value
                                      if (
                                        moment(
                                          filterDate,
                                          "MM/DD/YYYY",
                                          true
                                        ).isValid()
                                      ) {
                                        let oldDateFilter = [
                                          ...filterClosedDate,
                                        ]
                                        oldDateFilter[0] =
                                          moment(filterDate).format(
                                            "YYYY-MM-DD"
                                          )
                                        setFilterClosedDate(oldDateFilter)
                                      }
                                    }}
                                    className="w-[110px] appearance-none border-none bg-transparent py-1 text-xs  text-gray-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="MM/DD/YYYY"
                                  />
                                  <label className="mx-2"> to </label>
                                  <Input
                                    defaultValue={
                                      filterClosedDate &&
                                      filterClosedDate[1] &&
                                      moment(filterClosedDate[1]).isValid()
                                        ? convertToUTCDate(filterClosedDate[1])
                                        : ""
                                    }
                                    onChange={(e) => {
                                      let filterDate = e.target.value
                                      if (
                                        moment(
                                          filterDate,
                                          "MM/DD/YYYY",
                                          true
                                        ).isValid()
                                      ) {
                                        let oldDateFilter = [
                                          ...filterClosedDate,
                                        ]
                                        oldDateFilter[1] =
                                          moment(filterDate).format(
                                            "YYYY-MM-DD"
                                          )
                                        setFilterClosedDate(oldDateFilter)
                                      }
                                    }}
                                    className="w-[110px] appearance-none border-none bg-transparent py-1 text-xs text-gray-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                    type="text"
                                    placeholder="MM/DD/YYYY"
                                  />
                                  {/* <Button
                                  variant={"outline"}
                                  onClick={() => {
                                    setInvestCloseDateIsOpen(true)
                                  }}
                                  className={cn(
                                    "w-full h-8 border-none justify-end text-left text-xs font-normal hover:bg-transparent px-1",
                                    !filterClosedDate && "text-muted-foreground"
                                  )}
                                > */}
                                  <div className="flex w-full justify-end">
                                    <CalendarIcon
                                      className="mr-3 h-4 w-4"
                                      onClick={() => {
                                        setInvestCloseDateIsOpen(true)
                                      }}
                                    />
                                  </div>
                                  {/* {filterClosedDate?.length > 0 &&
                                    filterClosedDate[0] &&
                                    moment(filterClosedDate[0]).isValid()
                                    ? convertToUTCDate(filterClosedDate[0])
                                    : "Pick a date"}{" "}
                                  {filterClosedDate?.length == 2 ? " to " : ""}
                                  {filterClosedDate?.length > 0 &&
                                    filterClosedDate[1] &&
                                    moment(filterClosedDate[1]).isValid()
                                    ? convertToUTCDate(filterClosedDate[1])
                                    : ""} */}
                                  {/* </Button> */}
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="thin-scrollbar max-h-50 m-1 w-[380px] md:w-[410px] overflow-hidden whitespace-nowrap  p-0 text-xs text-black">
                                <Calendar
                                  defaultView="century"
                                  selectRange={true}
                                  showDoubleView={true}
                                  onChange={(dateFields: any) => {
                                    let startDate = moment(
                                      dateFields[0]
                                    ).format("YYYY-MM-DD")
                                    let endDate = moment(dateFields[1]).format(
                                      "YYYY-MM-DD"
                                    )
                                    let dateArray = [startDate, endDate]
                                    setFilterClosedDate(dateArray)
                                    setInvestCloseDateIsOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 items-center gap-2">
                        <div className="col-span-2">
                          <Label
                            className="text-[0.7rem] font-semibold text-gray-600"
                            htmlFor="maternal-lastname"
                          >
                            Case Number
                          </Label>
                          <Input
                            id="maternal-lastname"
                            type="text"
                            className="mt-1 h-8 w-[270px] md:w-[320px] rounded-lg border py-2 pl-3 text-xs"
                            placeholder="Case Number"
                            value={filterCaseNumber}
                            onChange={(e) => {
                              setFilterCaseNumber(e.target.value)
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 items-center gap-2">
                        <div>
                          <Label className="text-[0.7rem] font-semibold text-gray-600">
                            Crime Date
                          </Label>
                          <div>
                            <Popover
                              open={crimeDateIsOpen}
                              onOpenChange={setCrimeDateIsOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "h-8 w-[270px] md:w-[320px] justify-between text-left text-xs font-normal",
                                    !filterCrimeDate && "text-muted-foreground"
                                  )}
                                ><div className="flex">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {filterCrimeDate?.length > 0 &&
                                  filterCrimeDate[0] &&
                                  moment(filterCrimeDate[0]).isValid()
                                    ? convertToUTCDate(filterCrimeDate[0])
                                    : "Pick a date"}{" "}
                                  {filterCrimeDate?.length == 2 ? " to " : ""}
                                  {filterCrimeDate?.length > 0 &&
                                  filterCrimeDate[1] &&
                                  moment(filterCrimeDate[1]).isValid()
                                    ? convertToUTCDate(filterCrimeDate[1])
                                    : ""}
                                </div>
                                {filterCrimeDate?.length > 0 && (
                                    <div>
                                      <Icons.close className="h-4 w-4"  onClick= {
                                        ()=>{
                                          setFilterCrimeDate([])
                                        }
                                      }/>
                                    </div>)}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="thin-scrollbar max-h-50 m-1 w-[380px] md:w-[410px]overflow-hidden whitespace-nowrap p-0 text-xs text-black">
                                <Calendar
                                  defaultView="century"
                                  selectRange={true}
                                  showDoubleView={true}
                                  onChange={(dateFields: any) => {
                                    let startDate = moment(
                                      dateFields[0]
                                    ).format("YYYY-MM-DD")
                                    let endDate = moment(dateFields[1]).format(
                                      "YYYY-MM-DD"
                                    )
                                    let dateArray = [startDate, endDate]
                                    setFilterCrimeDate(dateArray)
                                    setCrimeDateIsOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 items-center gap-2">
                        <div className="col-span-2">
                          <div className="mt-2 flex flex-col">
                            <Label
                              htmlFor="crime-types"
                              className="text-[0.7rem] font-semibold text-gray-600"
                            >
                              Crime Types
                            </Label>
                            <div className="w-[270px] md:w-[320px]">
                              <CrimeTypeCombobox
                                ListData={crimeTypeList}
                                handleChange={(val: any) => {
                                  setFilterCrimeType(val)
                                }}
                                placholderName={"Select Crime Type"}
                                EditData={filterCrimeType}
                                viewMode={false}
                                disabled={false}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 items-center gap-2">
                        <div className="my-2">
                          <h4 className="text-[0.7rem] font-semibold text-gray-600 ">
                            State of Prosecution
                          </h4>
                          <AddressSelect
                            country={"USA"}
                            category={"usStatesAndCities"}
                            placeholdername={"Select state"}
                            defultselect={filterState}
                            disabled={false}
                            selectedValue={(val) => {
                              setFilterState(val)
                              setFilterCounty("")
                            }}
                            wPage={190}
                          />
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 items-center gap-2">
                        <div className="flex flex-col">
                          <h4 className="text-[0.7rem] font-semibold text-gray-600 ">
                            County of Prosecution
                          </h4>
                          <AddressSelect
                            category={"county"}
                            placeholdername={"Select County"}
                            state={filterState}
                            defultselect={filterCounty}
                            selectedValue={(val) => {
                              setFilterCounty(val)
                            }}
                            wPage={190}
                            disabled={false}
                          />
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 items-center gap-2">
                        <div className="mr-5 mt-1">
                          <Label
                            htmlFor="district"
                            className="text-[0.7rem] font-semibold text-gray-600"
                          >
                            District Court
                          </Label>
                          <ComboboxCourts
                            selectedValue={(val: any) => {
                              setFilterDistrictCourt(val)
                            }}
                            defultselect={filterDistrictCourt}
                            disabled={false}
                          />
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 items-center gap-2">
                        <Label className="text-[0.7rem] font-semibold text-gray-600">
                          Co-defendant
                        </Label>
                        <div className="w-[270px] md:w-[320px]">
                          <CoDefendantCombobox
                            handleChange={(val: any) => {
                              setFilterCodef(val)
                            }}
                            EditData={filterCodef}
                            placholderName={"Link Co-defendant"}
                            viewMode={false}
                          />
                        </div>
                      </div>
                    </SheetDescription>
                    <div className="relative my-5 flex items-center justify-between border-t py-1 xl:py-2">
                      <div>
                        {filtersApplied && (
                          <div className="">
                            <Button
                              variant="link"
                              onClick={(e) => {
                                setFilterCaseTitle("")
                                setFilterFirstName("")
                                setFilterLastName("")
                                setFilterLastName("")
                                setFilterClosedDate([])
                                setFilterOpenDate([])
                                setFilterCaseClosedDate([])
                                setFilterCaseOpenDate([])
                                setFilterStatus("")
                                setFilterAssignConsulate("")
                                setFilterCaseNumber("")
                                setFilterCrimeDate([])
                                setFilterCrimeType([])
                                setFilterState("")
                                setFilterCounty("")
                                setFilterDistrictCourt("")
                                setFilterCodef([])
                                setFilterArrestPlace("")
                                setFilterArrestState("")
                                setFilterArrestCounty("")
                                setFilterCustody(false)
                                setFilterProceduralStatus("")
                                setFilterDeathPenalityTrail("")
                                setFilterDeathNoticed("")
                                setFilterPleaBargainOffered("")
                                setFilterAggravatingFactors("")
                                setAdvanceFilterCheck(false)
                                setFilterObject(null)
                                setFilterCaseID("")
                                setFilterDefendantID("")

                                setFiltersApplied(false)
                                setShowFilters(false)
                                setFilterIsOpen(false)
                                fetchData(currentPage, limitPage)
                                setAppliedCaseFilters(null)
                                setCaseOpenedNullCheck(false)
                                setCaseClosedNullCheck(false)
                                setInvestigationOpenedNullCheck(false)
                                setCaseInvestigationClosedNullCheck(false)
                              }}
                              className="text-black-700 items-center px-2 py-1 text-xs hover:underline"
                            >
                              <Icons.close className="mr-1 h-3 w-3" />
                              Clear Filters
                            </Button>
                          </div>
                        )}
                      </div>

                      <div>
                        <Button
                          type="button"
                          onClick={() =>{
                            if( advcaseFilterObject){
                              applyFilter(advcaseFilterObject, currentPage, limitPage, "", "")
                            }else{
                              applyFilter("", currentPage, limitPage, "", "")
                            }
                          }}
                          className="ml-2 h-8 rounded-lg bg-red-700 px-3 py-2 text-xs text-destructive-foreground hover:bg-red-400"
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>

            <div className="mx-2">
              <Sheet
                open={showColumnIsOpen}
                onOpenChange={(e) => {
                  setShowColumnIsOpen(e)
                }}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="py- flex h-8 items-center rounded-lg bg-transparent px-1.5 md:px-3.5 text-xs xl:py-3"
                  >
                    {/* <Icons.filter className="h-3.5 w-5" /> */}
                    <Icons.columnVisible className="h-3.5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>
                      <div className="flex justify-between">
                        <div>Show Columns</div>
                        <div>
                          <Button
                            className="mr-7 h-8 p-0"
                            variant="link"
                            onClick={() => showAllColumnsHandler(table)}
                          >
                            {" "}
                            {showAllColumns ? "Select Default" : "Select All"}
                          </Button>
                        </div>
                      </div>
                    </SheetTitle>
                    <SheetDescription className="thin-scrollbar mb-2 h-[calc(100vh-100px)] overflow-y-auto p-2">
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        {table.getAllColumns().map((column: any, i: any) => {
                          if (column?.id != "id" && column?.id != "action") {
                            return (
                              <div key={i}>
                                <label className="text-sm text-muted-foreground">
                                  {/* <input
                                className="m-1"
                                checked={column.getIsVisible()}
                                disabled={!column.getCanHide()}
                                onChange={column.getToggleVisibilityHandler()}
                                type="checkbox"
                              /> */}
                                  <Toggle
                                    variant="outline"
                                    className="h-fit px-2 py-1 text-left text-xs hover:bg-transparent"
                                    defaultPressed={column.getIsVisible()}
                                    pressed={column.getIsVisible()}
                                    onClick={column.getToggleVisibilityHandler()}
                                    aria-label="Toggle bold"
                                  >
                                    {column?.columnDef?.header}
                                  </Toggle>
                                </label>
                              </div>
                            )
                          }
                        })}
                      </div>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {showFilters && (
          <div
            ref={showfilterRef}
            id="ggg"
            className="flex flex-nowrap border-t py-2"
          >
            {appliedCaseFilters && filterObject && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <CaseFilterContext.Provider value={appliedCaseFilters}>
                  <CaseDialogFilter
                    text={"appliedFilter"}
                    applyFilterData={filterObject}
                    closeCase={(filterData: any) => {
                      applyFilter(filterData, currentPage, limitPage, "", "")
                    }}
                  />
                </CaseFilterContext.Provider>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setShowFilters(false)
                    setFiltersApplied(false)
                    fetchData(currentPage, limitPage)
                    setAppliedCaseFilters(null)
                  }}
                />
              </Badge>
            )}

            {dateRangeGroupApplied && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Case Date Range Filter Applied
                </span>
                <Icons.close
                  className="ml-1 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterDateRange([])
                    setFiltersApplied(false)
                    setShowFilters(false)
                    setFilterIsOpen(false)
                    setDateRangeGroupApplied(false)
                    fetchData(currentPage, limitPage)
                  }}
                />
              </Badge>
            )}

            {filterCaseID && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Case ID
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterCaseID}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterCaseID("")
                    removeBatchFilter("caseID")
                  }}
                />
              </Badge>
            )}

            {filterDefendantID && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Defendant ID
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterDefendantID}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterDefendantID("")
                    removeBatchFilter("defID")
                  }}
                />
              </Badge>
            )}

            {filterCaseTitle && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Case Title
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterCaseTitle}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterCaseTitle("")
                    removeBatchFilter("caseTitle")
                  }}
                />
              </Badge>
            )}
            {filterFirstName && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  First Name
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterFirstName}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterFirstName("")
                    removeBatchFilter("firstName")
                  }}
                />
              </Badge>
            )}
            {filterLastName && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Last Name
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterLastName}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterLastName("")
                    removeBatchFilter("lastName")
                  }}
                />
              </Badge>
            )}
            {filterAssignConsulate && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Assign Consulate
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterAssignConsulate}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterAssignConsulate("")
                    removeBatchFilter("consulate")
                  }}
                />
              </Badge>
            )}
            {filterStatus && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Case Status
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterStatus.replace(/(^\w{1})|(\s+\w{1})/g, (letter: any) =>
                    letter.toUpperCase()
                  )}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterStatus("")
                    removeBatchFilter("status")
                  }}
                />
              </Badge>
            )}
            {filterOpenDate && filterOpenDate?.length > 0 && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Investigation Opened Date
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterOpenDate?.length > 0 &&
                  filterOpenDate[0] &&
                  moment(filterOpenDate[0]).isValid()
                    ? convertToUTCDate(filterOpenDate[0])
                    : ""}{" "}
                  {filterOpenDate?.length == 2 ? " to " : ""}
                  {filterOpenDate?.length > 0 &&
                  filterOpenDate[1] &&
                  moment(filterOpenDate[1]).isValid()
                    ? convertToUTCDate(filterOpenDate[1])
                    : ""}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterOpenDate([])
                    removeBatchFilter("investigationOpen")
                  }}
                />
              </Badge>
            )}
            {filterClosedDate && filterClosedDate?.length > 0 && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Investigation Closed Date
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterClosedDate?.length > 0 &&
                  filterClosedDate[0] &&
                  moment(filterClosedDate[0]).isValid()
                    ? convertToUTCDate(filterClosedDate[0])
                    : ""}{" "}
                  {filterClosedDate?.length == 2 ? " to " : ""}
                  {filterClosedDate?.length > 0 &&
                  filterClosedDate[1] &&
                  moment(filterClosedDate[1]).isValid()
                    ? convertToUTCDate(filterClosedDate[1])
                    : ""}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterClosedDate([])
                    removeBatchFilter("investigationClose")
                  }}
                />
              </Badge>
            )}
            {filterCaseOpenDate && filterCaseOpenDate?.length > 0 && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Case Opened Date
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterCaseOpenDate?.length > 0 &&
                  filterCaseOpenDate[0] &&
                  moment(filterCaseOpenDate[0]).isValid()
                    ? convertToUTCDate(filterCaseOpenDate[0])
                    : ""}{" "}
                  {filterCaseOpenDate?.length == 2 ? " to " : ""}
                  {filterCaseOpenDate?.length > 0 &&
                  filterCaseOpenDate[1] &&
                  moment(filterCaseOpenDate[1]).isValid()
                    ? convertToUTCDate(filterCaseOpenDate[1])
                    : ""}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterCaseOpenDate([])
                    removeBatchFilter("caseOpen")
                  }}
                />
              </Badge>
            )}
            {filterCaseClosedDate && filterCaseClosedDate?.length > 0 && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Case Closed Date
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterCaseClosedDate?.length > 0 &&
                  filterCaseClosedDate[0] &&
                  moment(filterCaseClosedDate[0]).isValid()
                    ? convertToUTCDate(filterCaseClosedDate[0])
                    : ""}{" "}
                  {filterCaseClosedDate?.length == 2 ? " to " : ""}
                  {filterCaseClosedDate?.length > 0 &&
                  filterCaseClosedDate[1] &&
                  moment(filterCaseClosedDate[1]).isValid()
                    ? convertToUTCDate(filterCaseClosedDate[1])
                    : ""}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterCaseClosedDate([])
                    removeBatchFilter("caseClosed")
                  }}
                />
              </Badge>
            )}
            {filterCaseNumber && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Case Number
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterCaseNumber}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterCaseNumber("")
                    removeBatchFilter("caseNumber")
                  }}
                />
              </Badge>
            )}
            {filterCrimeDate && filterCrimeDate?.length > 0 && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Crime Date
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterCrimeDate?.length > 0 &&
                  filterCrimeDate[0] &&
                  moment(filterCrimeDate[0]).isValid()
                    ? convertToUTCDate(filterCrimeDate[0])
                    : ""}{" "}
                  {filterCrimeDate?.length == 2 ? " to " : ""}
                  {filterCrimeDate?.length > 0 &&
                  filterCrimeDate[1] &&
                  moment(filterCrimeDate[1]).isValid()
                    ? convertToUTCDate(filterCrimeDate[1])
                    : ""}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterCrimeDate([])
                    removeBatchFilter("crimeDate")
                  }}
                />
              </Badge>
            )}
            {filterCrimeType && filterCrimeType?.length > 0 && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Crime Type
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterCrimeType}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterCrimeType([])
                    removeBatchFilter("crimeType")
                  }}
                />
              </Badge>
            )}
            {filterState && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  State
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterState}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterState("")
                    removeBatchFilter("state")
                  }}
                />
              </Badge>
            )}
            {filterCounty && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  County
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterCounty}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterCounty("")
                    removeBatchFilter("county")
                  }}
                />
              </Badge>
            )}
            {filterDistrictCourt && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  District Court
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterDistrictCourt}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterDistrictCourt("")
                    removeBatchFilter("districtCourt")
                  }}
                />
              </Badge>
            )}
            {filterCodef && filterCodef?.length > 0 && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Codef
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterCodef}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterCodef([])
                    removeBatchFilter("codefendant")
                  }}
                />
              </Badge>
            )}

            {caseOpenedNullCheck && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  case open : null
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {caseOpenedNullCheck}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setCaseOpenedNullCheck(false)
                    removeBatchFilter("caseOpenedNullCheck")
                  }}
                />
              </Badge>
            )}

            {caseClosedNullCheck && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  case close : null
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {caseClosedNullCheck}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setCaseClosedNullCheck(false)
                    removeBatchFilter("caseClosedNullCheck")
                  }}
                />
              </Badge>
            )}

            {investigationOpenedNullCheck && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Investigation open : null
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {investigationOpenedNullCheck}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setInvestigationOpenedNullCheck(false)
                    removeBatchFilter("investigationOpenedNullCheck")
                  }}
                />
              </Badge>
            )}

            {investigationClosedNullCheck && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Investigation close : null
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {investigationClosedNullCheck}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setCaseInvestigationClosedNullCheck(false)
                    removeBatchFilter("investigationClosedNullCheck")
                  }}
                />
              </Badge>
            )}

            <div className="">
              {(filterFirstName ||
                filterLastName ||
                filterStatus ||
                filterAssignConsulate ||
                (filterCaseOpenDate?.length > 0) ||
                (filterCaseClosedDate?.length > 0) ||
                (filterOpenDate?.length > 0) ||
                (filterClosedDate?.length > 0) ||
                filterCaseTitle ||
                filterCaseNumber ||
                (filterCrimeDate?.length > 0) ||
                (filterCrimeType?.length > 0) ||
                filterState ||
                filterCounty ||
                filterDistrictCourt ||
                (filterCodef?.length > 0) ||
                caseOpenedNullCheck ||
                caseClosedNullCheck ||
                investigationOpenedNullCheck ||
                investigationClosedNullCheck || (filterDateRange?.length > 0)
                ) && (
                <Button
                  variant="link"
                  onClick={(e) => {
                    setFilterCaseTitle("")
                    setFilterFirstName("")
                    setFilterLastName("")
                    setFilterOpenDate([])
                    setFilterAssignConsulate("")
                    setFilterClosedDate([])
                    setFilterStatus("")
                    setFilterCaseOpenDate([])
                    setFilterCaseClosedDate([])
                    setFilterCaseNumber("")
                    setFilterCrimeDate([])
                    setFilterCrimeType([])
                    setFilterState("")
                    setFilterCounty("")
                    setFilterDistrictCourt("")
                    setFilterCodef([])

                    setFilterArrestPlace("")
                    setFilterArrestState("")
                    setFilterArrestCounty("")
                    setFilterCustody(false)
                    setFilterProceduralStatus("")
                    setFilterDeathPenalityTrail("")
                    setFilterDeathNoticed("")
                    setFilterPleaBargainOffered("")
                    setFilterAggravatingFactors("")
                    setFilterObject(null)
                    setFilterCaseID("")
                    setFilterDefendantID("")
                    setFilterDateRange([])
                    setFilterIsOpen(false)
                    setFiltersApplied(false)
                    setShowFilters(false)
                    fetchData(currentPage, limitPage)
                    setAppliedCaseFilters(null)
                    setCaseOpenedNullCheck(false)
                    setCaseClosedNullCheck(false)
                    setInvestigationOpenedNullCheck(false)
                    setCaseInvestigationClosedNullCheck(false)
                  }}
                  className="text-black-700 h-6 items-center pl-1 text-[0.65rem] font-normal hover:underline"
                >
                  <Icons.close className="mr-1 h-3 w-3" /> Clear All
                </Button>
              )}
            </div>
          </div>
        )}
        {isLoading && (
          <div className="h-[calc(100vh-9.5rem)]">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20">
              <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-red-700" />
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            <div
              style={{
                height: showFilters
                  ? "calc(100% - " + filterHeight + ")"
                  : "calc(100% - 82px)",
              }}
              className="thin-scrollbar fixed-child-table relative overflow-y-auto border-t"
            >
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            className={
                              header.column.id === "id"
                                ? "pb-0 pl-2 pt-1"
                                : "text-black-500 sticky top-0 h-auto whitespace-nowrap p-2 text-xs font-bold"
                            }
                          >
                            {/* {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )} */}

                            {header.isPlaceholder ? null : (
                              <div className="flex items-center">
                                {header.column.id === "id" ? (
                                  <div
                                    className=""
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {!userRoles.includes("VIEWER") && (
                                      <Checkbox
                                        checked={
                                          table.getIsAllPageRowsSelected()
                                          // (table.getIsSomePageRowsSelected() && "indeterminate")
                                        }
                                        onCheckedChange={(value) => {
                                          table?.toggleAllPageRowsSelected(
                                            !!value
                                          )
                                          selectAllChecked(value)
                                        }}
                                        className="border-slate-600"
                                        aria-label="Select all"
                                      />
                                    )}
                                  </div>
                                ) : (
                                  flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )
                                )}
                              </div>
                            )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell: any) => {
                          return (
                            <TableCell
                              key={cell.id}
                              className={
                                cell.column.id === "id"
                                  ? "pb-0 pl-2 pt-1"
                                  : cell.column.id === "action"
                                  ? "p-0 text-xs"
                                  : "whitespace-nowrap p-3 text-xs"
                              }
                              onClick={() => {
                                if (prisonButtonRef.current) {
                                  setViewRowData(cell.row.original)
                                  setTimeout(() => {
                                    prisonButtonRef.current?.click()
                                  }, 200)
                                }
                              }}
                            >
                              {cell.column.id === "id" ? (
                                <div onClick={(e) => e.stopPropagation()}>
                                  {!userRoles.includes("VIEWER") && (
                                    <Checkbox
                                      className="mycheckbox border-slate-600"
                                      checked={row.getIsSelected()}
                                      id={cell?.row?.original?.id}
                                      onCheckedChange={(value) => {
                                        if (value) {
                                          let objArray = [
                                            ...deleteids,
                                            cell?.row?.original?.id,
                                          ]
                                          handleSelectedRows(objArray)
                                          if (objArray.length === 1) {
                                            setDeleteEnable(false)
                                            setEditEnable(false)
                                            setDeleteIds(objArray)
                                            setEditObj(cell.row.original)
                                            // toast({
                                            //   variant: "default",
                                            //   description: `${objArray.length} Checkbox Selected`,
                                            //   action: (
                                            //     <>
                                            //       <div className="flex items-center">
                                            //         <div className="m-3">
                                            //           <AddPrisonAlert
                                            //             // icon={<Icons.pencil className="mb-1 h-3.5 w-5" />}
                                            //             text="Edit"
                                            //             rowdata={cell.row.original}
                                            //             refreshGrid={() => {
                                            //               fetchData(currentPage, limitPage);
                                            //               table?.toggleAllPageRowsSelected(false);
                                            //             }}
                                            //           />
                                            //         </div>
                                            //         <div className="">
                                            //           <Button
                                            //             variant="outline"
                                            //             className="flex h-8 items-center rounded-lg bg-transparent px-2.5 py-1 text-xs xl:py-1.5"
                                            //             onClick={() => handleDelete(objArray)}
                                            //           > Delete
                                            //           </Button>
                                            //         </div>
                                            //       </div>
                                            //     </>
                                            //   ),
                                            //   duration: Infinity,
                                            // });
                                          }
                                          if (objArray.length > 1) {
                                            setDeleteEnable(false)
                                            setEditEnable(true)
                                            setDeleteIds(objArray)
                                            setEditObj("")
                                            // toast({
                                            //   variant: "default",
                                            //   description: `${objArray.length} Checkbox Selected`,
                                            //   action: (
                                            //     <>
                                            //    <div>
                                            //       <Button
                                            //         variant="outline"
                                            //         className="flex h-8 items-center rounded-lg bg-transparent px-2.5 py-1 text-xs xl:py-1.5"
                                            //         onClick={() => handleDelete(objArray)}
                                            //       > Delete
                                            //       </Button>
                                            //     </div>                                       </>
                                            //   ),
                                            //   duration: Infinity

                                            // });
                                          }
                                        } else {
                                          // remove ID
                                          let originalarray = [...deleteids]
                                          let objArray: any = []
                                          originalarray.forEach((map_id) => {
                                            if (
                                              cell.row.original.id != map_id
                                            ) {
                                              objArray.push(map_id)
                                            }
                                          })
                                          if (objArray.length === 0) {
                                            setDeleteIds([])
                                            setEditObj("")
                                            setDeleteEnable(true)
                                            setEditEnable(true)
                                            // toast({
                                            //   open: false
                                            // })
                                          }
                                          if (objArray.length == 1) {
                                            setDeleteEnable(false)
                                            setEditEnable(false)
                                            setDeleteIds(objArray)
                                            let ID = objArray[0]
                                            let findObj = caseDate.find(
                                              (find_ele: any) =>
                                                find_ele?.id == ID
                                            )
                                            setEditObj(findObj)
                                            // toast({
                                            //   variant: "default",
                                            //   description: `${objArray.length} Checkbox Selected`,
                                            //   action: (
                                            //     <>
                                            //          <div className="flex items-center">
                                            //         <div className="m-3">
                                            //           <AddPrisonAlert
                                            //             // icon={<Icons.pencil className="mb-1 h-3.5 w-5" />}
                                            //             text="Edit"
                                            //             rowdata={cell.row.original}
                                            //             refreshGrid={() => {
                                            //               fetchData(currentPage, limitPage);
                                            //               table?.toggleAllPageRowsSelected(false);
                                            //             }}
                                            //           />
                                            //         </div>
                                            //         <div className="">
                                            //           <Button
                                            //             variant="outline"
                                            //             className="flex h-8 items-center rounded-lg bg-transparent px-2.5 py-1 text-xs xl:py-1.5"
                                            //             onClick={() => handleDelete(objArray)}
                                            //           > Delete
                                            //           </Button>
                                            //         </div>
                                            //       </div>                                  </>
                                            //   ),
                                            //   duration: Infinity,
                                            // });
                                          }
                                          if (objArray.length > 1) {
                                            setDeleteEnable(false)
                                            setEditEnable(true)
                                            setDeleteIds(objArray)
                                            setEditObj("")
                                            // toast({
                                            //   variant: "default",
                                            //   description: `${objArray.length} Checkbox Selected`,
                                            //   action: (
                                            //     <>
                                            //    <div>
                                            //       <Button
                                            //         variant="outline"
                                            //         className="flex h-8 items-center rounded-lg bg-transparent px-2.5 py-1 text-xs xl:py-1.5"
                                            //         onClick={() => handleDelete(objArray)}
                                            //       > Delete
                                            //       </Button>
                                            //     </div>                                  </>
                                            //   ),

                                            //   duration: Infinity,                                    });
                                          }
                                          handleSelectedRows(objArray)
                                        }
                                        row.toggleSelected(!!value)
                                        // handleChangeChcke(!!value, cell.row.original.id)
                                      }}
                                      aria-label="Select row"
                                    />
                                  )}
                                </div>
                              ) : cell.column.id === "action" ? (
                                <div
                                  className=""
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {!userRoles.includes("VIEWER") && (
                                    <Popover>
                                      <PopoverTrigger className="h-8 w-8 px-2.5">
                                        <Icons.verticalDots className="fixed cursor-pointer" />
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="ml-2 flex h-8 w-auto items-center rounded-lg p-0"
                                        align="center"
                                        side="left"
                                      >
                                        <div className="flex flex-nowrap">
                                          <AddPrisonAlert
                                            icon={
                                              <Icons.pencil className="h-3.5 w-5" />
                                            }
                                            hidetext="Edit"
                                            rowdata={cell.row.original}
                                            refreshGrid={() => {
                                              fetchData(currentPage, limitPage)
                                              table?.toggleAllPageRowsSelected(
                                                false
                                              )
                                            }}
                                          />
                                          <AddPrisonAlert
                                            icon={
                                              <Icons.eye className="h-3.5 w-5" />
                                            }
                                            hidetext="View"
                                            rowdata={cell.row.original}
                                            refreshGrid={() => {
                                              fetchData(currentPage, limitPage)
                                              table?.toggleAllPageRowsSelected(
                                                false
                                              )
                                            }}
                                          />
                                          <Dialog
                                            open={isOpen1}
                                            onOpenChange={setIsOpen1}
                                          >
                                            {" "}
                                            <DialogTrigger asChild>
                                              <Button
                                                variant="outline"
                                                className="flex h-8 items-center rounded-l-none rounded-r-lg border-l bg-transparent px-3.5 py-1.5 text-xs"
                                              >
                                                {" "}
                                                <Icons.deleteIcon className=" h-3.5 w-5" />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-[400px] dark:bg-slate-900">
                                              <DialogHeader className="border-b border-inherit ">
                                                <DialogTitle className="mb-2">
                                                  Confirm Deletion
                                                </DialogTitle>
                                              </DialogHeader>
                                              <DialogDescription className="py-2 text-sm">
                                                Are you sure you want to delete
                                                ?
                                              </DialogDescription>
                                              <DialogFooter>
                                                <DialogClose className="text-black-600 pr-6">
                                                  Cancel
                                                </DialogClose>
                                                <Button
                                                  type="submit"
                                                  variant="outline"
                                                  className="h-8 bg-transparent py-3 text-xs"
                                                  onClick={() =>
                                                    handleDelete(
                                                      cell.row.original.id
                                                    )
                                                  }
                                                >
                                                  Delete
                                                </Button>
                                              </DialogFooter>
                                            </DialogContent>
                                          </Dialog>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  )}
                                  {/* <Button
                                variant="ghost"
                                className="hover:ghost bg-red-600 text-white"
                              // onClick={() => handleDelete(cell.row.original.id)}
                              >
                                Delete
                              </Button> */}
                                </div>
                              ) : (
                                flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )
                              )}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
        <div className="absolute bottom-0 left-0 w-full  rounded-b-lg border-t border-inherit bg-inherit">
          <div className="flex items-center justify-end space-x-2 ">
            <div className="mx-2 flex flex-auto items-center text-xs text-muted-foreground">
              <span className="m-2 text-xs text-muted-foreground">Page</span>
              <Input
                // type="number"
                value={currentPage}
                className="h-8 w-11 rounded-lg px-2 py-1 text-xs text-gray-600"
                onChange={(e: any) => setCurrentpage(e.target.value)}
                onKeyDown={handlePage}
              />
              <span className="m-2">
                {" "}
                of {totalPage} (Total {totalItems}{" "}
                {totalItems === 1 ? "row" : "rows"})
              </span>
            </div>
            <div className="flex space-x-2 p-2">
              <Select value={limitPage} onValueChange={(e) => LimitPerPage(e)}>
                <SelectTrigger className="w-[60px] text-xs text-gray-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="150">150</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="my-2 text-xs text-muted-foreground">/ page</div>
            </div>
            <div className="space-x-2 p-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={PreviousPage}
                disabled={currentPage - 1 > 0 ? false : true}
              >
                <Icons.chevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={NextPage}
                disabled={currentPage < totalPage ? false : true}
              >
                <Icons.chevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {selectedRows.length > 0 && (
        <div>
          <CustomActionToast
            selectedRows={selectedRows}
            action={
              <>
                <div className="flex items-center">
                  <div className="m-3">
                    {selectedRows?.length > 0 && selectedRows?.length <= 1 && (
                      <AddPrisonAlert
                        icon={<Icons.pencil className="mb-1 h-3.5 w-5" />}
                        text="Edit"
                        disable={editEnable}
                        rowdata={editobj}
                        refreshGrid={() => {
                          fetchData(currentPage, limitPage)
                          table?.toggleAllPageRowsSelected(false)
                          setSelectedRows([])
                        }}
                      />
                    )}
                  </div>
                  <div className="my-3">
                    <DeleteButton />
                  </div>
                </div>
              </>
            }
          ></CustomActionToast>
        </div>
      )}
    </div>
  )
}
