"use client"

import * as React from "react"
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
import { ArrowUpDown } from "lucide-react"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
import AddDefendantContact from "@/components/contact/add-edit-defendantContact"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { CustomActionToast } from "@/components/utils/custom-action-toast"
import { AddressSelect } from "@/components/utils/states-cities-combobox"
import { Calendar as CalendarIcon } from "lucide-react"
import Calendar from 'react-calendar';
import moment from "moment"
import { convertToUTCDate } from "@/lib/utils"
import { format } from "date-fns"
import { getSession } from "next-auth/react";
import { useRef } from "react"


export default function DefendantContactPage(props: any) {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const [viewRowData, setViewRowData] = React.useState(null)
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
  const [isOpen1, setIsOpen1] = React.useState(false)
  const [isTheme, setIsTheme] = React.useState(false)
  const [deleteids, setDeleteIds] = React.useState<any>([])
  const [data, setData] = React.useState([])
  const [filterEndDate, setFilterEndDate] = React.useState<any>([])
  const [effectiveDate, setEffectiveDate] = React.useState<any>([])
  const [effectiveDateIsOpen, setEffectiveDateIsOpen] = React.useState<any>(false)
  const [filterEndDateIsOpen, setFilterEndDateIsOpen] = React.useState<any>(false)
  const searchParams = useSearchParams()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [selectedRows, setSelectedRows] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      conFirst: true,
      conLast: true,
      conCellPhone: true,
      conEmail: true,
    })
  const [rowSelection, setRowSelection] = React.useState({})
  const [columns, setColumns] = React.useState(
    [
      {
        accessorKey: "id",
        enableSorting: false,
        enableHiding: false,

      },
      {
        accessorKey: "conType",
        header: "Type",
        show: true,
      },
      {
        // accessorFn: (row: any) => row?.conLast + ", " + row?.conFirst + " " + row?.conMiddle,
        accessorFn: (row: any) => {
          return `${row?.conLast ? row?.conLast : ''}${row?.conLast ? ', ' : ''}${row?.conFirst ? row?.conFirst : ''}${row?.conFirst ? ' ' : ''}${row?.conMiddle ? row?.conMiddle : ''}`
        },
        header: "Name",
      },
      {
        accessorKey: "conOrg",
        header: "Organization/Firm",
      },
      {
        accessorKey: "phoneNumbers",
        header: "Phone Number",
      },
      {
        accessorKey: "dcStartDate",
        header: "Effective",
        accessorFn: (row: any) => {
          if (row.dcStartDate) {
            return convertToUTCDate(row?.dcStartDate)
          } else {
            return ''
          }
        }
      }, {
        accessorKey: "dcEndDate",
        header: "End Date",
        accessorFn: (row) => {
          if (row.dcEndDate) {
            return convertToUTCDate(row?.dcEndDate)
          } else {
            return ''
          }
        }
      },
      {
        accessorKey: "action",
        header: '',
        show: true,
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
  const showtableRef = React.useRef(null)

  const PreviousPage = () => {
    try {
      let updatePage = Number(currentPage) - 1
      setCurrentpage(updatePage)
      // fetchData(updatePage, limitPage)
      if (filterValue) {
        filterSearch(filterValue, updatePage, limitPage)
      } else {
        if (filtersApplied) {
          applyFilter(updatePage, limitPage)
        } else {
          fetchData(updatePage, limitPage)
        }
      }
      const queryParams = new URLSearchParams()
      queryParams.set("defendantId", String(searchParams?.get("defendantId")))
      queryParams.set("active", "contacts")
      queryParams.set("page", String(updatePage))
      queryParams.set("limit", String(limitPage))
      if (window.location.pathname) {
        const newUrl = window.location.pathname + "?" + queryParams.toString()
        window.history.pushState({}, "", newUrl)
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
          applyFilter(updatePage, limitPage)
        } else {
          fetchData(updatePage, limitPage)
        }
      }
      const queryParams = new URLSearchParams()
      queryParams.set("defendantId", String(searchParams?.get("defendantId")))
      queryParams.set("active", "contacts")
      queryParams.set("page", String(updatePage))
      queryParams.set("limit", String(limitPage))
      if (window.location.pathname) {
        const newUrl = window.location.pathname + "?" + queryParams.toString()
        window.history.pushState({}, "", newUrl)
      }
    
      // fetchData(updatePage, limitPage)
    } catch (err) { }
  }
  const LimitPerPage = (limitValue: any) => {
    setLimitPage(limitValue)
    setCurrentpage(currentPage)

    if (filterValue) {
      filterSearch(filterValue, currentPage, limitValue)
    } else {
      if (filtersApplied) {
        applyFilter(currentPage, limitValue)
      } else {
        fetchData(currentPage, limitValue)
      }
    }
    const queryParams = new URLSearchParams()
    queryParams.set("defendantId", String(searchParams?.get("defendantId")))
    queryParams.set("active", "contacts")
    queryParams.set("page", "1")
    queryParams.set("limit", String(limitValue))
    if (window.location.pathname) {
      const newUrl = window.location.pathname + "?" + queryParams.toString()
      window.history.pushState({}, "", newUrl)
    }
    // fetchData(1, limitValue)
  }

  const filterSearch = async (Value: any,updatePage: any, limitPage: any) => {
    try {
      setIsLoading(true)
      let url = `${baseURL}/v1/defendants/contact/${props?.defendantId}?filter=${Value}&page=${updatePage}&limit=${limitPage}`;
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
      setCurrentpage(1)
      setTotalPage(
        response?.data?.data?.totalPages ? response?.data?.data?.totalPages : 1
      )
      setTotalItems(
        response?.data?.data?.totalItems ? response?.data?.data?.totalItems : 0
      )
      setIsLoading(false)
    } catch (error) { }
  }
  const [filterValue, setFilterValue] = React.useState<any>("")
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
      const response = await axiosInstance.get(`${baseURL}/v1/defendants/contact/${props?.defendantId}?page=${updatePage}&limit=${updateLimit}`);

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
        fetchData(1, limitPage)
      }
    }, 500)
    setTimer(newTimer)
  }
  const handlePage = async (event: any) => {
    if (event.key === "Enter") {
      if (event.target.value) {
        const queryParams = new URLSearchParams()
        queryParams.set("defendantId", String(searchParams?.get("defendantId")))
        queryParams.set("active", "contacts")
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
          filterSearch(filterValue, Value, limitPage)
        } else {
          if (filtersApplied) {
            applyFilter(Value, limitPage)
          } else {
            fetchData(Value, limitPage)
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
    } catch (err) { }
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
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.has("defendantId")) {
        if (!queryParams.has("active")) {
          queryParams.set("defendantId", String(queryParams.get("defendantId")))
          queryParams.set("active", "contacts");
          const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
          window.history.pushState({}, "", newUrl);
        }
      }
      fetchData(page, limit)
    }
    const fetchUserRoles = async () => {
      const session = await getSession();
      setUserRoles(session?.user?.roles || []);
    };

    fetchUserRoles();
    InitaialFecthData()
    fetchCodeType()
  }, [])

  const handleDelete = async (id: any) => {
    try {
      if (!id) {
        return
      }
      await axiosInstance.delete(`${baseURL}/v1/defendants/contact/${props?.defendantId}/${id}`)
      toast({
        variant: "default",
        description: "DefContacts Deleted Successfully",
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
  const [filtersApplied, setFiltersApplied] = React.useState(false)
  const [filterIsOpen, setFilterIsOpen] = React.useState<any>(false)
  const [filterFirstName, setFilterFirstName] = React.useState<any>("")
  const [filterLastName, setFilterLastName] = React.useState<any>("")
  const [filterOrg, setFilterOrg] = React.useState<any>("")
  const [filterCountry, setFilterCountry] = React.useState<any>("")
  const [filterState, setFilterState] = React.useState<any>("")
  const [filterCity, setFilterCity] = React.useState<any>("")
  const [showColumnIsOpen, setShowColumnIsOpen] = React.useState(false)
  const [filterSex, setFilterSex] = React.useState<any>("")
  const [conactTypeList, setContactTypeList] = React.useState<any>([])
  const [filterConType, setFilterConType] = React.useState<any>("")

  const fetchCodeType = async () => {
    try {
      const resConType = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/Contact Type`
      )
      const res = resConType?.data?.data
      setContactTypeList(res)
    } catch (error) { }
  }
  const setStateValue = (value: any) => {
    setFilterState(value)
  }
  const setCityValue = (value: any) => {
    setFilterCity(value)
  }

  const [filterHeight, setFilterHeight] = React.useState<any>("")
  const applyFilter = async (updatePage:any,updateLimit:any) => {
    try {
      setTimeout(() => {
        let divElement: any = showfilterRef.current
        let elemRect = divElement?.getBoundingClientRect()
        if (elemRect) {
          let elemHeight = Math.ceil(Number(elemRect?.height ? elemRect?.height : 0) + 82)
          setFilterHeight(`${elemHeight}px`)
        }

      }, 3000)


      let effective_date = ''
      let end_date = ''

      if (effectiveDate && effectiveDate?.length > 0) {
        effective_date = effectiveDate.join(",");
      }

      if (filterEndDate && filterEndDate?.length > 0) {
        end_date = filterEndDate.join(",");
      }

      setFilterIsOpen(false)
      setIsLoading(true)
      let url = `${baseURL}/v1/defendants/contact/${props?.defendantId}?firstName=${filterFirstName}&lastName=${filterLastName}&org=${filterOrg}&type=${filterConType}&openDate=${effective_date}&endDate=${end_date}&page=${updatePage}&limit=${updateLimit}`;
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

  function handleSelectedRows(selectedRows: any) {
    setSelectedRows(selectedRows)
  }

  function DeleteButton() {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="ml-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    disabled={deleteEnable}
                    variant="outline"
                    className="flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                  >
                    <Icons.trash className="mb-1 h-3.5 w-5" /> Delete
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-zinc-950 dark:bg-zinc-50"
              >
                <p className="text-xs text-slate-50 dark:text-slate-950">
                  Delete contact
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="max-w-[400px] dark:bg-slate-900">
            <DialogHeader className="border-b border-inherit ">
              <DialogTitle className="mb-2">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <DialogDescription className="py-2 text-sm">
              Are you sure you want to delete {deleteids.length}{" "}
              {deleteids.length === 1 ? "item" : "items"}?
            </DialogDescription>
            <DialogFooter>
              <DialogClose className="text-black-600 pr-6 text-xs">Cancel</DialogClose>
              <Button
                type="submit"
                onClick={() => handleDelete(deleteids)}
                variant="outline"
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

  return (
    <div className="overscroll-y-none px-1 pb-1">
      <div className="relative dark-container min-w-full bg-white h-[calc(100vh-127px)]">
        <div className="flex">

          <div className="relative ml-1 h-8">
            <Input
              className="pl-9 text-xs w-44"
              onChange={handleSearch}
              value={filterValue}
              placeholder="Search"
            />
            <Icons.search className="absolute ml-2.5 top-0  h-8 w-4 text-muted-foreground" />
          </div>

          <div className="hidden">
            <AddDefendantContact
              ref={contactButtonRef}
              rowdata={viewRowData}
              hidetext="View"
              refreshGrid={() => {
                fetchData(currentPage, limitPage)
                table?.toggleAllPageRowsSelected(
                  false
                )
              }}
            />
          </div>

          <div className="relative mb-2 ml-auto flex">
            <div>
              <Sheet
                open={filterIsOpen}
                onOpenChange={(e) => {
                  setFilterIsOpen(e)
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                        >
                          <Icons.filter className="h-3.5 w-5" />

                        </Button>
                      </SheetTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-zinc-950 dark:bg-zinc-50"
                    >
                      <p className="text-xs text-slate-50 dark:text-slate-950">
                        Filter contact
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <SheetContent>
                  <SheetHeader className="text-start">
                    <SheetTitle className="border-b">Filter</SheetTitle>
                    <SheetDescription className="overflow-y-auto overflow-x-hidden h-[380px] thin-scrollbar">
                      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 items-center gap-2">
                        <div>
                          <Label className="text-[0.7rem] font-semibold text-gray-600">
                            Last Name
                          </Label>
                          <Input
                            type="text"
                            className="mt-1 h-8 rounded-lg border py-2 pl-3 text-xs xl:w-full"
                            placeholder="Last Name"
                            value={filterLastName}
                            onChange={(e) => {
                              setFilterLastName(e.target.value)
                              // if (!e.target.value && !firstName && !email && !phoneNumber && !active) {
                              //   handleFilter(false, currentPage, limitPage);
                              // }
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-[0.7rem] font-semibold text-gray-600">
                            First Name
                          </Label>
                          <Input
                            type="text"
                            className="mt-1 h-8 rounded-lg border py-2 pl-3 text-xs xl:w-full"
                            placeholder="First Name"
                            value={filterFirstName}
                            onChange={(e) => {
                              setFilterFirstName(e.target.value)
                              // if (!e.target.value && !lastName && !email && !phoneNumber && !active) {
                              //   handleFilter(false, currentPage, limitPage);
                              // }
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-1 items-center">
                        <Label
                          htmlFor="Organization/Firm"
                          className="text-[0.7rem] font-semibold text-gray-600">
                          Organization/Firm
                        </Label>
                        <Input
                          type="text"
                          id="Organization/Firm"
                          placeholder="Organization/Firm"
                          className="h-8 rounded-lg border py-2 pl-3 text-xs xl:w-full"
                          value={filterOrg}
                          onChange={(e) => {
                            setFilterOrg(e.target.value)
                            // if (!e.target.value && !firstName && !lastName && !phoneNumber && !active) {
                            //    handleFilter(false, currentPage, limitPage);
                            // }
                          }}
                        />
                      </div>
                      <div className="mt-4 grid grid-cols-1 items-center gap-2">
                        <div>
                          <div>
                            <Label className="text-[0.7rem] font-semibold text-gray-600">Type</Label>
                          </div>
                          <div>
                            <Select
                              value={filterConType}
                              onValueChange={(value: any) => {
                                setFilterConType(value)
                              }}
                            >
                              <SelectTrigger className="h-8 w-full text-xs">
                                <SelectValue placeholder="Select Type">
                                  {filterConType ? filterConType : "Select Type"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="h-52 w-full overflow-y-auto text-xs thin-scrollbar">
                                <SelectGroup>
                                  {conactTypeList?.map(
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
                      <div className="mt-5 grid grid-cols-1 items-center gap-2">
                        <div>
                          <Label className="text-[0.7rem] font-semibold text-gray-600">Effective Date</Label>
                          <div>
                            <Popover open={effectiveDateIsOpen} onOpenChange={setEffectiveDateIsOpen}>
                              <PopoverTrigger asChild >
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "h-8 w-[300px] md:w-[335px] justify-between text-left text-xs font-normal",
                                    !effectiveDate && "text-muted-foreground"
                                  )}>
                                    <div className="flex">                                      
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {effectiveDate?.length > 0 && effectiveDate[0] && moment(effectiveDate[0]).isValid() ? convertToUTCDate(effectiveDate[0]) : 'Pick a date'} {effectiveDate?.length == 2 ? ' to ' : ''}
                                  {effectiveDate?.length > 0 && effectiveDate[1] && moment(effectiveDate[1]).isValid() ? convertToUTCDate(effectiveDate[1]) : ''}
                                    </div>

                                  {effectiveDate?.length > 0 && (
                                    <div>
                                      <Icons.close className="h-4 w-4"  onClick= {
                                        ()=>{
                                          setEffectiveDate([])
                                        }
                                      }/>
                                    </div>)}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="text-xs text-black thin-scrollbar m-1 w-[410px] whitespace-nowrap max-h-50 overflow-hidden p-0">
                                <Calendar
                                  defaultView="century"
                                  selectRange={true}
                                  showDoubleView={true}
                                  onChange={(dateFields: any) => {
                                    let startDate = moment(dateFields[0]).format("YYYY-MM-DD");
                                    let endDate = moment(dateFields[1]).format("YYYY-MM-DD");
                                    let dateArray = [startDate, endDate];
                                    setEffectiveDate(dateArray);
                                    setEffectiveDateIsOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-1 items-center gap-2">
                        <div>
                          <Label className="text-[0.7rem] font-semibold text-gray-600">End Date</Label>
                          <div>
                            <Popover open={filterEndDateIsOpen} onOpenChange={setFilterEndDateIsOpen}>
                              <PopoverTrigger asChild >
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "h-8 w-[300px] md:w-[335px] justify-between text-left text-xs font-normal",
                                    !filterEndDate && "text-muted-foreground"
                                  )}>
                                    <div className="flex">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {filterEndDate?.length > 0 && filterEndDate[0] && moment(filterEndDate[0]).isValid() ? convertToUTCDate(filterEndDate[0]) : 'Pick a date'} {filterEndDate?.length == 2 ? ' to ' : ''}
                                  {filterEndDate?.length > 0 && filterEndDate[1] && moment(filterEndDate[1]).isValid() ? convertToUTCDate(filterEndDate[1]) : ''}
                                    </div>
                                    {filterEndDate?.length > 0 && (
                                    <div>
                                      <Icons.close className="h-4 w-4"  onClick= {
                                        ()=>{
                                          setFilterEndDate([])
                                        }
                                      }/>
                                    </div>)}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="text-xs text-black thin-scrollbar m-1 w-[410px] whitespace-nowrap max-h-50 overflow-hidden p-0">
                                <Calendar
                                  defaultView="century"
                                  selectRange={true}
                                  showDoubleView={true}
                                  onChange={(dateFields: any) => {
                                    let startDate = moment(dateFields[0]).format("YYYY-MM-DD");
                                    let endDate = moment(dateFields[1]).format("YYYY-MM-DD");
                                    let dateArray = [startDate, endDate];
                                    setFilterEndDate(dateArray);
                                    setFilterEndDateIsOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                      </div>
                    </SheetDescription>
                    <div className="relative mt-5 flex items-center justify-between py-1 xl:py-2">
                      <div className="">
                        {filtersApplied && (
                          <div className="">
                            <Button
                              variant="link"
                              onClick={(e) => {
                                setFilterFirstName("")
                                setFilterLastName("")
                                setFilterOrg("")
                                setFilterConType("")
                                setEffectiveDate([]);
                                setFilterEndDate([])
                                setFiltersApplied(false)
                                setShowFilters(false)
                                setFilterIsOpen(false)
                                fetchData(currentPage, limitPage)
                              }}
                              className="text-black-700 items-center px-2 py-1 text-xs hover:underline"
                            >
                              <Icons.close className="mr-1 h-3 w-3" /> Clear
                              Filters
                            </Button>
                          </div>
                        )}
                      </div>
                      <div>
                        <Button
                          type="button"
                          onClick={()=>applyFilter(1,limitPage)}
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex h-8 items-center rounded-lg bg-transparent px-3.5 py- text-xs xl:py-3"
                        >
                          {/* <Icons.filter className="h-3.5 w-5" /> */}
                          <Icons.columnVisible className="h-3.5 w-5" />
                        </Button>
                      </SheetTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-zinc-950 dark:bg-zinc-50"
                    >
                      <p className="text-xs text-slate-50 dark:text-slate-950">
                        Show columns
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <SheetContent>
                  <SheetHeader className="text-start">
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
                                    className="hover:bg-transparent h-8 text-xs"
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
              <AddDefendantContact
                defendantId={searchParams?.get("defendantId")}
                icon={<Icons.add className="mb-0.5 h-3.5 w-5" />}
                hidetext="Add"
                refreshAssignConsulate = {props?.refreshAssignConsulate}
                refreshGrid={() => {
                  fetchData(currentPage, limitPage)
                  table?.toggleAllPageRowsSelected(false)
                }}
              />
            )}
          </div>

        </div>
        {showFilters && (
          <div
            ref={showfilterRef}
            id="ggg"
            className="flex flex-nowrap py-2 border-t"
          >
            {filterFirstName && (
              <Badge
                variant="outline"
                className="pl-3 pr-0 mr-2 h-6 rounded-md"
              >
                <span className="pr-2 border-r text-[0.65rem] font-normal">
                  First Name
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterFirstName}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterFirstName("")
                    if (
                      !filterLastName &&
                      !filterOrg &&
                      !filterSex &&
                      !filterConType &&
                      !filterCountry &&
                      !filterCity &&
                      !filterState
                    ) {
                      setShowFilters(false)
                      setFiltersApplied(false)
                    }
                    fetchData(currentPage, limitPage)
                  }}
                />
              </Badge>
            )}
            {filterLastName && (
              <Badge
                variant="outline"
                className="pl-3 pr-0 mr-2 h-6 rounded-md"
              >
                <span className="pr-2 border-r text-[0.65rem] font-normal">
                  Last Name
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterLastName}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterLastName("")
                    if (
                      !filterFirstName &&
                      !filterOrg &&
                      !filterSex &&
                      !filterConType &&
                      !filterCountry &&
                      !filterCity &&
                      !filterState
                    ) {
                      setShowFilters(false)
                      setFiltersApplied(false)
                    }
                    fetchData(currentPage, limitPage)
                  }}
                />
              </Badge>
            )}
            {filterOrg && (
              <Badge
                variant="outline"
                className="pl-3 pr-0 mr-2 h-6 rounded-md"
              >
                <span className="pr-2 border-r text-[0.65rem] font-normal">
                  Org
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterOrg}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterOrg("")
                    if (
                      !filterFirstName &&
                      !filterLastName &&
                      !filterSex &&
                      !filterConType &&
                      !filterCountry &&
                      !filterCity &&
                      !filterState
                    ) {
                      setShowFilters(false)
                      setFiltersApplied(false)
                    }
                    fetchData(currentPage, limitPage)
                  }}
                />
              </Badge>
            )}
            {filterConType && (
              <Badge
                variant="outline"
                className="pl-3 pr-0 mr-2 h-6 rounded-md"
              >
                <span className="pr-2 border-r text-[0.65rem] font-normal">
                  Type
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterConType}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterConType("")
                    if (
                      !filterFirstName &&
                      !filterLastName &&
                      !filterOrg &&
                      !filterSex &&
                      !filterCountry &&
                      !filterCity &&
                      !filterState
                    ) {
                      setShowFilters(false)
                      setFiltersApplied(false)
                    }
                    fetchData(currentPage, limitPage)
                  }}
                />
              </Badge>
            )}

            {effectiveDate && effectiveDate?.length > 0 && (
              <Badge
                variant="outline"
                className="pl-3 pr-0 mr-2 h-6 rounded-md"
              >
                <span className="pr-2 border-r text-[0.65rem] font-normal">
                  Effective Date
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {effectiveDate?.length > 0 && effectiveDate[0] && moment(effectiveDate[0]).isValid() ? convertToUTCDate(effectiveDate[0]) : 'Pick a date'} {effectiveDate?.length == 2 ? ' to ' : ''}
                  {effectiveDate?.length > 0 && effectiveDate[1] && moment(effectiveDate[1]).isValid() ? convertToUTCDate(effectiveDate[1]) : ''}

                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterConType("")
                    if (
                      !filterFirstName &&
                      !filterLastName &&
                      !filterOrg &&
                      !(effectiveDate?.length > 0)
                    ) {
                      setShowFilters(false)
                      setFiltersApplied(false)
                    }
                    fetchData(currentPage, limitPage)
                  }}
                />
              </Badge>
            )}

            {filterEndDate && filterEndDate?.length > 0 && (
              <Badge
                variant="outline"
                className="pl-3 pr-0 mr-2 h-6 rounded-md"
              >
                <span className="pr-2 border-r text-[0.65rem] font-normal">
                  End Date
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterEndDate?.length > 0 && filterEndDate[0] && moment(filterEndDate[0]).isValid() ? convertToUTCDate(filterEndDate[0]) : 'Pick a date'} {filterEndDate?.length == 2 ? ' to ' : ''}
                  {filterEndDate?.length > 0 && filterEndDate[1] && moment(filterEndDate[1]).isValid() ? convertToUTCDate(filterEndDate[1]) : ''}

                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterConType("")
                    if (
                      !filterFirstName &&
                      !filterLastName &&
                      !filterOrg &&
                      !(filterEndDate?.length > 0)
                    ) {
                      setShowFilters(false)
                      setFiltersApplied(false)
                    }
                    fetchData(currentPage, limitPage)
                  }}
                />
              </Badge>
            )}


            <div className="">
              {(filterFirstName ||
                filterLastName ||
                filterOrg ||
                filterConType ||
                (effectiveDate?.length > 0) || (filterEndDate?.length > 0)
              ) && (
                  <Button
                    variant="link"
                    onClick={(e) => {
                      setFilterFirstName("")
                      setFilterLastName("")
                      setFilterOrg("")
                      setFilterConType("")
                      setEffectiveDate([])
                      setFilterEndDate([])
                      setFilterIsOpen(false)
                      setFiltersApplied(false)
                      setShowFilters(false)
                      fetchData(currentPage, limitPage)
                    }}
                    className="text-black-700 items-center h-6 text-[0.65rem] hover:underline font-normal pl-1"
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
                  : "calc(100vh - 13.75rem)",
              }}
              className="relative min-w-full w-[250px] thin-scrollbar overflow-y-auto border-t fixed-child-table"
            >
              {data.length > 0 ? (
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
                                  ? "pl-2 pt-1 pb-0"
                                  : "sticky top-0 text-xs h-auto font-bold whitespace-nowrap text-black-500 p-2"
                              }>

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
                                    ? "pl-2 pt-1 pb-0"
                                    : cell.column.id === "action"
                                      ? "text-xs p-0"
                                      : "text-xs p-2.5 whitespace-nowrap"
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
                                          // handleChangeChcke(!!value, cell.row.original.id)
                                        }}
                                        aria-label="Select row"
                                      />
                                    )}
                                  </div>
                                ) : cell.column.id === "action" ? (
                                  <div className="" onClick={(e) => e.stopPropagation()}>
                                    {!userRoles.includes("VIEWER") && (
                                      <Popover>
                                        <PopoverTrigger className="px-2.5 h-8 w-8">
                                          <Icons.verticalDots className="cursor-pointer fixed " />
                                        </PopoverTrigger>
                                        <PopoverContent
                                          className="w-auto ml-2 h-8 p-0 flex items-center rounded-lg"
                                          align="center"
                                          side="left"
                                        >
                                          <div className="flex flex-nowrap">
                                            {!userRoles.includes("VIEWER") && (
                                              <AddDefendantContact
                                                defendantId={searchParams?.get("defendantId")}
                                                icon={
                                                  <Icons.pencil className=" h-3.5 w-5" />
                                                }
                                                hidetext="Edit"
                                                rowdata={cell.row.original}
                                                refreshAssignConsulate = {props?.refreshAssignConsulate}
                                                refreshGrid={() => {
                                                  fetchData(currentPage, limitPage)
                                                  table?.toggleAllPageRowsSelected(
                                                    false
                                                  )
                                                }}
                                              />
                                            )}
                                            <AddDefendantContact
                                              defendantId={searchParams?.get("defendantId")}
                                              icon={
                                                <Icons.eye className=" h-3.5 w-5" />
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
                                            {!userRoles.includes("VIEWER") && (
                                              <Dialog
                                                open={isOpen1}
                                                onOpenChange={setIsOpen1}
                                              >
                                                <DialogTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    className="flex h-8 items-center rounded-r-lg border-l rounded-l-none bg-transparent px-3.5 py-1.5 text-xs"
                                                  >
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
                                            )}
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
                </Table>) :
                <div className="mt-14">
                  <div className="flex justify-center items-center">
                    <Icons.ic_outline_post_add />
                  </div>
                  <h2 className="text-center text-xs tracking-wide">Add your first contact</h2>
                  <p className="text-center text-muted-foreground text-xs tracking-wide">There are no contact details with this record</p>
                </div>
              }
            </div>
          </>
        )}
        {data.length > 0 ? (
          <div className="absolute left-0 w-full bottom-0 border-t border-inherit rounded-br-lg rounded-bl-lg bg-inherit">
            <div className="flex items-center justify-end space-x-2 ">
              <div className="flex flex-auto mx-2 items-center text-xs text-muted-foreground">
                <span className="text-xs m-2 text-muted-foreground">Page</span>
                <Input
                  // type="number"
                  value={currentPage}
                  className="w-11 h-8 px-2 py-1 rounded-lg text-xs text-gray-600"
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
          </div>) : <div></div>}
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
                      <AddDefendantContact
                        defendantId={searchParams?.get("defendantId")}

                        icon={<Icons.pencil className="mb-1 h-3.5 w-5" />}
                        text="Edit"
                        disable={editEnable}
                        rowdata={editobj}
                        refreshAssignConsulate = {props?.refreshAssignConsulate}
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
