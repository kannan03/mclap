"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
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
import { Switch } from "@/components/ui/switch"
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
import AddContact from "@/components/contact/add-edit-contact-dialog"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { CustomActionToast } from "@/components/utils/custom-action-toast"
import { AddressSelect } from "@/components/utils/states-cities-combobox"

import "react-calendar/dist/Calendar.css"

export default function ViewDefendantPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentPage, setCurrentpage] = React.useState<number>(1)
  const [limitPage, setLimitPage] = React.useState<any>("25")
  const [totalPage, setTotalPage] = React.useState<number>(1)
  const [totalItems, setTotalItems] = React.useState<number>(0)
  const [timer, setTimer] = React.useState(null)
  const [editobj, setEditObj] = React.useState<any>(null)
  const [editEnable, setEditEnable] = React.useState(true)
  const [deleteEnable, setDeleteEnable] = React.useState(true)
  const [showFilters, setShowFilters] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [isTheme, setIsTheme] = React.useState(false)
  const [deleteids, setDeleteIds] = React.useState<any>([])
  const [data, setData] = React.useState([])
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [consulateTypeList, setConsulateTypeList] = React.useState<any>([])
  const [assignIsOpen, setAssignIsOpen] = React.useState(false)
  const [selectedRows, setSelectedRows] = React.useState([])
  const [assignConsulateFilter, setAssignConsulateFilter] =
    React.useState<any>("")

  const [caseOpenDateIsOpen, setCaseOpenDateIsOpen] = React.useState<any>(false)
  const [caseCloseDateIsOpen, setCaseCloseDateIsOpen] =
    React.useState<any>(false)
  const [investOpenDateIsOpen, setInvestOpenDateIsOpen] =
    React.useState<any>(false)
  const [investCloseDateIsOpen, setInvestCloseDateIsOpen] =
    React.useState<any>(false)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const hiddenColumns = {
    linkDefID: false,
    defLast:false,
    defFirst: false,
    defMiddle: false,
    defBirthdate: false,
    defMexicanBirthState: false,
    defSex: false,
    defChargedState: false,
    defChargedCounty: false,
    defIsFederal: false,
    prisonName: false,
    defSpeakEnglish: false,
    defSpeakSpanish: false,
    defLiterateEnglish: false,
    defLiterateSpanish: false,
    defSpeakOtherLanguage: false,
    defSchoolYearsTotal: false,
    defProgramAttorney: false,
    defLevelInvolvement: false,
    multiimpairments: false,
    defHasImpairment: false,
    impType: false,
    impdescmulti : false,
    defNotes : false,
  }

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(hiddenColumns)
  const [rowSelection, setRowSelection] = React.useState({})
  // fliter state
const [caseOpenedNullCheck, setCaseOpenedNullCheck] = React.useState(false);
const [caseClosedNullCheck, setCaseClosedNullCheck] = React.useState(false);
const [investigationOpenedNullCheck, setInvestigationOpenedNullCheck] = React.useState(false);
const [investigationClosedNullCheck, setCaseInvestigationClosedNullCheck] = React.useState(false);

  const [columns, setColumns] = React.useState([
    {
      accessorKey: "id",
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "linkDefID",
      header: "Defendant ID",
      accessorFn: (row: any) => {
        if (row?.linkDefID) {
          return row.linkDefID
        } else {
          return row?.id ? row.id : ""
        }
      },
    },
    {
      accessorKey: "deffullname",
      header: "Name",
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
      accessorKey: "assignconsulate",
      header: "Assigned Consulate",
    },
    {
      accessorKey: "linkStatus",
      header: "Case Status",
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
      accessorKey: "defBirthdate",
      header: "Birth Date",
      accessorFn: (row: any) => {
        if (row?.defBirthdate) {
          return convertToUTCDate(row?.defBirthdate)
        } else {
          return ""
        }
      },
    },
    {
      accessorKey: "defMexicanBirthState",
      header: "Birth State",
    },
    {
      accessorKey: "defSex",
      header: "Sex",
    },
    {
      accessorKey: "defChargedState",
      header: "Charged State",
    },
    {
      accessorKey: "defChargedCounty",
      header: "Charged County",
    },
    {
      accessorKey: "defIsFederal",
      header: "Charged State or Federal",
    },
    {
      accessorKey: "prisonName",
      header: "Prison",
    },

    {
      accessorKey: "defSpeakEnglish",
      header: "Speaks English",
    },
    {
      accessorKey: "defSpeakSpanish",
      header: "Speaks Spanish",
    },
    {
      accessorKey: "defLiterateEnglish",
      header: "Literate in English",
    },
    {
      accessorKey: "defLiterateSpanish",
      header: "Literate in Spanish",
    },
    {
      accessorKey: "defSpeakOtherLanguage",
      header: "Speaks other languages",
    },
    {
      accessorKey: "defSchoolYearsTotal",
      header: "Total years of education",
    },
    {
      accessorKey: "defProgramAttorney",
      header: "Program Attorney",
    },
    {
      accessorKey: "defLevelInvolvement",
      header: "MCLAP Level of Involvement",
    },
    {
      accessorKey: "defHasImpairment",
      header: "Suspected Intellectual Disability",
    },
    {
      accessorKey: "multiimpairments",
      header: "Mental Impairment Type",
    },
    {
      accessorKey: "impdescmulti",
      header: "Mental Impairment Description",
    },
    { 
      accessorKey: "defNotes",
      header: "Notes on this Defendant",
    }
  ])

  const table = useReactTable({
    data,
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

  const showfilterRef = React.useRef(null)

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

    let QueryString = buildQueryString()
    if(filterValue){
      QueryString += `&filter=${filterValue}`
    }

    let url = `${baseURL}/v1/defendants/exportFilteredDefendants?export=true${QueryString}`
    const response = await axiosInstance.post(url, visibleColumns, {
      responseType: "blob",
    })
    if (response?.status == 200 && response?.data) {
      const fileURL = window.URL.createObjectURL(response?.data)
      let alink = document.createElement("a")
      alink.href = fileURL
      alink.download = `Defendants.xlsx`
      alink.click()
      toast({
        variant: "default",
        description: "Defendants are getting exported",
        style: {
          background: "#03C03C",
        },
      })
    } else {
      toast({
        variant: "default",
        description: "Error while exporting the defendants",
        style: {
          background: "red",
        },
      })
    }
  }

  const PreviousPage = () => {
    try {
      let updatePage = Number(currentPage) - 1
      setCurrentpage(updatePage)
      if (filterValue) {
        filterSearch(filterValue, updatePage, limitPage)
      } else {
        if (filtersApplied) {
          applyFilter(updatePage, limitPage,"")
        } else {
          fetchData(updatePage, limitPage)
        }
      }
    } catch (err) {}
  }
  const NextPage = () => {
    try {
      let updatePage = Number(currentPage) + 1
      setCurrentpage(updatePage)
      if (filterValue) {
        filterSearch(filterValue, updatePage, limitPage)
      } else {
        if (filtersApplied) {
          applyFilter(updatePage, limitPage,"")
        } else {
          fetchData(updatePage, limitPage)
        }
      }
    } catch (err) {}
  }
  const LimitPerPage = (limitValue: any) => {
    setLimitPage(limitValue)
    // fetchData(1, limitValue)
    // if (filterValue) {
    //   filterSearch(filterValue, 1, limitValue)
    // } else {
    //   fetchData(1, limitValue)
    // }
    if (filterValue) {
      filterSearch(filterValue, currentPage, limitValue)
    } else {
      if (filtersApplied) {
        applyFilter(currentPage, limitValue,"")
      } else {
        fetchData(currentPage, limitValue)
      }
    }
  }
  const filterSearch = async (Value: any, updatePage: any, limitPage: any) => {
    try {
      setIsLoading(true)
      let url = `${baseURL}/v1/defendants?filter=${Value}&page=${updatePage}&limit=${limitPage}`
      const response = await axiosInstance.get(url)
      let listData = response?.data?.data?.rows
        ? response?.data?.data?.rows
        : []
      let modified = listData?.map((map_ele: any) => {
        if (map_ele.phoneNumber && typeof map_ele.phoneNumber === "object") {
          let phone_data = map_ele.phoneNumber.find(
            (find_ele: any) => find_ele && find_ele.is_primary == 1
          )
          if (phone_data) {
            map_ele.phoneNumbers = String(phone_data.phoneNumber)
          } else {
            map_ele.phoneNumbers = ""
          }
        } else {
          map_ele.phoneNumbers = ""
        }

        return map_ele
      })
      setData(modified)
      setDeleteEnable(true)
      setEditEnable(true)
      setDeleteIds([])
      setEditObj("")
      table?.toggleAllPageRowsSelected(false)
      setCurrentpage(updatePage)
      setLimitPage(limitPage)
      setTotalPage(
        response?.data?.data?.totalPages ? response?.data?.data?.totalPages : 1
      )
      setTotalItems(
        response?.data?.data?.totalItems ? response?.data?.data?.totalItems : 0
      )
      setIsLoading(false)
    } catch (error) {}
  }
  const [filterValue, setFilterValue] = React.useState<any>("")
  const fetchData = async (updatePage: any, updateLimit: any) => {
    setIsLoading(true)
    if (!updatePage) {
      updatePage = 1
    }
    if (!updateLimit) {
      updateLimit = 10
    }

    setDeleteEnable(true)
    setEditEnable(true)
    setDeleteIds([])
    setEditObj("")
    setFilterValue("")
    try {
      const response = await axiosInstance.get(
        `${baseURL}/v1/defendants?page=${updatePage}&limit=${updateLimit}`
      )
      let listData = response?.data?.data?.rows
        ? response?.data?.data?.rows
        : []

      setData(listData)
      if (
        !totalItems ||
        updateLimit != limitPage ||
        (response?.data?.data?.totalItems &&
          totalItems != response?.data?.data?.totalItems)
      ) {
        let page: any = searchParams?.get("page")
          ? searchParams?.get("page")
          : 1
        setCurrentpage(page)
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
    setIsLoading(false)
  }

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

  const handlePage = async (event: any) => {
    if (event.key === "Enter") {
      const queryParams = new URLSearchParams()
      if (event.target.value) {
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
            applyFilter(currentPage, limitPage,"")
          } else {
            fetchData(currentPage, limitPage)
          }
        }
      }
      , 500)
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

  const fetchStatusType = async () => {
    try {
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
    } catch (error) {}
  }

  React.useEffect(() => {
    if (window?.location?.pathname && localStorage) {
      localStorage?.setItem("LastViewPage", window?.location?.pathname)
    }

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
    const fetchUserRoles = async () => {
      const session = await getSession()
      setUserRoles(session?.user?.roles || [])
    }

    fetchUserRoles()
    InitaialFecthData()
    fetchStatusType()
    getCodeTypes()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      if (!id) {
        return
      }
      await axiosInstance.delete(`${baseURL}/v1/defendants/${id}`)
      toast({
        variant: "default",
        description: "Defendant Deleted Successfully",
        style: {
          background: "#03C03C",
        },
      })
      table?.toggleAllPageRowsSelected(false)
      fetchData(currentPage, limitPage)
      setDeleteEnable(true)
      setEditEnable(true)
      setDeleteIds([])
      setEditObj("")
      setSelectedRows([])

      setIsOpen(false)
    } catch (error: any) {
      console.log("Error deleting item:", error.message)
    }
  }

  const [filtersApplied, setFiltersApplied] = React.useState(false)
  const [filterIsOpen, setFilterIsOpen] = React.useState<any>(false)
  const [showColumnIsOpen, setShowColumnIsOpen] = React.useState(false)
  const [statusTypeList, setStatusTypeList] = React.useState<any>([])
  const [filterHeight, setFilterHeight] = React.useState<any>("")

  const [prisonNameList, setPrisonNameList] = React.useState<any>([])
  const [impTypeList, setImpTypeList] = React.useState<any>([])

  const [filterDefendantID, setFilterDefendantID] = React.useState<any>("")
  const [filterFirstName, setFilterFirstName] = React.useState<any>("")
  const [filterLastName, setFilterLastName] = React.useState<any>("")
  const [filterStatus, setFilterStatus] = React.useState<any>("")
  const [filterInvestigationOpenDate, setFilterInvestigationOpenDate] =
    React.useState<any>([])
  const [filterInvestigationClosedDate, setFilterInvestigationClosedDate] =
    React.useState<any>([])
  const [filterCaseOpenDate, setFilterCaseOpenDate] = React.useState<any>([])
  const [filterCaseClosedDate, setFilterCaseClosedDate] = React.useState<any>(
    []
  )
  const [filterBirthDate, setFilterBirthDate] = React.useState<any>([])
  const [filterBirthDateIsOpen, setFilterBirthDateIsOpen] =
    React.useState<any>(false)
  const [filterBirthState, setFilterBirthState] = React.useState<any>("")
  const [filtersex, setFiltersex] = React.useState<any>("")
  const [filterChargedState, setFilterChargedState] = React.useState<any>("")
  const [filterChargedCounty, setFilterChargedCounty] = React.useState<any>("")
  const [filterPrisonID, setFilterPrisonID] = React.useState<any>("")
  const [filterSpeakEnglish, setFilterSpeakEnglish] = React.useState<any>(false)
  const [filterLitrateEnglish, setFilterLitrateEnglish] =
    React.useState<any>(false)
  const [filterSpeakSpanish, setFilterSpeakSpanish] = React.useState<any>(false)
  const [filterLitrateSpanish, setFilterLitrateSpanish] =
    React.useState<any>(false)
  const [filterOtherLanguage, setFilterOtherLanguage] =
    React.useState<any>(false)
  const [filterTotalYearsEducation, setFilterTotalYearsEducation] =
    React.useState<any>("")
  const [filterMentalImpairment, setFilterMentalImpairment] =
    React.useState<any>(false)
  const [filterImpairmentType, setFilterImpairmentType] =
    React.useState<any>("")
  const [filterProgramAttorney, setFilterProgramAttorney] =
    React.useState<any>("")
  const [filterlevelInvolvement, setFilterlevelInvolvement] =
    React.useState<any>("")
  const [showAllColumns, setShowAllColumns] = React.useState(false)

  const getCodeTypes = async () => {
    const response = await axiosInstance.get(`${baseURL}/v1/defendants/prison`)
    let data = response?.data?.data ? response?.data?.data : []
    setPrisonNameList([{ id: "", prisonName: "Select Option" }, ...data])

    const responseImp = await axiosInstance.get(
      `${baseURL}/v1/codes/codeType/Impairment`
    )
    const impType = responseImp?.data?.data ? responseImp?.data?.data : []
    setImpTypeList(impType)
  }

  const objectToCustomQueryString = (queryObject : any)=>{
    if( typeof queryObject === "object"){
      return '&' +  Object.keys(queryObject)
      .map(key => key + '=' + encodeURIComponent(queryObject[key]).replace(/%20/g, ' '))
      .join('&');
    }else{
      return "";
    }
  }

  const clearBadge = (badgeName : any)=>{
    let caseOpen = ""
    let caseClosed = ""
    let Invest_Open = ""
    let Invest_Closed = ""
    let Birth_Date = ""

    if (filterCaseOpenDate && filterCaseOpenDate?.length > 0) {
      caseOpen = filterCaseOpenDate.join(",")
    }
    if (filterCaseClosedDate && filterCaseClosedDate?.length > 0) {
      caseClosed = filterCaseClosedDate.join(",")
    }
    if (
      filterInvestigationOpenDate &&
      filterInvestigationOpenDate?.length > 0
    ) {
      Invest_Open = filterInvestigationOpenDate.join(",")
    }
    if (
      filterInvestigationClosedDate &&
      filterInvestigationClosedDate?.length > 0
    ) {
      Invest_Closed = filterInvestigationClosedDate.join(",")
    }

    if (filterBirthDate && filterBirthDate?.length > 0) {
      Birth_Date = filterBirthDate.join(",")
    }

    let removeBatchObject : any = {
      defID : filterDefendantID,
      firstName : filterFirstName,
      lastName : filterLastName,
      investigationClose : Invest_Closed,
      status : filterStatus,
      caseOpen : caseOpen,
      caseClosed : caseClosed,
      investigationOpen : Invest_Open,
      consulate : assignConsulateFilter,
      birthState : filterBirthState,
      birthDate : Birth_Date,
      sex : filtersex,
      chargedState : filterChargedState,
      chargedCounty : filterChargedCounty,
      prisonID : filterPrisonID,
      speakEnglish: filterSpeakEnglish ? "Yes" : "",
      litrateEnglish: filterLitrateEnglish ? "Yes" : "",
      speakSpanish : filterSpeakSpanish ? "Yes" : "",
      litrateSpanish : filterLitrateSpanish ? "Yes" : "",
      otherLanguage: filterOtherLanguage ? "Yes" : "",
      totalYearsEducation: filterTotalYearsEducation,
      mentalImpairment : filterMentalImpairment ? filterMentalImpairment : "", 
      impairmentType : filterImpairmentType,     
      programAttorney : filterProgramAttorney,
      levelInvolvement: filterlevelInvolvement,
      investigationClosedNullCheck: investigationClosedNullCheck ? investigationClosedNullCheck : "",
      investigationOpenedNullCheck: investigationOpenedNullCheck ? investigationOpenedNullCheck : "",
      caseOpenedNullCheck: caseOpenedNullCheck ? caseOpenedNullCheck : "" ,
      caseClosedNullCheck: caseClosedNullCheck ? caseClosedNullCheck : "" ,
    }

    if( badgeName){
      delete removeBatchObject[badgeName]
    }
    let filterAllempty = Object.values(removeBatchObject).filter((filter_ele)=>{
      return filter_ele !== '';
    });

    if( filterAllempty?.length === 0){
      // All clear badge
      setShowFilters(false)
      setFiltersApplied(false)
      fetchData(currentPage, limitPage)
    }else{
      applyFilter(currentPage,limitPage,removeBatchObject)
    }
  }

  const buildQueryString = () => {
    let caseOpen = ""
    let caseClosed = ""
    let Invest_Open = ""
    let Invest_Closed = ""
    let Birth_Date = ""

    if (filterCaseOpenDate && filterCaseOpenDate?.length > 0) {
      caseOpen = filterCaseOpenDate.join(",")
    }
    if (filterCaseClosedDate && filterCaseClosedDate?.length > 0) {
      caseClosed = filterCaseClosedDate.join(",")
    }
    if (
      filterInvestigationOpenDate &&
      filterInvestigationOpenDate?.length > 0
    ) {
      Invest_Open = filterInvestigationOpenDate.join(",")
    }
    if (
      filterInvestigationClosedDate &&
      filterInvestigationClosedDate?.length > 0
    ) {
      Invest_Closed = filterInvestigationClosedDate.join(",")
    }

    if (filterBirthDate && filterBirthDate?.length > 0) {
      Birth_Date = filterBirthDate.join(",")
    }

    let QueryString = ""

    QueryString += `&defID=${filterDefendantID}`
    QueryString += `&firstName=${filterFirstName}`
    QueryString += `&lastName=${filterLastName}`
    QueryString += `&investigationClose=${Invest_Closed}`
    QueryString += `&status=${filterStatus}`
    QueryString += `&caseOpen=${caseOpen}`
    QueryString += `&caseClosed=${caseClosed}`
    QueryString += `&investigationOpen=${Invest_Open}`
    QueryString += `&consulate=${assignConsulateFilter}`
    QueryString += `&birthState=${filterBirthState}`
    QueryString += `&birthDate=${Birth_Date}`
    QueryString += `&sex=${filtersex}`
    QueryString += `&chargedState=${filterChargedState}`
    QueryString += `&chargedCounty=${filterChargedCounty}`
    QueryString += `&prisonID=${filterPrisonID}`
    QueryString += `&speakEnglish=${filterSpeakEnglish ? "Yes" : ""}`
    QueryString += `&litrateEnglish=${filterLitrateEnglish ? "Yes" : ""}`
    QueryString += `&speakSpanish=${filterSpeakSpanish ? "Yes" : ""}`
    QueryString += `&litrateSpanish=${filterLitrateSpanish ? "Yes" : ""}`
    QueryString += `&otherLanguage=${filterOtherLanguage ? "Yes" : ""}`
    QueryString += `&totalYearsEducation=${filterTotalYearsEducation}`
    QueryString += `&mentalImpairment=${
      filterMentalImpairment ? filterMentalImpairment : ""
    }`
    QueryString += `&impairmentType=${filterImpairmentType}`
    QueryString += `&programAttorney=${filterProgramAttorney}`
    QueryString += `&levelInvolvement=${filterlevelInvolvement}`
    QueryString += `&investigationClosedNullCheck=${investigationClosedNullCheck ? investigationClosedNullCheck : ""}`
    QueryString += `&investigationOpenedNullCheck=${investigationOpenedNullCheck ? investigationOpenedNullCheck : ""}`
    QueryString += `&caseOpenedNullCheck=${caseOpenedNullCheck ? caseOpenedNullCheck : "" }`
    QueryString += `&caseClosedNullCheck=${caseClosedNullCheck ? caseClosedNullCheck : "" }`
    return QueryString
  }

  const applyFilter = async (updatePage: any, updateLimit: any, removeBatchParams : any) => {
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

      const QueryString = buildQueryString()

      let url = `${baseURL}/v1/defendants?page=${updatePage}&limit=${updateLimit}${QueryString}`
      if( removeBatchParams){
         let removeQueryString  = objectToCustomQueryString(removeBatchParams)
         url = `${baseURL}/v1/defendants?page=${updatePage}&limit=${updateLimit}${removeQueryString}`
      }
      const response = await axiosInstance.get(url)
      let listData = response?.data?.data?.rows
        ? response?.data?.data?.rows
        : []

      setData(listData)
      setShowFilters(true)
      setFiltersApplied(true)
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
    } catch (error) {}
  }

  function handleSelectedRows(selectedRows: any) {
    setSelectedRows(selectedRows)
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
              <Icons.trash className="mb-1 h-3.5 w-5" /> Delete
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
        Object.entries(hiddenColumns).map(([key, value]) => [key, value === false ? true : value])
      );
      table.setColumnVisibility(makeAllColumnsVissible)
    }
  }

  return (
    <div className="overscroll-y-none px-2 pb-1 pt-2">
      <div className="dark-container relative h-[calc(100vh-72px)] rounded-lg border bg-white p-2">
        <div className="flex">
          <h6 className="text-l ml-2 mt-2 font-bold md:hidden text-xs">Defendants</h6>
          <h2 className="text-l ml-2 mt-0.5 font-bold hidden md:block">Defendants</h2>
          <div className="relative ml-2 xl:ml-5 h-8">
            <Input
              className="w-32 md:w-44 pl-9 text-xs"
              onChange={handleSearch}
              value={filterValue}
              placeholder="Search"
            />
            <Icons.search className="absolute top-0 ml-2.5  h-8 w-4 text-muted-foreground" />
          </div>
          <div className="relative mb-2 ml-auto flex">
            <div>
              <Button
                variant="outline"
                onClick={() => handleExport(table)}
                className="mr-1 ml-1 md:ml-0 md:mr-2 flex h-8 items-center rounded-lg bg-transparent px-1.5 xl:px-3.5 py-1 text-xs xl:py-1.5"
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
                }}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex h-8 items-center rounded-lg bg-transparent px-1.5 xl:px-3.5 py-1 text-xs xl:py-1.5"
                  >
                    <Icons.filter className="h-3.5 w-5" />
                   <span className="hidden md:block">Filter</span> 
                  </Button>
                </SheetTrigger>
                <SheetContent className="pr-2 p-2 md:p-6">
                  <SheetHeader className="text-start">
                    <SheetTitle className="border-b">Filter</SheetTitle>
                    <SheetDescription className="thin-scrollbar h-[calc(100vh-124px)] overflow-y-auto p-2 mb-2">
                      <div className="">

                      <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div className="">
                            <Label
                              className="text-[0.7rem] font-semibold text-gray-600"
                              htmlFor="Defendant-ID"
                            >
                              Defendant ID
                            </Label>
                            <Input
                              id="Defendant-ID"
                              type="text"
                              className="mt-1 h-8 rounded-lg border py-2 pl-3 text-xs"
                              placeholder="Defendant ID"
                              value={filterDefendantID}
                              onChange={(e) => {
                                setFilterDefendantID(e.target.value)
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div className="">
                            <Label
                              className="text-[0.7rem] font-semibold text-gray-600"
                              htmlFor="maternal-lastname"
                            >
                              Last Name
                            </Label>
                            <Input
                              id="maternal-lastname"
                              type="text"
                              className="mt-1 h-8 w-full rounded-lg border py-2 pl-3 text-xs"
                              placeholder="Last Name"
                              value={filterLastName}
                              onChange={(e) => {
                                setFilterLastName(e.target.value)
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div>
                            <div>
                              <Label
                                className="text-[0.7rem] font-semibold text-gray-600"
                                htmlFor="firstName"
                              >
                                First Name
                              </Label>
                            </div>

                            <Input
                              id="firstName"
                              type="text"
                              className="mt-1 h-8 w-full rounded-lg border py-2 pl-3 text-xs"
                              placeholder="First Name"
                              value={filterFirstName}
                              onChange={(e) => {
                                setFilterFirstName(e.target.value)
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 items-center gap-2">
                          <div className="">
                            <div className="flex">
                              <h4 className="text-[0.7rem] font-semibold text-gray-600">
                                Assign Consulate
                              </h4>
                            </div>
                            <Popover
                              open={assignIsOpen}
                              onOpenChange={setAssignIsOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={assignIsOpen}
                                  className="h-8 w-full justify-between text-xs"
                                >
                                  <span className="text-xs">
                                    {assignConsulateFilter
                                      ? assignConsulateFilter
                                      : "Select Consulate"}
                                  </span>
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0 text-xs">
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
                                            setAssignConsulateFilter(
                                              framework.codeCode
                                            )
                                            setAssignIsOpen(false)
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              assignConsulateFilter ==
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

                          <div className="mt-2 grid grid-cols-1 items-center gap-2">
                            <div className="">
                              <Label className="text-[0.7rem] font-semibold text-gray-600">
                                Case Status
                              </Label>
                              <Select
                                value={filterStatus}
                                onValueChange={(e) => {
                                  setFilterStatus(String(e))
                                }}
                              >
                                <SelectTrigger className="mt-1 h-8 w-full text-xs">
                                  <SelectValue
                                    placeholder="Select Type"
                                    className="text-xs"
                                  >
                                    {filterStatus
                                      ? filterStatus
                                      : "Select Type"}
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
                        </div>
                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div>
                          <div className="mt-4 my-2 flex items-center justify-between">
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
                            <span className="mx-2 text-center text-[0.7rem]">
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
                                <div className="flex h-8 items-center border rounded-md py-2 w-[270px] md:w-[320px]">
                                  <Input
                                    defaultValue={filterCaseOpenDate && filterCaseOpenDate[0] && moment(filterCaseOpenDate[0]).isValid() ? convertToUTCDate(filterCaseOpenDate[0]) : ''}
                                    onChange={(e) => {
                                      let filterDate = e.target.value;
                                      if (moment(filterDate, 'MM/DD/YYYY', true).isValid()) {
                                        let oldDateFilter = [...filterCaseOpenDate]
                                        oldDateFilter[0] = moment(filterDate).format("YYYY-MM-DD")
                                        setFilterCaseOpenDate(oldDateFilter);
                                      }
                                    }}
                                    className="appearance-none bg-transparent border-none w-[110px] text-xs text-gray-500  py-1 focus:outline-none  focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50" type="text" placeholder="MM/DD/YYYY" />
                                  <label className="mx-2"> to </label>
                                  <Input
                                    defaultValue={filterCaseOpenDate && filterCaseOpenDate[1] && moment(filterCaseOpenDate[1]).isValid() ? convertToUTCDate(filterCaseOpenDate[1]) : ''}
                                    onChange={(e) => {
                                      let filterDate = e.target.value;
                                      if (moment(filterDate, 'MM/DD/YYYY', true).isValid()) {
                                        let oldDateFilter = [...filterCaseOpenDate]
                                        oldDateFilter[1] = moment(filterDate).format("YYYY-MM-DD")
                                        setFilterCaseOpenDate(oldDateFilter);
                                      }
                                    }}
                                    className="appearance-none bg-transparent border-none text-xs text-gray-500 py-1 w-[110px] focus:outline-none  focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50" type="text" placeholder="MM/DD/YYYY" />
                                  {/* <Button onClick={() => {
                                    setCaseOpenDateIsOpen(true)
                                  }}
                                    variant={"outline"}
                                    className={cn(
                                      "h-8 justify-start text-left border-none text-xs font-normal hover:bg-transparent",
                                      !filterCaseOpenDate &&
                                      "text-muted-foreground"
                                    )}
                                  > */}
                                  <div className="w-full flex justify-end">
                                    <CalendarIcon className="mr-3 h-4 w-4" 
                                    onClick={() => {
                                    setCaseOpenDateIsOpen(true)
                                  }} />
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
                          <div className="my-2 flex items-center justify-between">
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
                            <span className="mx-2 text-center text-[0.7rem]">
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
                              <div className="flex h-8 items-center border rounded-md py-2 w-[270px] md:w-[320px]">
                              <Input
                                    defaultValue={filterCaseClosedDate && filterCaseClosedDate[0] && moment(filterCaseClosedDate[0]).isValid() ? convertToUTCDate(filterCaseClosedDate[0]) : ''}
                                    onChange={(e) => {
                                      let filterDate = e.target.value;
                                      if (moment(filterDate, 'MM/DD/YYYY', true).isValid()) {
                                        let oldDateFilter = [...filterCaseClosedDate]
                                        oldDateFilter[0] = moment(filterDate).format("YYYY-MM-DD")
                                        setFilterCaseClosedDate(oldDateFilter);
                                      }
                                    }}
                                    className="appearance-none bg-transparent border-none w-[110px] text-xs text-gray-500  py-1 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50" type="text" placeholder="MM/DD/YYYY" />
                                  <label className="mx-2"> to </label>
                                  <Input
                                    defaultValue={filterCaseClosedDate && filterCaseClosedDate[1] && moment(filterCaseClosedDate[1]).isValid() ? convertToUTCDate(filterCaseClosedDate[1]) : ''}
                                    onChange={(e) => {
                                      let filterDate = e.target.value;
                                      if (moment(filterDate, 'MM/DD/YYYY', true).isValid()) {
                                        let oldDateFilter = [...filterCaseClosedDate]
                                        oldDateFilter[1] = moment(filterDate).format("YYYY-MM-DD")
                                        setFilterCaseClosedDate(oldDateFilter);
                                      }
                                    }}
                                    className="appearance-none bg-transparent border-none text-xs text-gray-500 py-1 w-[110px] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50" type="text" placeholder="MM/DD/YYYY" />
                               
                                <div className="w-full flex justify-end">
                                  <CalendarIcon className="mr-3 h-4 w-4" onClick={() => {
                                  setCaseCloseDateIsOpen(true)
                                }} />
                                </div>
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
                          <div className="my-2 flex items-center justify-between">
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
                            <span className="mx-2 text-center text-[0.7rem]">
                              Include Null
                            </span>
                            </div>
                          </div>
                            <div>
                            <Popover
                              open={investOpenDateIsOpen}
                              // onOpenChange={setCaseCloseDateIsOpen}
                              onOpenChange={(e) => {
                                if (!e) {
                                  setInvestOpenDateIsOpen(e)
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                              <div className="flex h-8 items-center border rounded-md py-2 w-[270px] md:w-[320px]">
                              <Input
                                    defaultValue={filterInvestigationOpenDate && filterInvestigationOpenDate[0] && moment(filterInvestigationOpenDate[0]).isValid() ? convertToUTCDate(filterInvestigationOpenDate[0]) : ''}
                                    onChange={(e) => {
                                      let filterDate = e.target.value;
                                      if (moment(filterDate, 'MM/DD/YYYY', true).isValid()) {
                                        let oldDateFilter = [...filterInvestigationOpenDate]
                                        oldDateFilter[0] = moment(filterDate).format("YYYY-MM-DD")
                                        setFilterInvestigationOpenDate(oldDateFilter);
                                      }
                                    }}
                                    className="appearance-none bg-transparent border-none w-[110px] text-xs text-gray-500  py-1 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50" type="text" placeholder="MM/DD/YYYY" />
                                  <label className="mx-2"> to </label>
                                  <Input
                                    defaultValue={filterInvestigationOpenDate && filterInvestigationOpenDate[1] && moment(filterInvestigationOpenDate[1]).isValid() ? convertToUTCDate(filterInvestigationOpenDate[1]) : ''}
                                    onChange={(e) => {
                                      let filterDate = e.target.value;
                                      if (moment(filterDate, 'MM/DD/YYYY', true).isValid()) {
                                        let oldDateFilter = [...filterInvestigationOpenDate]
                                        oldDateFilter[1] = moment(filterDate).format("YYYY-MM-DD")
                                        setFilterInvestigationOpenDate(oldDateFilter);
                                      }
                                    }}
                                    className="appearance-none bg-transparent border-none text-xs text-gray-500 py-1 w-[110px] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50" type="text" placeholder="MM/DD/YYYY" />
                                  <div className="flex justify-end w-full">
                                  <CalendarIcon className="mr-3 h-4 w-4" onClick={() => {
                                  setInvestOpenDateIsOpen(true)
                                }}/>
                                </div>
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
                                    setFilterInvestigationOpenDate(dateArray)
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
                          <div className="my-2 flex items-center justify-between">
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
                            <span className="mx-2 text-center text-[0.7rem]">
                              Include Null
                            </span>
                            </div>
                          </div>
                            <div>
                            <Popover
                              open={investCloseDateIsOpen}
                              // onOpenChange={setCaseCloseDateIsOpen}
                              onOpenChange={(e) => {
                                if (!e) {
                                  setInvestCloseDateIsOpen(e)
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                              <div className="flex h-8 items-center border rounded-md py-2 w-[270px] md:w-[320px]">
                              <Input
                                    defaultValue={filterInvestigationClosedDate && filterInvestigationClosedDate[0] && moment(filterInvestigationClosedDate[0]).isValid() ? convertToUTCDate(filterInvestigationClosedDate[0]) : ''}
                                    onChange={(e) => {
                                      let filterDate = e.target.value;
                                      if (moment(filterDate, 'MM/DD/YYYY', true).isValid()) {
                                        let oldDateFilter = [...filterInvestigationClosedDate]
                                        oldDateFilter[0] = moment(filterDate).format("YYYY-MM-DD")
                                        setFilterInvestigationClosedDate(oldDateFilter);
                                      }
                                    }}
                                    className="appearance-none bg-transparent border-none w-[110px] text-xs text-gray-500  py-1 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50" type="text" placeholder="MM/DD/YYYY" />
                                  <label className="mx-2"> to </label>
                                  <Input
                                    defaultValue={filterInvestigationClosedDate && filterInvestigationClosedDate[1] && moment(filterInvestigationClosedDate[1]).isValid() ? convertToUTCDate(filterInvestigationClosedDate[1]) : ''}
                                    onChange={(e) => {
                                      let filterDate = e.target.value;
                                      if (moment(filterDate, 'MM/DD/YYYY', true).isValid()) {
                                        let oldDateFilter = [...filterInvestigationClosedDate]
                                        oldDateFilter[1] = moment(filterDate).format("YYYY-MM-DD")
                                        setFilterInvestigationClosedDate(oldDateFilter);
                                      }
                                    }}
                                    className="appearance-none bg-transparent border-none text-xs text-gray-500 py-1 w-[110px] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50" type="text" placeholder="MM/DD/YYYY" />
                                <div className="flex justify-end w-full">
                                <CalendarIcon className="mr-3 h-4 w-4" onClick={() => {
                                  setInvestCloseDateIsOpen(true)
                                }}/>
                                </div>
                                </div>

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
                                    setFilterInvestigationClosedDate(dateArray)
                                    setInvestCloseDateIsOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div>
                            <Label className="text-[0.7rem] font-semibold text-gray-600">
                              Birth Date
                            </Label>
                            <div>
                              <Popover
                                open={filterBirthDateIsOpen}
                                onOpenChange={setFilterBirthDateIsOpen}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "h-8 w-full justify-between text-left text-xs font-normal",
                                      !filterBirthDate &&
                                        "text-muted-foreground"
                                    )}
                                  ><div className="flex">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filterBirthDate?.length > 0 &&
                                    filterBirthDate[0] &&
                                    moment(filterBirthDate[0]).isValid()
                                      ? convertToUTCDate(filterBirthDate[0])
                                      : "Pick a date"}{" "}
                                    {filterBirthDate?.length == 2 ? " to " : ""}
                                    {filterBirthDate?.length > 0 &&
                                    filterBirthDate[1] &&
                                    moment(filterBirthDate[1]).isValid()
                                      ? convertToUTCDate(filterBirthDate[1])
                                      : ""}
                                  </div>
                                      { filterBirthDate?.length > 0 && (
                                      <div className="flex">
                                        <Icons.close className="mr-2 h-4 w-4" onClick={()=>{
                                          setFilterBirthDate([])
                                        }}  />
                                      </div>
                                      )}
                                  </Button>
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
                                      let endDate = moment(
                                        dateFields[1]
                                      ).format("YYYY-MM-DD")
                                      let dateArray = [startDate, endDate]
                                      setFilterBirthDate(dateArray)
                                      setFilterBirthDateIsOpen(false)
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div className="flex">
                            <Label
                              htmlFor="birthState"
                              className="text-[0.7rem] font-semibold text-gray-600"
                            >
                              Birth State
                            </Label>
                          </div>
                          <AddressSelect
                            disabled={false}
                            category={"mexicoStatesAndCities"}
                            placeholdername={"Select state"}
                            defultselect={filterBirthState}
                            className="w-full"
                            selectedValue={(val) => {
                              setFilterBirthState(val)
                            }}
                            wPage={190}
                          />
                        </div>

                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div className="">
                            <Label
                              htmlFor="sex"
                              className="text-[0.7rem] font-semibold text-gray-600"
                            >
                              Sex
                            </Label>
                            <Select
                              value={filtersex}
                              onValueChange={(e) => {
                                setFiltersex(e)
                              }}
                            >
                              <SelectTrigger
                                id="sex"
                                className="select-custom h-8 w-full text-xs disabled:cursor-text disabled:border-0 disabled:p-0  disabled:opacity-100"
                              >
                                <SelectValue placeholder={"Sex"} />
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

                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div className="my-2 w-full">
                            <div className="flex">
                              <h4 className="text-[0.7rem] font-semibold text-gray-600">
                                Charged State
                              </h4>{" "}
                            </div>
                            <div>
                              <AddressSelect
                                disabled={false}
                                country={"USA"}
                                category={"usStatesAndCities"}
                                placeholdername={"Select State"}
                                defultselect={filterChargedState}
                                className="w-full"
                                selectedValue={(val) => {
                                  setFilterChargedState(val)
                                  setFilterChargedCounty("")
                                }}
                                wPage={190}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <Label className="] text-[0.7rem] font-semibold text-gray-600">
                            Charged County
                          </Label>
                          <AddressSelect
                            disabled={false}
                            category={"county"}
                            placeholdername={"Select County"}
                            state={filterChargedState}
                            defultselect={filterChargedCounty}
                            className="w-full"
                            selectedValue={(val) => {
                              setFilterChargedCounty(val)
                            }}
                            wPage={190}
                          />
                        </div>

                        <div className="mt-2 grid grid-cols-2 items-center gap-2">
                          <div>
                            <div className="ml-[138px] mt-3 flex flex-row">
                              <span className="mx-2 text-xs">English</span>
                              <span className="mx-9 text-xs">Spanish</span>
                            </div>
                            <div className="mt-3 flex flex-row">
                              <span className=" flex  whitespace-nowrap text-xs">
                                Speaks{" "}
                              </span>
                              <div className="ml-[7rem]">
                                <Checkbox
                                  checked={filterSpeakEnglish}
                                  onCheckedChange={(e: any) => {
                                    setFilterSpeakEnglish(e)
                                  }}
                                  className="border-slate-600 disabled:cursor-text disabled:p-0 disabled:opacity-100"
                                />
                              </div>
                              <div className="mx-[4.5rem]">
                                <Checkbox
                                  checked={filterSpeakSpanish}
                                  onCheckedChange={(e: any) => {
                                    setFilterSpeakSpanish(e)
                                  }}
                                  className="border-slate-600 disabled:cursor-text disabled:p-0 disabled:opacity-100"
                                />
                              </div>
                            </div>
                            <div className="mt-2 flex flex-row items-center ">
                              <span className="flex whitespace-nowrap text-xs">
                                Literate{" "}
                              </span>
                              <div className="ml-[110px] flex">
                                <Checkbox
                                  checked={filterLitrateEnglish}
                                  onCheckedChange={(e: any) => {
                                    setFilterLitrateEnglish(e)
                                  }}
                                  className="border-slate-600  disabled:cursor-text disabled:p-0 disabled:opacity-100"
                                />
                              </div>
                              <div className=" mx-[73px] flex">
                                <Checkbox
                                  checked={filterLitrateSpanish}
                                  onCheckedChange={(e: any) => {
                                    setFilterLitrateSpanish(e)
                                  }}
                                  className="border-slate-600  disabled:cursor-text disabled:p-0 disabled:opacity-100"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div className="my-2 mt-4 flex items-center">
                            <Checkbox
                              checked={filterOtherLanguage}
                              onCheckedChange={(e: any) => {
                                setFilterOtherLanguage(e)
                              }}
                              className="border-slate-600 disabled:cursor-text disabled:p-0 disabled:opacity-100"
                            />
                            <span className="mx-2 text-center text-xs">
                              Speaks other languages
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div className="">
                            <div className="flex">
                              <Label className="text-[0.7rem] font-semibold text-gray-600">
                                Prison
                              </Label>
                            </div>
                            <Popover
                            // open={open} onOpenChange={setOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  // aria-expanded={open}
                                  className="select-custom h-8 w-full justify-between whitespace-nowrap text-xs font-normal  disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                                >
                                  {filterPrisonID
                                    ? prisonNameList.find(
                                        (framework: any) =>
                                          framework.id == filterPrisonID
                                      )?.prisonName
                                    : "Select Prison"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[320px] p-0">
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
                                          setFilterPrisonID(framework.id)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            filterPrisonID === framework.id
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
                        </div>

                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div className="mt-2">
                            <Label
                              htmlFor="totalYearSofEducation"
                              className="text-[0.7rem] font-semibold text-gray-600"
                            >
                              Total years of education
                            </Label>
                            <Select
                              value={filterTotalYearsEducation}
                              onValueChange={(e) => {
                                setFilterTotalYearsEducation(e)
                              }}
                            >
                              <SelectTrigger
                                id="totalYearSofEducation"
                                className="select-custom h-8 w-full text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                              >
                                <SelectValue
                                  placeholder={"years of education"}
                                />
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
                        </div>

                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div className="flex items-center pt-5">
                            <Checkbox
                              checked={filterMentalImpairment}
                              onCheckedChange={(e: any) => {
                                setFilterMentalImpairment(e)
                              }}
                              className="border-slate-600"
                            />

                            <span className="px-1 text-center text-xs">
                              Suspected Intellectual Disability
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div className="my-2">
                            <Label
                              htmlFor="type"
                              className="text-[0.7rem] font-semibold text-gray-600"
                            >
                              Mental imparment types
                            </Label>
                            <Select
                              value={filterImpairmentType}
                              onValueChange={(value: any) => {
                                setFilterImpairmentType(value)
                              }}
                            >
                              <SelectTrigger className="select-custom h-8 w-full text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100">
                                <SelectValue placeholder={"Select Type"} />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-slate-900">
                                <SelectGroup>
                                  <SelectItem value="" className="text-xs">
                                    Select Type
                                  </SelectItem>
                                  {impTypeList &&
                                    impTypeList?.map((map_ele: any, i: any) => (
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
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div>
                            <Label
                              htmlFor="program attorney"
                              className="text-[0.7rem] font-semibold text-gray-600"
                            >
                              Program Attorney
                            </Label>
                            <Input
                              value={filterProgramAttorney}
                              placeholder={"Program Attorney"}
                              onChange={(e) => {
                                setFilterProgramAttorney(e.target.value)
                              }}
                              className="text-xs disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100"
                            />
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-1 items-center gap-2">
                          <div>
                            <Label
                              htmlFor="type"
                              className="text-[0.7rem] font-semibold text-gray-600"
                            >
                              MCLAP level of involvement
                            </Label>
                            <Select
                              value={filterlevelInvolvement}
                              onValueChange={(e) => {
                                setFilterlevelInvolvement(e)
                              }}
                            >
                              <SelectTrigger className="select-custom h-8 w-full text-xs  disabled:cursor-text disabled:border-0 disabled:p-0 disabled:opacity-100">
                                <SelectValue placeholder={"select option"} />
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
                    </SheetDescription>
                    <div className="relative mt-5 flex items-center justify-between py-1 xl:py-2 border-t">
                      <div>
                        {filtersApplied && (
                          <div className="">
                            <Button
                              variant="link"
                              onClick={(e) => {
                                setFilterFirstName("")
                                setFilterLastName("")
                                setFilterLastName("")
                                setFilterInvestigationClosedDate([])
                                setFilterInvestigationOpenDate([])
                                setFilterCaseClosedDate([])
                                setFilterCaseOpenDate([])
                                setFilterStatus("")
                                setFilterBirthDate([])
                                setFilterBirthState("")
                                setFiltersex("")
                                setFilterChargedState("")
                                setFilterPrisonID("")
                                setFilterSpeakEnglish("")
                                setFilterLitrateEnglish("")
                                setFilterSpeakSpanish("")
                                setFilterLitrateSpanish("")
                                setFilterOtherLanguage("")
                                setFilterTotalYearsEducation("")
                                setFilterMentalImpairment(false)
                                setFilterChargedCounty("")
                                setAssignConsulateFilter("")
                                setFilterProgramAttorney("")
                                setFilterlevelInvolvement("")
                                setFilterDefendantID("")
                                setFilterDefendantID("")
                                setFiltersApplied(false)
                                setShowFilters(false)
                                setFilterIsOpen(false)
                                fetchData(currentPage, limitPage)
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
                          onClick={() => applyFilter(1, limitPage,"")}
                          className="ml-2 h-8 rounded-lg bg-red-700 px-3 py-1 text-xs text-destructive-foreground hover:bg-red-400"
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
            <div className="mx-1 md:mx-2">
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
                    <Icons.columnVisible className="h-3.5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader className="text-start">
                    <SheetTitle>
                      <div className="flex justify-between">
                        <div>Show Columns</div>
                        <div>
                          <Button
                            className="p-0 mr-7 h-8"
                            variant="link"
                            onClick={() => showAllColumnsHandler(table)}
                          >
                            {" "}
                            {showAllColumns ? "Select Default" : "Select All"}
                          </Button>
                        </div>
                      </div>
                    </SheetTitle>
                    <SheetDescription  className="thin-scrollbar mb-2 h-[calc(100vh-100px)] overflow-y-auto p-2">
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        {table.getAllColumns()?.map((column: any, i: any) => {
                          if (column?.id != "id") {
                            return (
                              <div key={i}>
                                <label className="text-sm text-muted-foreground">
                                  <Toggle
                                    variant="outline"
                                    className="h-8 text-xs hover:bg-transparent"
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
            {!userRoles.includes("VIEWER") && (
              <Link
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "ml-0 xl:ml-1 flex h-8 items-center rounded-lg bg-transparent px-1.5 xl:px-3.5 py-1 text-xs xl:py-1.5"
                )}
                href={`/defendants`}
              >
                <Icons.add className="h-4 w-4 pb-1" />
               <span className="hidden md:block">Add</span> 
              </Link>
            )}
          </div>
        </div>
        {showFilters && (
          <div
            ref={showfilterRef}
            id="ggg"
            className="flex flex-nowrap border-t py-2"
          >
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
                    clearBadge('defID')
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
                    clearBadge('firstName')
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
                    clearBadge('lastName')

                  }}
                />
              </Badge>
            )}
            {assignConsulateFilter && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Assign Consulate
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {assignConsulateFilter}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setAssignConsulateFilter("")
                    clearBadge('consulate')

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
                    clearBadge('status')

                  }}
                />
              </Badge>
            )}
            {filterInvestigationOpenDate &&
              filterInvestigationOpenDate?.length > 0 && (
                <Badge
                  variant="outline"
                  className="mr-2 h-6 rounded-md pl-3 pr-0"
                >
                  <span className="border-r pr-2 text-[0.65rem] font-normal">
                    Investigation Opened Date
                  </span>
                  <span className="pl-2 text-[0.65rem] font-normal">
                    {filterInvestigationOpenDate?.length > 0 &&
                    filterInvestigationOpenDate[0] &&
                    moment(filterInvestigationOpenDate[0]).isValid()
                      ? convertToUTCDate(filterInvestigationOpenDate[0])
                      : ""}{" "}
                    {filterInvestigationOpenDate?.length == 2 ? " to " : ""}
                    {filterInvestigationOpenDate?.length > 0 &&
                    filterInvestigationOpenDate[1] &&
                    moment(filterInvestigationOpenDate[1]).isValid()
                      ? convertToUTCDate(filterInvestigationOpenDate[1])
                      : ""}
                  </span>
                  <Icons.close
                    className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setFilterInvestigationOpenDate([])
                      clearBadge('investigationOpen')

                    }}
                  />
                </Badge>
              )}
            {filterInvestigationClosedDate &&
              filterInvestigationClosedDate?.length > 0 && (
                <Badge
                  variant="outline"
                  className="mr-2 h-6 rounded-md pl-3 pr-0"
                >
                  <span className="border-r pr-2 text-[0.65rem] font-normal">
                    Investigation Closed Date
                  </span>
                  <span className="pl-2 text-[0.65rem] font-normal">
                    {filterInvestigationClosedDate?.length > 0 &&
                    filterInvestigationClosedDate[0] &&
                    moment(filterInvestigationClosedDate[0]).isValid()
                      ? convertToUTCDate(filterInvestigationClosedDate[0])
                      : ""}{" "}
                    {filterInvestigationClosedDate?.length == 2 ? " to " : ""}
                    {filterInvestigationClosedDate?.length > 0 &&
                    filterInvestigationClosedDate[1] &&
                    moment(filterInvestigationClosedDate[1]).isValid()
                      ? convertToUTCDate(filterInvestigationClosedDate[1])
                      : ""}
                  </span>
                  <Icons.close
                    className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setFilterInvestigationClosedDate([])
                      clearBadge('investigationClose')

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
                    clearBadge('caseOpen')
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
                    clearBadge('caseClosed')

                  }}
                />
              </Badge>
            )}

            {filterBirthDate && filterBirthDate?.length > 0 && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Birth Date
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterBirthDate?.length > 0 &&
                  filterBirthDate[0] &&
                  moment(filterBirthDate[0]).isValid()
                    ? convertToUTCDate(filterBirthDate[0])
                    : ""}{" "}
                  {filterBirthDate?.length == 2 ? " to " : ""}
                  {filterBirthDate?.length > 0 &&
                  filterBirthDate[1] &&
                  moment(filterBirthDate[1]).isValid()
                    ? convertToUTCDate(filterBirthDate[1])
                    : ""}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterBirthDate([])
                    clearBadge('birthState')

                  }}
                />
              </Badge>
            )}
            {filterBirthState && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Birth State
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterBirthState.replace(
                    /(^\w{1})|(\s+\w{1})/g,
                    (letter: any) => letter.toUpperCase()
                  )}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterBirthState("")
                    clearBadge('birthState')
                  }}
                />
              </Badge>
            )}
            {filtersex && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Sex
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filtersex.replace(/(^\w{1})|(\s+\w{1})/g, (letter: any) =>
                    letter.toUpperCase()
                  )}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFiltersex("")
                    clearBadge('sex')
                  }}
                />
              </Badge>
            )}
            {filterChargedState && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Charged State
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterChargedState.replace(
                    /(^\w{1})|(\s+\w{1})/g,
                    (letter: any) => letter.toUpperCase()
                  )}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterChargedState("")
                    clearBadge('chargedState')
                  }}
                />
              </Badge>
            )}
            {filterChargedCounty && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Charged County
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterChargedCounty.replace(
                    /(^\w{1})|(\s+\w{1})/g,
                    (letter: any) => letter.toUpperCase()
                  )}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterChargedCounty("")
                    clearBadge('chargedCounty')
                  }}
                />
              </Badge>
            )}
            {filterPrisonID && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Prison
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {
                    prisonNameList.find(
                      (framework: any) => framework.id == filterPrisonID
                    )?.prisonName
                  }
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterPrisonID("")
                    clearBadge('prisonID')
                  }}
                />
              </Badge>
            )}
            {filterTotalYearsEducation && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Total years of education
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterTotalYearsEducation.replace(
                    /(^\w{1})|(\s+\w{1})/g,
                    (letter: any) => letter.toUpperCase()
                  )}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterTotalYearsEducation("")
                    clearBadge('totalYearsEducation')

                  }}
                />
              </Badge>
            )}
            {filterImpairmentType && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Mental Impairment Type
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterImpairmentType.replace(
                    /(^\w{1})|(\s+\w{1})/g,
                    (letter: any) => letter.toUpperCase()
                  )}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterImpairmentType("")
                    clearBadge('impairmentType')
                  }}
                />
              </Badge>
            )}
            {filterProgramAttorney && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Program Attorney
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterProgramAttorney.replace(
                    /(^\w{1})|(\s+\w{1})/g,
                    (letter: any) => letter.toUpperCase()
                  )}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterProgramAttorney("")
                    clearBadge('programAttorney')

                  }}
                />
              </Badge>
            )}
            {filterlevelInvolvement && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  level Involvement
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterlevelInvolvement.replace(
                    /(^\w{1})|(\s+\w{1})/g,
                    (letter: any) => letter.toUpperCase()
                  )}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterlevelInvolvement("")
                    clearBadge('levelInvolvement')

                  }}
                />
              </Badge>
            )}
            {filterMentalImpairment && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Mental Impairment
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {/* {filterMentalImpairment.replace(/(^\w{1})|(\s+\w{1})/g, (letter: any) =>
                    letter.toUpperCase()
                  )} */}
                  {filterMentalImpairment == true ? "Yes" : "No"}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterMentalImpairment("")
                    clearBadge('mentalImpairment')

                  }}
                />
              </Badge>
            )}

            {filterSpeakEnglish && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Speak English
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {/* {filterSpeakEnglish.replace(/(^\w{1})|(\s+\w{1})/g, (letter: any) =>
                    letter.toUpperCase()
                  )} */}
                  {filterSpeakEnglish == true ? "Yes" : "No"}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterSpeakEnglish(false)
                    clearBadge('speakEnglish')

                  }}
                />
              </Badge>
            )}
            {filterLitrateEnglish && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Literate English
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {/* {filterLitrateEnglish.replace(/(^\w{1})|(\s+\w{1})/g, (letter: any) =>
                    letter.toUpperCase()
                  )} */}
                  {filterLitrateEnglish == true ? "Yes" : "No"}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterLitrateEnglish(false)
                    clearBadge('litrateEnglish')

                  }}
                />
              </Badge>
            )}
            {filterSpeakSpanish && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Speak Spanish
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {/* {filterSpeakSpanish.replace(/(^\w{1})|(\s+\w{1})/g, (letter: any) =>
                    letter.toUpperCase()
                  )} */}
                  {filterSpeakSpanish == true ? "Yes" : "No"}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterSpeakSpanish(false)
                    clearBadge('speakSpanish')

                  }}
                />
              </Badge>
            )}

            {filterLitrateSpanish && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Literate Spanish
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {/* {filterLitrateSpanish.replace(/(^\w{1})|(\s+\w{1})/g, (letter: any) =>
                    letter.toUpperCase()
                  )} */}
                  {filterLitrateSpanish == true ? "Yes" : "No"}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterLitrateSpanish("")
                    clearBadge('litrateSpanish')

                  }}
                />
              </Badge>
            )}
            {filterOtherLanguage && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Other Language
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {/* {filterOtherLanguage.replace(/(^\w{1})|(\s+\w{1})/g, (letter: any) =>
                    letter.toUpperCase()
                  )} */}
                  {filterOtherLanguage == true ? "Yes" : "No"}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterOtherLanguage(false)
                    clearBadge('otherLanguage')

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
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setCaseOpenedNullCheck(false)
                    clearBadge('caseOpenedNullCheck')

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
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setCaseClosedNullCheck(false)
                    clearBadge('caseClosedNullCheck')

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
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setInvestigationOpenedNullCheck(false)
                    clearBadge('investigationOpenedNullCheck')

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
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setCaseInvestigationClosedNullCheck(false)
                    clearBadge('investigationClosedNullCheck')

                  }}
                />
              </Badge>
            )}

            <div className="">
              {(filterFirstName ||
                filterLastName ||
                filterStatus ||
                assignConsulateFilter ||
                (filterCaseOpenDate?.length > 0) ||
                (filterCaseClosedDate?.length > 0) ||
                (filterInvestigationOpenDate?.length > 0) ||
                (filterInvestigationClosedDate?.length > 0) ||
                (filterBirthDate?.length > 0) ||
                filterBirthState ||
                filtersex ||
                filterChargedState ||
                filterChargedCounty ||
                filterPrisonID ||
                filterTotalYearsEducation ||
                filterImpairmentType ||
                filterProgramAttorney ||
                filterlevelInvolvement ||
                filterMentalImpairment ||
                filterSpeakEnglish ||
                filterLitrateEnglish ||
                filterSpeakSpanish ||
                filterLitrateSpanish ||
                filterOtherLanguage ||
                caseOpenedNullCheck ||
                caseClosedNullCheck ||
                investigationOpenedNullCheck ||
                investigationClosedNullCheck 
              ) && (
                <Button
                  variant="link"
                  onClick={(e) => {
                    setFilterFirstName("")
                    setFilterLastName("")
                    setFilterInvestigationOpenDate([])
                    setAssignConsulateFilter("")
                    setFilterInvestigationClosedDate([])
                    setFilterStatus("")
                    setFilterCaseOpenDate([])
                    setFilterCaseClosedDate([])
                    setFilterBirthDate([])
                    setFilterBirthState("")
                    setFiltersex("")
                    setFilterChargedState("")
                    setFilterChargedCounty("")
                    setFilterPrisonID("")
                    setFilterImpairmentType("")
                    setFilterProgramAttorney("")
                    setFilterlevelInvolvement("")
                    setFilterMentalImpairment(false)
                    setFilterSpeakEnglish(false)
                    setFilterSpeakSpanish(false)
                    setFilterLitrateSpanish(false)
                    setFilterLitrateEnglish(false)
                    setFilterOtherLanguage(false)
                    setFilterIsOpen(false)
                    setFiltersApplied(false)
                    setShowFilters(false)
                    fetchData(currentPage, limitPage)
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
              <Table className="overflow-auto">
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
                            {header.isPlaceholder ? null : (
                              <div className="flex items-center">
                                {header.column.id === "id" ? (
                                  <div className="">
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
                  {table?.getRowModel().rows?.length ? (
                    table?.getRowModel().rows?.map((row: any) => (
                      <TableRow
                        // key={row.id}
                        // data-state={row.getIsSelected() && "selected"}
                        // style={{ cursor: "pointer" }}
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        style={{ cursor: "pointer" }}
                      >
                        {row.getVisibleCells().map((cell: any) => {
                          return (
                            <TableCell
                              key={cell.id}
                              className={
                                cell.column.id === "id"
                                  ? "pb-0 pl-2 pt-1"
                                  : "whitespace-nowrap p-3 text-xs"
                              }
                              onClick={() => {
                                if (cell?.column?.id != "id") {
                                  router.push(
                                    `/defendants?defendantId=${row?.original?.id}`
                                  )
                                }
                              }}
                            >
                              {cell.column.id === "id" ? (
                                <div>
                                  {!userRoles.includes("VIEWER") && (
                                    <>
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
                                            if (objArray.length == 1) {
                                              setDeleteEnable(false)
                                              setEditEnable(false)
                                              setDeleteIds(objArray)
                                              setEditObj(cell.row.original)
                                            }
                                            if (objArray.length > 1) {
                                              setDeleteEnable(false)
                                              setEditEnable(true)
                                              setDeleteIds(objArray)
                                              setEditObj("")
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
                                            }
                                            if (objArray.length == 1) {
                                              setDeleteEnable(false)
                                              setEditEnable(false)
                                              setDeleteIds(objArray)
                                              let ID = objArray[0]
                                              let findObj = data.find(
                                                (find_ele: any) =>
                                                  find_ele?.id == ID
                                              )
                                              setEditObj(findObj)
                                            }
                                            if (objArray.length > 1) {
                                              setDeleteEnable(false)
                                              setEditEnable(true)
                                              setDeleteIds(objArray)
                                              setEditObj("")
                                            }
                                            handleSelectedRows(objArray)
                                          }
                                          row.toggleSelected(!!value)
                                          // handleChangeChcke(!!value, cell.row.original.id)
                                        }}
                                        aria-label="Select row"
                                      />
                                    </>
                                  )}
                                </div>
                              ) : cell.column.id === "delete" ? (
                                <div className="relative flex px-4">
                                  <Button
                                    variant="ghost"
                                    className="hover:ghost bg-red-600 text-white"
                                    // onClick={() => handleDelete(cell.row.original.id)}
                                  >
                                    Delete
                                  </Button>
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

        <div className="absolute bottom-0 left-0 w-full  rounded-b-lg border-t-2 border-inherit bg-inherit">
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
            <div className="space-x-2 p-0 xl:p-2">
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
