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
import AddContact from "@/components/contact/add-edit-contact-dialog"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { CustomActionToast } from "@/components/utils/custom-action-toast"
import { AddressSelect } from "@/components/utils/states-cities-combobox"
import { getSession } from "next-auth/react";
import { useRef } from "react"

export default function ContactPage() {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const [userRoles, setUserRoles] = React.useState<string[]>([])
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
  const searchParams = useSearchParams()
  const [sorting, setSorting] = React.useState<SortingState>([])
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
  const [columns, setColumns] = React.useState([
    {
      accessorKey: "id",
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "conLast",
      header: "Last Name",
      show: true,
    },
    {
      accessorKey: "conFirst",
      header: "First Name",
      accessorFn: (row: any) =>
        row?.conMiddle == null
          ? row?.conFirst
          : row?.conFirst + " " + row?.conMiddle,
      show: true,
    },
    {
      accessorKey: "conType",
      header: "Type",
      show: true,
    },
    {
      accessorKey: "phoneNumbers",
      header: "Phone Number",
      show: true,
    },
    {
      accessorKey: "conEmail",
      header: "Email",
      show: true,
    },
    {
      accessorKey: "conCity",
      header: "City",
      show: true,
    },
    {
      accessorKey: "conState",
      header: "State",
      show: true,
    },
    {
      accessorKey: "action",
      header: "",
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
      // if (filterValue) {
      //   filterSearch(filterValue, updatePage, limitPage)
      // } else {
      //   fetchData(updatePage, limitPage)
      // }
      if (filterValue) {
        filterSearch(filterValue, updatePage, limitPage)
      } else {
        if (filtersApplied) {
          applyFilter(updatePage, limitPage, '')
        } else {
          fetchData(updatePage, limitPage)
        }
      }
      const queryParams = new URLSearchParams()
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
      let updatePage = currentPage + 1
      setCurrentpage(updatePage)
      if (filterValue) {
        filterSearch(filterValue, updatePage, limitPage)
      } else {
        if (filtersApplied) {
          applyFilter(updatePage, limitPage, '')
        } else {
          fetchData(updatePage, limitPage)
        }
      }
      const queryParams = new URLSearchParams()
      queryParams.set("page", String(updatePage))
      queryParams.set("limit", String(limitPage))
      if (window.location.pathname) {
        const newUrl = window.location.pathname + "?" + queryParams.toString()
        window.history.pushState({}, "", newUrl)
      }
      // if (filterValue) {
      //   filterSearch(filterValue, updatePage, limitPage)
      // } else {
      //   fetchData(updatePage, limitPage)
      // }
      
    } catch (err) { }
  }
  const LimitPerPage = (limitValue: any) => {
    setLimitPage(limitValue)
    if (filterValue) {
      filterSearch(filterValue, currentPage, limitValue)
    } else {
      if (filtersApplied) {
        applyFilter(currentPage, limitValue, '')
      } else {
        fetchData(currentPage, limitValue)
      }
    }
    const queryParams = new URLSearchParams()
    queryParams.set("page", String(currentPage))
    queryParams.set("limit", String(limitValue))
    if (window.location.pathname) {
      const newUrl = window.location.pathname + "?" + queryParams.toString()
      window.history.pushState({}, "", newUrl)
    }
    // setCurrentpage(1)
    // if (filterValue) {
    //   filterSearch(filterValue, 1, limitValue)
    // } else {
    //   fetchData(1, limitValue)
    // }
    
  }

  const filterSearch = async (Value: any, updatePage: any, limitPage: any) => {
    try {
      setIsLoading(true)
      let url = `${baseURL}/v1/contacts?filter=${Value}&page=${updatePage}&limit=${limitPage}`
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
      setCurrentpage(updatePage);
      setLimitPage(limitPage);
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
      const response = await axiosInstance.get(
        `${baseURL}/v1/contacts?page=${updatePage}&limit=${updateLimit}`
      )

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
            applyFilter(Value, limitPage, '')
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
      fetchData(page, limit)
    }
    const fetchUserRoles = async () => {
      const session = await getSession();
      setUserRoles(session?.user?.roles || []);
    };

    fetchUserRoles();
    InitaialFecthData()
    fetchContactType()
  }, [])

  const handleDelete = async (id: any) => {
    try {
      if (!id) {
        return
      }
      await axiosInstance.delete(`${baseURL}/v1/contacts/${id}`)
      toast({
        variant: "default",
        description: "Contacts Deleted Successfully",
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
  const [filterEmail, setFilterEmail] = React.useState<any>("")
  const [filterCountry, setFilterCountry] = React.useState<any>("")
  const [filterState, setFilterState] = React.useState<any>("")
  const [filterCity, setFilterCity] = React.useState<any>("")
  const [showColumnIsOpen, setShowColumnIsOpen] = React.useState(false)
  const [filterConType, setFilterConType] = React.useState<any>("")
  const [filterSex, setFilterSex] = React.useState<any>("")
  const [viewRowData, setViewRowData] = React.useState(null)   //hidden view contact
  const [conactTypeList, setContactTypeList] = React.useState<any>([])

  const fetchContactType = async () => {
    try {
      let params = "Contact Type"
      const response = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/${params}`
      )
      const resp = response?.data?.data
      setContactTypeList(resp)
    } catch (error) { }
  }
  const setStateValue = (value: any) => {
    setFilterState(value)
  }
  const setCityValue = (value: any) => {
    setFilterCity(value)
  }

  const [filterHeight, setFilterHeight] = React.useState<any>("")
  
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
    let filterAllObject : any = {
      firstName : filterFirstName,
      lastName : filterLastName,
      email : filterEmail,
      country : filterCountry,
      state : filterState,
      city : filterCity,
      gender : filterSex,
      type : filterConType
    };
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

  const applyFilter = async (updatePage:any,updateLimit:any, applyParams : any) => {
    try {
      setTimeout(() => {
        let divElement: any = showfilterRef.current
        let elemRect = divElement?.getBoundingClientRect()

        let elemHeight = Math.ceil(Number(elemRect?.height) + 82)
        console.log(`${elemHeight}px`, "kkkk")
        setFilterHeight(`${elemHeight}px`)
      }, 3000)

      setFilterIsOpen(false)
      setIsLoading(true)
      let url = `${baseURL}/v1/contacts?firstName=${filterFirstName}&lastName=${filterLastName}&email=${filterEmail}&country=${filterCountry}&state=${filterState}&city=${filterCity}&gender=${filterSex}&type=${filterConType}&page=${updatePage}&limit=${updateLimit}`
      if( applyParams){
        let applyQueryString = objectToCustomQueryString(applyParams);
        url = `${baseURL}/v1/contacts?page=${updatePage}&limit=${updateLimit}${applyQueryString}`
      }
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

  return (
    <div className="overscroll-y-none px-2 pb-1 pt-2">
      <div className="hidden">
        <AddContact
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

      <div className="dark-container relative h-[calc(100vh-72px)] rounded-lg border bg-white p-2">
        <div className="flex">
          <h2 className="text-l ml-2 mt-0.5 font-bold">Contacts</h2>
          <div className="relative ml-5 h-8">
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
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="border-b">Filter</SheetTitle>
                    <SheetDescription>
                      <div className="mt-5 grid grid-cols-2 items-center gap-2">
                        <div>
                          <Label className="text-[0.7rem] font-semibold text-gray-600"
                            htmlFor="filterLastName">
                            Last Name
                          </Label>
                          <Input
                            id="filterLastName"
                            type="text"
                            className="h-8 rounded-lg border py-2 pl-3 text-xs xl:w-full"
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
                          <Label className="text-[0.7rem] font-semibold text-gray-600"
                            htmlFor="filterFirstName">
                            First Name
                          </Label>
                          <Input
                            id="filterFirstName"
                            type="text"
                            className="h-8 rounded-lg border py-2 pl-3 text-xs xl:w-full"
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

                      <div className="mt-4 grid grid-cols-1 items-center">
                        <Label
                          htmlFor="filterEmail"
                          className="text-[0.7rem] font-semibold text-gray-600"
                        >
                          Email
                        </Label>
                        <Input
                          type="text"
                          id="filterEmail"
                          placeholder="Email"
                          className="h-8 rounded-lg border py-2 pl-3 text-xs xl:w-full"
                          value={filterEmail}
                          onChange={(e) => {
                            setFilterEmail(e.target.value)
                            // if (!e.target.value && !firstName && !lastName && !phoneNumber && !active) {
                            //    handleFilter(false, currentPage, limitPage);
                            // }
                          }}
                        />
                      </div>
                      <div className="mt-4 grid grid-cols-2 items-center gap-2">
                        <div className="w-3/2">
                          <div>
                            <Label
                              htmlFor="filterGender"
                              className="text-[0.7rem] font-semibold text-gray-600"
                            >Gender</Label>
                          </div>
                          <div>
                            <Select
                              value={filterSex}
                              onValueChange={(value: any) => {
                                setFilterSex(value)
                              }}
                            >
                              <SelectTrigger className="h-8 w-full text-xs"
                                id="filterGender">
                                <SelectValue placeholder="Gender" />
                              </SelectTrigger>
                              <SelectContent className="w-full p-0 text-xs dark:bg-slate-900">
                                <SelectGroup>
                                  <SelectItem value="Male" className="text-xs">Male</SelectItem>
                                  <SelectItem value="Female" className="text-xs">Female</SelectItem>
                                  <SelectItem value="Other" className="text-xs">Other</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <div>
                            <Label className="text-[0.7rem] font-semibold text-gray-600"
                              htmlFor="filterContactType">Contact Type</Label>
                          </div>
                          <div>
                            <Select
                              value={filterConType}
                              onValueChange={(value: any) => {
                                setFilterConType(value)
                              }}
                            >
                              <SelectTrigger className="h-8 w-full text-xs"
                                id="filterContactType">
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent className="thin-scrollbar h-52 w-40 overflow-y-auto dark:bg-slate-900">
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
                      <div className="mt-4 grid grid-cols-1 items-center gap-2">
                        <div>
                          <Label className="text-[0.7rem] font-semibold text-gray-600"
                            htmlFor="filterContry">Country</Label>
                          <Select
                            value={filterCountry}
                            onValueChange={(value: any) => {
                              setFilterCountry(value)
                            }}
                          >
                            <SelectTrigger className="w-full text-xs" id="filterContry">
                              <SelectValue placeholder="Select Country"/>
                            </SelectTrigger>
                            <SelectContent defaultValue={""} className="dark:bg-slate-900" >
                              <SelectItem value="" className="text-xs">Select Country</SelectItem>
                              <SelectItem value="USA" className="text-xs">USA</SelectItem>
                              <SelectItem value="Mexico" className="text-xs">Mexico</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="hidden"
                            value={filterCity ? filterCity : ""}
                          // {...register("conCountry", { required: true })}
                          />
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-2 items-center gap-2">
                        <div className="felx flex-col">
                          <div>
                            <Label className="text-[0.7rem] font-semibold text-gray-600"
                              htmlFor="filterState">
                              State
                            </Label>
                          </div>
                          <div>
                            <AddressSelect
                              category={
                                filterCountry == "Mexico"
                                  ? "mexicoStatesAndCities"
                                  : "usStatesAndCities"
                              }
                              placeholdername={"Select state"}
                              country={filterCountry}
                              wPage={160}
                              defultselect={filterState}
                              selectedValue={setStateValue}
                            />
                            <Input
                              type="hidden"
                              value={filterCountry ? filterCountry : ""}
                            // {...register("conState", { required: true })}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div>
                            <Label
                              className="text-[0.7rem] font-semibold text-gray-600">
                              City</Label>
                          </div>
                          <div>
                            <AddressSelect
                              category={"city"}
                              country={filterCountry}
                              state={filterState}
                              placeholdername={"Select city"}
                              selectedValue={setCityValue}
                              defultselect={filterCity}
                              wPage={160}
                            />
                            <Input
                              type="hidden"
                              value={filterCountry ? filterCountry : ""}
                            />
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
                                  setFilterEmail("")
                                  setFilterSex("")
                                  setFilterConType("")
                                  setFilterCountry("")
                                  setFilterCity("")
                                  setFilterState("")
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
                            onClick={()=>applyFilter(1,limitPage, '')}
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
              <AddContact
                icon={<Icons.add className="mb-0.5 h-3.5 w-5" />}
                text="Add"
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
            className="flex flex-nowrap border-t py-2"
          >
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
                    // if (
                    //   !filterLastName &&
                    //   !filterEmail &&
                    //   !filterSex &&
                    //   !filterConType &&
                    //   !filterCountry &&
                    //   !filterCity &&
                    //   !filterState
                    // ) {
                    //   setShowFilters(false)
                    //   setFiltersApplied(false)
                    // }
                    // fetchData(currentPage, limitPage)
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
                    // if (
                    //   !filterFirstName &&
                    //   !filterEmail &&
                    //   !filterSex &&
                    //   !filterConType &&
                    //   !filterCountry &&
                    //   !filterCity &&
                    //   !filterState
                    // ) {
                    //   setShowFilters(false)
                    //   setFiltersApplied(false)
                    // }
                    // fetchData(currentPage, limitPage)
                    clearBadge('lastName')
                  }}
                />
              </Badge>
            )}
            {filterEmail && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Email
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterEmail}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterEmail("")
                    // if (
                    //   !filterFirstName &&
                    //   !filterLastName &&
                    //   !filterSex &&
                    //   !filterConType &&
                    //   !filterCountry &&
                    //   !filterCity &&
                    //   !filterState
                    // ) {
                    //   setShowFilters(false)
                    //   setFiltersApplied(false)
                    // }
                    // fetchData(currentPage, limitPage)
                    clearBadge('email')
                  }}
                />
              </Badge>
            )}
            {filterSex && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Gender
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterSex.replace(/(^\w{1})|(\s+\w{1})/g, (letter: any) =>
                    letter.toUpperCase()
                  )}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterSex("")
                    // if (
                    //   !filterFirstName &&
                    //   !filterLastName &&
                    //   !filterEmail &&
                    //   !filterConType &&
                    //   !filterCountry &&
                    //   !filterCity &&
                    //   !filterState
                    // ) {
                    //   setShowFilters(false)
                    //   setFiltersApplied(false)
                    // }
                    // fetchData(currentPage, limitPage)
                    clearBadge('gender')
                  }}
                />
              </Badge>
            )}
            {filterConType && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Contact Type
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterConType}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterConType("")
                    // if (
                    //   !filterFirstName &&
                    //   !filterLastName &&
                    //   !filterEmail &&
                    //   !filterSex &&
                    //   !filterCountry &&
                    //   !filterCity &&
                    //   !filterState
                    // ) {
                    //   setShowFilters(false)
                    //   setFiltersApplied(false)
                    // }
                    // fetchData(currentPage, limitPage)
                    clearBadge('type')
                  }}
                />
              </Badge>
            )}
            {filterCountry && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Country Type
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterCountry}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterCountry("")
                    // if (
                    //   !filterFirstName &&
                    //   !filterLastName &&
                    //   !filterEmail &&
                    //   !filterSex &&
                    //   !filterConType &&
                    //   !filterCity &&
                    //   !filterState
                    // ) {
                    //   setShowFilters(false)
                    //   setFiltersApplied(false)
                    // }
                    // fetchData(currentPage, limitPage)
                    clearBadge('country')

                  }}
                />
              </Badge>
            )}
            {filterCity && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  City
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {filterCity}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFilterCity("")
                    // if (
                    //   !filterFirstName &&
                    //   !filterLastName &&
                    //   !filterEmail &&
                    //   !filterSex &&
                    //   !filterConType &&
                    //   !filterCountry &&
                    //   !filterState
                    // ) {
                    //   setShowFilters(false)
                    //   setFiltersApplied(false)
                    // }
                    // fetchData(currentPage, limitPage)
                    clearBadge('city')

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
                    // if (
                    //   !filterFirstName &&
                    //   !filterLastName &&
                    //   !filterEmail &&
                    //   !filterSex &&
                    //   !filterConType &&
                    //   !filterCountry &&
                    //   !filterCity
                    // ) {
                    //   setShowFilters(false)
                    //   setFiltersApplied(false)
                    // }
                    // fetchData(currentPage, limitPage)
                    clearBadge('state')

                  }}
                />
              </Badge>
            )}
            <div className="">
              {(filterFirstName ||
                filterLastName ||
                filterEmail ||
                filterSex ||
                filterConType ||
                filterCountry ||
                filterCity ||
                filterState) && (
                  <Button
                    variant="link"
                    onClick={(e) => {
                      setFilterFirstName("")
                      setFilterLastName("")
                      setFilterEmail("")
                      setFilterSex("")
                      setFilterConType("")
                      setFilterCountry("")
                      setFilterCity("")
                      setFilterState("")
                      setFilterIsOpen(false)
                      setFiltersApplied(false)
                      setShowFilters(false)
                      fetchData(currentPage, limitPage)
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
                                : "text-black-500 sticky top-0 h-auto p-2 text-xs font-bold"
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
                                      <PopoverTrigger className="h-8 w-8 px-2.5" onClick={(e) => e.stopPropagation()}>
                                        <Icons.verticalDots className="fixed cursor-pointer " />
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="ml-2 flex h-8 w-auto items-center rounded-lg p-0"
                                        align="center"
                                        side="left"
                                      >
                                        <div className="flex flex-nowrap">
                                          {/* <Button
                                        variant="ghost"
                                        className="flex h-8 items-center rounded-r-lg border-r rounded-r-none bg-transparent px-3.5 py-1.5 text-xs"
                                      ><Icons.pencil className=" h-3.5 w-5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        className="flex h-8 items-center rounded-r-lg rounded-none bg-transparent px-3.5 py-1.5 text-xs"
                                      ><Icons.eye className=" h-3.5 w-5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        className="flex h-8 items-center rounded-r-lg border-l rounded-l-none bg-transparent px-3.5 py-1.5 text-xs"
                                      ><Icons.deleteIcon className=" h-3.5 w-5" />
                                      </Button> */}
                                          <AddContact
                                            icon={
                                              <Icons.pencil className=" h-3.5 w-5" />
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
                                          <AddContact
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
                                          <Dialog
                                            open={isOpen1}
                                            onOpenChange={setIsOpen1}
                                          >
                                            <DialogTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                className="flex h-8 items-center rounded-l-none rounded-r-lg border-l bg-transparent px-3.5 py-1.5 text-xs"
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
                      <AddContact
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
