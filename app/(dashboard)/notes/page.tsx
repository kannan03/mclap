"use client"

import * as React from "react"
import { Toggle } from "@/components/ui/toggle"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
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
import { toast } from "@/components/ui/use-toast"
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
import { CustomActionToast } from "@/components/utils/custom-action-toast"
import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useSearchParams } from "next/navigation"
import { getSession } from "next-auth/react";
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useRef } from "react"
import AddEventNotesDialog from "@/components/notes/add-edit-notes-dialog"
import { Label } from "@/components/ui/label"

import { Calendar as CalendarIcon, View } from "lucide-react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { convertToUTCDate } from "@/lib/utils"
import moment from "moment"

export default function Notes() {
  const searchParams = useSearchParams()

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const [userRoles, setUserRoles] = React.useState<string[]>([])

  const [data, setData] = React.useState([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [isOpen1, setIsOpen1] = React.useState(false)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [selectedRows, setSelectedRows] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      conFirst: true,
      conLast: true,
      conCellPhone: true,
      conEmail: true,
    })
  const [rowSelection, setRowSelection] = React.useState({})
  const [isTheme, setIsTheme] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  //Fliter
  const [filtersApplied, setFiltersApplied] = React.useState(false)
  const [filterIsOpen, setFilterIsOpen] = React.useState<any>(false)
  const [filterDefendantName, setFilterDefendantName] = React.useState<any>("")
  const [filterCaseName, setFilterCaseName] = React.useState<any>("")
  const [filterEventType, setFilterEventType] = React.useState<any>("")
  const [filterInitial, setFilterInitial] = React.useState<any>("")


  const [filterInvestigationOpenDate, setFilterInvestigationOpenDate] = React.useState<any>([])
  const [filterInvestigationClosedDate, setFilterInvestigationClosedDate] = React.useState<any>([])
  const [filterCaseOpenDate, setFilterCaseOpenDate] = React.useState<any>([])
  const [filterCaseClosedDate, setFilterCaseClosedDate] = React.useState<any>([])
  const [filterActionDate, setFilterActionDate] = React.useState<any>([])
  const [caseOpenDateIsOpen, setCaseOpenDateIsOpen] = React.useState<any>(false)
  const [caseCloseDateIsOpen, setCaseCloseDateIsOpen] = React.useState<any>(false)
  const [investOpenDateIsOpen, setInvestOpenDateIsOpen] = React.useState<any>(false)
  const [investCloseDateIsOpen, setInvestCloseDateIsOpen] = React.useState<any>(false)
  const [actionDateIsOpen, setActionDateIsOpen] = React.useState<any>(false)

  const [eventTypeIsOpen, setEventTypeIsOpen] = React.useState<any>(false);
  const [eventTypeList, setEventTypeList] = React.useState<any>([]);

  const [editobj, setEditObj] = React.useState<any>(null)
  const [editEnable, setEditEnable] = React.useState(true)
  const [deleteEnable, setDeleteEnable] = React.useState(true)
  const [deleteids, setDeleteIds] = React.useState<any>([])
  const [viewRowData, setViewRowData] = React.useState(null)   //hidden view contact

  const [showColumnIsOpen, setShowColumnIsOpen] = React.useState(false)
  const [showFilters, setShowFilters] = React.useState(false)
  const [filterHeight, setFilterHeight] = React.useState<any>("")

  const [currentPage, setCurrentpage] = React.useState<number>(1)
  const [limitPage, setLimitPage] = React.useState<any>("25")
  const [totalPage, setTotalPage] = React.useState<number>(1)
  const [totalItems, setTotalItems] = React.useState<number>(0)
  const [timer, setTimer] = React.useState(null)

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
      header: "Name",
      accessorKey: "deffullname",
    },
    {
      accessorKey: "caseTitle",
      header: "Case Title",
    },
    {
      accessorKey: "logEventType",
      header: "Event Type",
    },
    {
      accessorKey: "logActionDate",
      header: "Action Date",
      accessorFn: (row: any) => {
        if (row?.logActionDate) {
          return convertToUTCDate(row?.logActionDate)
        } else {
          return ""
        }
      }
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
      accessorKey: "logInitials",
      header: "Initials",
    },
    {
      accessorKey: "logNotes",
      header: "Notes",
    },
    {
      accessorKey: "action",
      header: "",
    },
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
  function handleSelectedRows(selectedRows: any) {
    setSelectedRows(selectedRows)
  }
  function objectToCustomQueryString(obj : any) {
    if( typeof obj === "object"){
      return '&' +  Object.keys(obj)
      .map(key => key + '=' + encodeURIComponent(obj[key]).replace(/%20/g, ' '))
      .join('&');
    }else{
      return "";
    }
  }
  const clearBadge = (badgeName : any)=>{
    let caseOpen = '';
    let caseClose = '';
    let investigationOpen = '';
    let investigationClose = '';
    let actionDate = '';

    if (filterCaseOpenDate && filterCaseOpenDate?.length > 0) {
      caseOpen = filterCaseOpenDate.join(",")
    }
    if (filterCaseClosedDate && filterCaseClosedDate?.length > 0) {
      caseClose = filterCaseClosedDate.join(",")
    }
    if (filterInvestigationOpenDate && filterInvestigationOpenDate?.length > 0) {
      investigationOpen = filterInvestigationOpenDate.join(",")
    }
    if (filterInvestigationClosedDate && filterInvestigationClosedDate?.length > 0) {
      investigationClose = filterInvestigationClosedDate.join(",")
    }
    if (filterActionDate && filterActionDate?.length > 0) {
      actionDate = filterActionDate.join(",")
    }

    let filterAllObject : any = {
      defName : filterDefendantName,
      caseTitle : filterCaseName,
      eventType : filterEventType,
      initial : filterInitial,
      caseOpen : caseOpen,
      caseClose : caseClose,
      investigationOpen : investigationOpen,
      investigationClose : investigationClose,
      actionDate : actionDate,
      investigationClosedNullCheck : investigationClosedNullCheck ? investigationClosedNullCheck : '',
      investigationOpenedNullCheck: investigationOpenedNullCheck ? investigationOpenedNullCheck : '',
      caseOpenedNullCheck : caseOpenedNullCheck ? caseOpenedNullCheck : '',
      caseClosedNullCheck: caseClosedNullCheck ? caseClosedNullCheck : ''
    }
  if( badgeName){
      delete filterAllObject[badgeName]
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
      applyFilter(currentPage,limitPage,filterAllObject)
    }
  }

  const applyFilter = async (updatePage: any, updateLimit: any, applyParams : any) => {
    try {
      setTimeout(() => {
        let divElement: any = showfilterRef.current
        let elemRect = divElement?.getBoundingClientRect()
        if (elemRect) {
          let elemHeight = Math.ceil(Number(elemRect?.height ? elemRect?.height : 0) + 82)
          setFilterHeight(`${elemHeight}px`)
        }
      }, 3000)

      setFilterIsOpen(false)
      setIsLoading(true)
      let caseOpen = '';
      let caseClose = '';
      let investigationOpen = '';
      let investigationClose = '';
      let actionDate = '';

      if (filterCaseOpenDate && filterCaseOpenDate?.length > 0) {
        caseOpen = filterCaseOpenDate.join(",")
      }
      if (filterCaseClosedDate && filterCaseClosedDate?.length > 0) {
        caseClose = filterCaseClosedDate.join(",")
      }
      if (filterInvestigationOpenDate && filterInvestigationOpenDate?.length > 0) {
        investigationOpen = filterInvestigationOpenDate.join(",")
      }
      if (filterInvestigationClosedDate && filterInvestigationClosedDate?.length > 0) {
        investigationClose = filterInvestigationClosedDate.join(",")
      }
      if (filterActionDate && filterActionDate?.length > 0) {
        actionDate = filterActionDate.join(",")
      }

      let queryString = '';
      queryString += `&defName=${filterDefendantName}`;
      queryString += `&caseTitle=${filterCaseName}`;
      queryString += `&eventType=${filterEventType}`;
      queryString += `&initial=${filterInitial}`;
      queryString += `&caseOpen=${caseOpen}`;
      queryString += `&caseClose=${caseClose}`;
      queryString += `&investigationOpen=${investigationOpen}`;
      queryString += `&investigationClose=${investigationClose}`;
      queryString += `&actionDate=${actionDate}`;
      queryString += `&investigationClosedNullCheck=${investigationClosedNullCheck ? investigationClosedNullCheck : ""}`
      queryString += `&investigationOpenedNullCheck=${investigationOpenedNullCheck ? investigationOpenedNullCheck : ""}`
      queryString += `&caseOpenedNullCheck=${caseOpenedNullCheck ? caseOpenedNullCheck : ""}`
      queryString += `&caseClosedNullCheck=${caseClosedNullCheck ? caseClosedNullCheck : ""}`

      let url = `${baseURL}/v1/eventlog?page=${updatePage}&limit=${updateLimit}${queryString}`
      if( applyParams){
        let applyQueryString = objectToCustomQueryString(applyParams);
        url = `${baseURL}/v1/eventlog?page=${updatePage}&limit=${updateLimit}${applyQueryString}`
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
    } catch (error) { }
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
  

  const filterSearch = async (Value: any, updatePage: any, updateLimit: any) => {
    try {
      setIsLoading(true)
      let url = `${baseURL}/v1/eventlog?filter=${Value}&page=${updatePage}&limit=${updateLimit}`
      const response = await axiosInstance.get(url)
      let listData = response?.data?.data?.rows
        ? response?.data?.data?.rows
        : []

      setData(listData)
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
    } catch (error) { }
  }
  const handleSearch = async (event: any) => {
    let Value = event.target.value
    setFilterValue(Value)
    clearTimeout(timer)
    const newTimer = setTimeout(() => {
      if (Value) {
        filterSearch(Value, currentPage, limitPage)
      } else {
        fetchData(1, limitPage)
      }
    }, 500)
    setTimer(newTimer)
  }
  const handleDelete = async (id: any) => {
    try {
      if (!id) {
        return
      }
      await axiosInstance.delete(`${baseURL}/v1/eventlog/${id}`)
      toast({
        variant: "default",
        description: "Notes/Events deleted successfully",
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
      setIsOpen1(false)
    } catch (error: any) {
      console.log("Error deleting item:", error.message)
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
    } catch (err) { }
  }
  const [filterValue, setFilterValue] = React.useState<any>("")
  const fetchData = async (updatePage: any, updateLimit: any) => {

    const eventList = await axiosInstance.get(baseURL + "/v1/codes/codeType/Event Type");
    if (eventList?.data?.data) {
      setEventTypeList([{ "id": 0, 'codeCode': 'Select Option' }, ...eventList?.data?.data])
    }
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
      const response = await axiosInstance.get(
        `${baseURL}/v1/eventlog?page=${updatePage}&limit=${updateLimit}`
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

  const handlePage = async (event: any) => {
    if (event.key === "Enter") {
      if (event.target.value) {
        const queryParams = new URLSearchParams()
        queryParams.set("page", String(event.target.value))
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
        // }
        if (filterValue) {
          filterSearch(filterValue, currentPage, limitPage)
        } else {
          if (filtersApplied) {
            applyFilter(currentPage, limitPage ,'')
          } else {
            fetchData(currentPage, limitPage)
          }
        }
      }, 500)
      setTimer(newTimer)
    }
  }

  const buildQueryString = () => {
    let caseOpen = '';
    let caseClose = '';
    let investigationOpen = '';
    let investigationClose = '';
    let actionDate = '';

    if (filterCaseOpenDate && filterCaseOpenDate?.length > 0) {
      caseOpen = filterCaseOpenDate.join(",")
    }
    if (filterCaseClosedDate && filterCaseClosedDate?.length > 0) {
      caseClose = filterCaseClosedDate.join(",")
    }
    if (filterInvestigationOpenDate && filterInvestigationOpenDate?.length > 0) {
      investigationOpen = filterInvestigationOpenDate.join(",")
    }
    if (filterInvestigationClosedDate && filterInvestigationClosedDate?.length > 0) {
      investigationClose = filterInvestigationClosedDate.join(",")
    }
    if (filterActionDate && filterActionDate?.length > 0) {
      actionDate = filterActionDate.join(",")
    }

    let queryString = '';
    queryString += `&defName=${filterDefendantName}`;
    queryString += `&caseTitle=${filterCaseName}`;
    queryString += `&eventType=${filterEventType}`;
    queryString += `&initial=${filterInitial}`;
    queryString += `&caseOpen=${caseOpen}`;
    queryString += `&caseClose=${caseClose}`;
    queryString += `&investigationOpen=${investigationOpen}`;
    queryString += `&investigationClose=${investigationClose}`;
    queryString += `&actionDate=${actionDate}`;
    return queryString;

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

    let QueryString = buildQueryString()
    if(filterValue){
      QueryString += `&filter=${filterValue}`
    }
    
    let url = `${baseURL}/v1/eventlog/export/EventNotes?export=true${QueryString}`
    const response = await axiosInstance.post(url, visibleColumns, {
      responseType: "blob",
    })
    if (response?.status == 200 && response?.data) {
      const fileURL = window.URL.createObjectURL(response?.data)
      let alink = document.createElement("a")
      alink.href = fileURL
      alink.download = `EventNotes.xlsx`
      alink.click()
      toast({
        variant: "default",
        description: "EventNotes are getting exported",
        style: {
          background: "#03C03C",
        },
      })
    } else {
      toast({
        variant: "default",
        description: "Error while exporting the EventNotes",
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
          applyFilter(updatePage, limitPage,'')
        } else {
          fetchData(updatePage, limitPage)
        }
      }
    } catch (err) { }
  }
  const NextPage = () => {
    try {
      let updatePage = Number(currentPage) + 1
      setCurrentpage(updatePage)
      if (filterValue) {
        filterSearch(filterValue, updatePage, limitPage)
      } else {
        if (filtersApplied) {
          applyFilter(updatePage, limitPage,'')
        } else {
          fetchData(updatePage, limitPage)
        }
      }
    } catch (err) { }
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
        applyFilter(currentPage, limitValue,'')
      } else {
        fetchData(currentPage, limitValue)
      }
    }
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
    const fetchUserRoles = async () => {
      const session = await getSession();
      setUserRoles(session?.user?.roles || []);
    };

    fetchUserRoles();
    InitaialFecthData()
  }, [])
  return (
    <div className="overscroll-y-none px-2 pb-1 pt-2">
      <div className="hidden">
        <AddEventNotesDialog
          ref={contactButtonRef}
          rowdata={viewRowData}
          hidetext="View"
          refreshGrid={() => {
            fetchData(currentPage, limitPage)
            table?.toggleAllPageRowsSelected(
              false
            )
          }} />
      </div>

      <div className="dark-container relative h-[calc(100vh-72px)] rounded-lg border bg-white p-2">
        <div className="flex">
          <h2 className="text-l ml-2 mt-2 font-bold text-xs md:hidden">Notes/Events</h2>
          <h2 className="text-l ml-2 mt-0.5 font-bold hidden md:block">Notes/Events</h2>
          <div className="relative ml-5 h-8">
            <Input
              className="w-28 md:w-56 pl-9 text-xs"
              onChange={handleSearch}
              value={filterValue}
              placeholder="Search Name or Case Title"
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
                    <SheetTitle className="border-b">Filter</SheetTitle>
                    <SheetDescription className="thin-scrollbar mb-2 h-[calc(100vh-124px)] overflow-y-auto overflow-x-hidden p-0">
                      <div className="mt-5 grid grid-cols-1 items-center gap-2">
                        <div>
                          <Label className="text-[0.7rem] font-semibold text-gray-600">
                            Defendant Name
                          </Label>
                          <Input
                            type="text"
                            className="h-8 rounded-lg border py-2 pl-3 text-xs w-[270px] md:w-[320px]"
                            placeholder="Defendant Name"
                            value={filterDefendantName}
                            onChange={(e) => {
                              setFilterDefendantName(e.target.value)
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-1 items-center gap-2">
                        <div>
                          <Label className="text-[0.7rem] font-semibold text-gray-600">
                            Case Name
                          </Label>
                          <Input
                            type="text"
                            className="h-8 rounded-lg border py-2 pl-3 text-xs w-[270px] md:w-[320px]"
                            placeholder="Case Name"
                            value={filterCaseName}
                            onChange={(e) => {
                              setFilterCaseName(e.target.value)
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 items-center">
                        <Label className="text-[0.7rem] font-semibold text-gray-600">Event Type</Label>
                        <div className="">
                          <Popover
                            open={eventTypeIsOpen} onOpenChange={setEventTypeIsOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={eventTypeIsOpen}
                                className="w-[270px] md:w-[320px] h-8 text-xs justify-between">
                                {filterEventType ? filterEventType : "Select Type"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[350px] p-0">
                              <Command className="dark:bg-slate-900 text-xs">
                                <CommandInput placeholder="Select Type" className="h-8 text-xs" />
                                <CommandEmpty>No Found </CommandEmpty>
                                <CommandGroup className="h-[150px] text-xs thin-scrollbar overflow-y-scroll text-xs dark:bg-slate-900">
                                  {eventTypeList.map((framework: any, i: any) => {
                                    return (
                                      <CommandItem
                                        key={i}
                                        value={framework}
                                        className="text-xs whitespace-nowrap"
                                        onSelect={(currentValue) => {
                                          setFilterEventType(framework.codeCode == filterEventType ? "" : framework.codeCode == "Select Option" ? "" : framework.codeCode)
                                          // setValue("logEventType", framework.codeCode);
                                          setEventTypeIsOpen(false)
                                        }}>
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            filterEventType == framework.codeCode ? "opacity-100" : "opacity-0"
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
                      </div>
                      <div className="mt-2 grid grid-cols-2 items-center gap-2">
                        <div className="w-[270px] md:w-[320px]">
                          <div>
                            <Label className="text-[0.7rem] font-semibold text-gray-600">Initials</Label>
                          </div>
                          <div>
                            <Input
                              type="text"
                              placeholder="Initials"
                              className="h-8 rounded-lg border py-2 pl-3 text-xs xl:w-full"
                              value={filterInitial}
                              onChange={(e) => {
                                setFilterInitial(e.target.value)
                              }} />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 items-center gap-2">
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
                                  <div className="flex justify-end w-full">
                                    <CalendarIcon className="mr-3 h-4 w-4" onClick={() => {
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

                      <div className="grid grid-cols-1 items-center gap-2">
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
                                {/* <Button
                                onClick={() => {
                                  setCaseCloseDateIsOpen(true)
                                }}
                                  variant={"outline"}
                                  className={cn(
                                    "h-8 justify-start text-left text-xs font-normal border-none hover:bg-transparent",
                                    !filterCaseClosedDate &&
                                    "text-muted-foreground"
                                  )}
                                > */}
                                <div className="flex justify-end w-full">
                                  <CalendarIcon className="mr-3 h-4 w-4" 
                                   onClick={() => {
                                  setCaseCloseDateIsOpen(true)
                                }} />
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
                      <div className="grid grid-cols-1 items-center gap-2">
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
                                {/* <Button
                                onClick={() => {
                                  setInvestOpenDateIsOpen(true)
                                }}
                                  variant={"outline"}
                                  className={cn(
                                    "h-8 justify-start text-left text-xs font-normal border-none hover:bg-transparent",
                                    !filterInvestigationOpenDate &&
                                    "text-muted-foreground"
                                  )}
                                > */}
                                <div className="flex justify-end w-full">
                                  <CalendarIcon className="mr-3 h-4 w-4" onClick={() => {
                                  setInvestOpenDateIsOpen(true)
                                }}/>
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
                                    setFilterInvestigationOpenDate(dateArray)
                                    setInvestOpenDateIsOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 items-center gap-2">
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
                            {/* <Popover
                              open={investCloseDateIsOpen}
                              onOpenChange={setInvestCloseDateIsOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "h-8 w-[320px] justify-start text-left text-xs font-normal",
                                    !filterInvestigationClosedDate &&
                                    "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {filterInvestigationClosedDate?.length >
                                    0 &&
                                    filterInvestigationClosedDate[0] &&
                                    moment(
                                      filterInvestigationClosedDate[0]
                                    ).isValid()
                                    ? convertToUTCDate(
                                      filterInvestigationClosedDate[0]
                                    )
                                    : "Pick a date"}{" "}
                                  {filterInvestigationClosedDate?.length == 2
                                    ? " to "
                                    : ""}
                                  {filterInvestigationClosedDate?.length >
                                    0 &&
                                    filterInvestigationClosedDate[1] &&
                                    moment(
                                      filterInvestigationClosedDate[1]
                                    ).isValid()
                                    ? convertToUTCDate(
                                      filterInvestigationClosedDate[1]
                                    )
                                    : ""}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="thin-scrollbar max-h-50 m-1 w-[410px] overflow-hidden whitespace-nowrap  p-0 text-xs text-black">
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
                                    setFilterInvestigationClosedDate(
                                      dateArray
                                    )
                                    setInvestCloseDateIsOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover> */}
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
                                {/* <Button
                                onClick={() => {
                                  setInvestCloseDateIsOpen(true)
                                }}
                                  variant={"outline"}
                                  className={cn(
                                    "h-8 justify-start text-left text-xs font-normal border-none hover:bg-transparent",
                                    !filterInvestigationClosedDate &&
                                    "text-muted-foreground"
                                  )}
                                > */}
                                <div className="flex justify-end w-full">
                                  <CalendarIcon className="mr-3 h-4 w-4" onClick={() => {
                                  setInvestCloseDateIsOpen(true)
                                }} />
                                </div>
                                  {/* {filterInvestigationClosedDate?.length > 0 &&
                                    filterInvestigationClosedDate[0] &&
                                    moment(filterInvestigationClosedDate[0]).isValid()
                                    ? convertToUTCDate(filterInvestigationClosedDate[0])
                                    : "Pick a date"}{" "}
                                  {filterInvestigationClosedDate?.length == 2
                                    ? " to "
                                    : ""}
                                  {filterInvestigationClosedDate?.length > 0 &&
                                    filterInvestigationClosedDate[1] &&
                                    moment(filterInvestigationClosedDate[1]).isValid()
                                    ? convertToUTCDate(filterInvestigationClosedDate[1])
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
                            Action Date
                          </Label>
                          <div>
                            <Popover
                              open={actionDateIsOpen}
                              onOpenChange={setActionDateIsOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "h-8 w-[270px] md:w-[320px] justify-between text-left text-xs font-normal",
                                    !filterActionDate &&
                                    "text-muted-foreground"
                                  )}
                                >
                                  <div className="flex">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {filterActionDate?.length >
                                    0 &&
                                    filterActionDate[0] &&
                                    moment(
                                      filterActionDate[0]
                                    ).isValid()
                                    ? convertToUTCDate(
                                      filterActionDate[0]
                                    )
                                    : "Pick a date"}{" "}
                                  {filterActionDate?.length == 2
                                    ? " to "
                                    : ""}
                                  {filterActionDate?.length >
                                    0 &&
                                    filterActionDate[1] &&
                                    moment(
                                      filterActionDate[1]
                                    ).isValid()
                                    ? convertToUTCDate(
                                      filterActionDate[1]
                                    )
                                    : ""}
                                  </div>
                                    {filterActionDate?.length > 0 && (
                                    <div>
                                      <Icons.close className="h-4 w-4"  onClick= {
                                        ()=>{
                                          setFilterActionDate([])
                                        }
                                      }/>
                                    </div>)}
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
                                    setFilterActionDate(dateArray)
                                    setActionDateIsOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </SheetDescription>
                    <div className="relative mt-5 flex items-center justify-between py-1 xl:py-2 border-t">
                      <div className="">
                        {filtersApplied && (
                          <div className="">
                            <Button
                              variant="link"
                              onClick={(e) => {
                                setFilterDefendantName("")
                                setFilterCaseName("")
                                setFilterEventType("")
                                setFilterInitial("")
                                setFilterActionDate([])
                                setFilterCaseOpenDate([])
                                setFilterCaseClosedDate([])
                                setFilterInvestigationOpenDate([])
                                setFilterInvestigationClosedDate([])
                                setFiltersApplied(false)
                                setShowFilters(false)
                                setFilterIsOpen(false)
                                fetchData(currentPage, limitPage)
                                setCaseOpenedNullCheck(false)
                                setCaseClosedNullCheck(false)
                                setInvestigationOpenedNullCheck(false)
                                setCaseInvestigationClosedNullCheck(false)
          
                              }}
                              className="text-black-700 items-center px-2 py-1 text-xs hover:underline">
                              <Icons.close className="mr-1 h-3 w-3" /> Clear
                              Filters
                            </Button>
                          </div>
                        )}
                      </div>
                      <div>
                        <Button
                          type="button"
                          onClick={() => applyFilter(1, limitPage, '')}
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
                    <SheetTitle>Show Columns</SheetTitle>
                    <SheetDescription>
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
                                    className="h-8 text-xs hover:bg-transparent"
                                    defaultPressed={column.getIsVisible()}
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
              <AddEventNotesDialog
                icon={<Icons.add className="mb-0.5 h-3.5 w-5" />}
                text="Add"
                hidetext={"Add"}
                refreshGrid={() => {
                  fetchData(currentPage, limitPage)
                }}
              />
            )}
          </div>
        </div>
        {showFilters && (
          <div
            ref={showfilterRef}
            className="flex flex-nowrap border-t py-2">
            {filterDefendantName && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0">
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Defendant Name
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterDefendantName}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterDefendantName("")
                    // if (
                    //   !filterCaseName &&
                    //   !filterEventType &&
                    //   !filterInitial &&
                    //   (filterInvestigationOpenDate?.length === 0) &&
                    //   (filterInvestigationClosedDate?.length === 0) &&
                    //   (filterActionDate?.length === 0) &&
                    //   (filterCaseOpenDate?.length === 0) &&
                    //   (filterCaseClosedDate?.length === 0)
                    // ) {
                    //   setShowFilters(false)
                    //   setFiltersApplied(false)
                    // }
                    // fetchData(currentPage, limitPage)
                    clearBadge('defName')
                  }}
                />
              </Badge>
            )}
            {filterCaseName && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0">
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Case Name
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterCaseName}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterCaseName("")
                    // if (
                    //   !filterDefendantName &&
                    //   !filterEventType &&
                    //   !filterInitial &&
                    //   (filterInvestigationOpenDate?.length === 0) &&
                    //   (filterInvestigationClosedDate?.length === 0) &&
                    //   (filterActionDate?.length === 0) &&
                    //   (filterCaseOpenDate?.length === 0) &&
                    //   (filterCaseClosedDate?.length === 0)
                    // ) {
                    //   setShowFilters(false)
                    //   setFiltersApplied(false)
                    // }
                    // fetchData(currentPage, limitPage)
                    clearBadge('caseTitle')
                  }}
                />
              </Badge>
            )}
            {filterEventType && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Event Type
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterEventType}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterEventType("")
                    // if (
                    //   !filterDefendantName &&
                    //   !filterCaseName &&
                    //   !filterInitial &&
                    //   (filterInvestigationOpenDate?.length === 0) &&
                    //   (filterInvestigationClosedDate?.length === 0) &&
                    //   (filterActionDate?.length === 0) &&
                    //   (filterCaseOpenDate?.length === 0) &&
                    //   (filterCaseClosedDate?.length === 0)
                    // ) {
                    //   setShowFilters(false)
                    //   setFiltersApplied(false)
                    // }
                    // fetchData(currentPage, limitPage)
                    clearBadge('eventType')
                  }}
                />
              </Badge>
            )}
            {filterInitial && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0">
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Initial
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterInitial.replace(/(^\w{1})|(\s+\w{1})/g, (letter: any) =>
                    letter.toUpperCase()
                  )}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterInitial("")
                    // if (
                    //   !filterDefendantName &&
                    //   !filterCaseName &&
                    //   !filterEventType &&
                    //   (filterInvestigationOpenDate?.length === 0) &&
                    //   (filterInvestigationClosedDate?.length === 0) &&
                    //   (filterActionDate?.length === 0) &&
                    //   (filterCaseOpenDate?.length === 0) &&
                    //   (filterCaseClosedDate?.length === 0)
                    // ) {
                    //   setShowFilters(false)
                    //   setFiltersApplied(false)
                    // }
                    // fetchData(currentPage, limitPage)
                    clearBadge('initial')

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
                    Investigation Open
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
                      // if (
                      //   !filterDefendantName &&
                      //   !filterCaseName &&
                      //   !filterEventType &&
                      //   !filterInitial &&
                      //   (filterInvestigationClosedDate?.length === 0) &&
                      //   (filterActionDate?.length === 0) &&
                      //   (filterCaseOpenDate?.length === 0) &&
                      //   (filterCaseClosedDate?.length === 0)
                      // ) {
                      //   setShowFilters(false)
                      //   setFiltersApplied(false)
                      // }
                      // fetchData(currentPage, limitPage)
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
                    Investigation Close
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
                      // if (
                      //   !filterDefendantName &&
                      //   !filterCaseName &&
                      //   !filterEventType &&
                      //   !filterInitial &&
                      //   (filterInvestigationOpenDate?.length === 0) &&
                      //   (filterActionDate?.length === 0) &&
                      //   (filterCaseOpenDate?.length === 0) &&
                      //   (filterCaseClosedDate?.length === 0)
                      // ) {
                      //   setShowFilters(false)
                      //   setFiltersApplied(false)
                      // }
                      // fetchData(currentPage, limitPage)
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
                  Case Open
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
                  Case Close
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
                    setFilterInvestigationClosedDate([])
                    clearBadge('caseClose')
                  }}
                />
              </Badge>
            )}

            {filterActionDate && filterActionDate?.length > 0 && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Action Date
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterActionDate?.length > 0 &&
                    filterActionDate[0] &&
                    moment(filterActionDate[0]).isValid()
                    ? convertToUTCDate(filterActionDate[0])
                    : ""}{" "}
                  {filterActionDate?.length == 2 ? " to " : ""}
                  {filterActionDate?.length > 0 &&
                    filterActionDate[1] &&
                    moment(filterActionDate[1]).isValid()
                    ? convertToUTCDate(filterActionDate[1])
                    : ""}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterActionDate([])
                    clearBadge('actionDate')
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
                <span className="pl-2 text-[0.65rem] font-normal">
                  {caseClosedNullCheck}
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
                  investigation open : null
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {investigationOpenedNullCheck}
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
                investigation close : null
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {investigationClosedNullCheck}
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
              {(filterDefendantName ||
                filterCaseName ||
                filterEventType ||
                filterInitial ||
                (filterActionDate?.length > 0) || (filterCaseOpenDate?.length > 0) ||
                (filterCaseClosedDate?.length > 0) || (filterInvestigationOpenDate?.length > 0) ||
                (filterInvestigationClosedDate?.length > 0) ||
                caseOpenedNullCheck ||
                caseClosedNullCheck ||
                investigationOpenedNullCheck ||
                investigationClosedNullCheck 
              ) && (
                  <Button
                    variant="link"
                    onClick={(e) => {
                      setFilterDefendantName("")
                      setFilterCaseName("")
                      setFilterEventType("")
                      setFilterInitial("")
                      setFilterActionDate([])
                      setFilterCaseOpenDate([])
                      setFilterCaseClosedDate([])
                      setFilterInvestigationOpenDate([])
                      setFilterInvestigationClosedDate([])
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
            <div style={{
              height: showFilters
                ? "calc(100% - " + filterHeight + ")"
                : "calc(100% - 82px)",
            }}
              className="thin-scrollbar fixed-child-table relative overflow-y-auto border-t">
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
                                : "text-black-500 sticky top-0 h-auto p-2 text-xs font-bold whitespace-nowrap"
                            }
                          >


                            {header.isPlaceholder ? null : (
                              <div className="flex items-center">
                                {header.column.id === "id" ? (
                                  <div className="" onClick={(e) => e.stopPropagation()}>
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
                        style={{ cursor: "pointer" }}
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
                                if (contactButtonRef.current) {
                                  setViewRowData(cell.row.original);
                                  setTimeout(() => {
                                    contactButtonRef.current?.click();
                                  }, 200);
                                }
                              }
                              }
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
                                            if (cell.row.original.id != map_id) {
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
                                            let findObj = data.find(
                                              (find_ele: any) => find_ele?.id == ID
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

                                      }}
                                      aria-label="Select row"
                                    />
                                  )}
                                </div>
                              ) : cell.column.id === "action" ? (
                                <div className="" onClick={(e) => e.stopPropagation()}>
                                  {!userRoles.includes("VIEWER") && (
                                    <Popover>
                                      <PopoverTrigger className="h-8 w-8 px-2.5" onClick={(e) => e.stopPropagation()}>
                                        <Icons.verticalDots className="fixed cursor-pointer " />
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="ml-2 flex h-8 w-auto items-center rounded-lg p-0"
                                        align="center"
                                        side="left">
                                        <div className="flex flex-nowrap">
                                          <AddEventNotesDialog
                                            icon={<Icons.pencil className=" h-3.5 w-5" />}
                                            hidetext="Edit"
                                            rowdata={cell.row.original}
                                            refreshGrid={() => {
                                              fetchData(currentPage, limitPage)
                                              table?.toggleAllPageRowsSelected(
                                                false
                                              )
                                            }} />
                                          <AddEventNotesDialog
                                            icon={<Icons.eye className=" h-3.5 w-5" />}
                                            hidetext="View"
                                            rowdata={cell.row.original}
                                            refreshGrid={() => {
                                              fetchData(currentPage, limitPage)
                                              table?.toggleAllPageRowsSelected(
                                                false
                                              )
                                            }} />
                                          <Dialog
                                            open={isOpen1}
                                            onOpenChange={setIsOpen1}>
                                            <DialogTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                className="flex h-8 items-center rounded-l-none rounded-r-lg border-l bg-transparent px-3.5 py-1.5 text-xs">
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
                                                Are you sure you want to delete ?
                                              </DialogDescription>
                                              <DialogFooter>
                                                <DialogClose className="text-black-600 pr-6 text-xs">
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
                      <AddEventNotesDialog
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
