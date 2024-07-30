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
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group"
import { ArrowUpDown } from "lucide-react"
import { getSession } from "next-auth/react"
import { PanelGroup } from "react-resizable-panels"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { fetchRolesData } from "@/lib/masterDetails"
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
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import AlertDialogDemo from "@/components/user/addUserAlertDialog"
import { useRef } from "react"

interface Role {
  id: number
  name: string
}

type User = {
  id: String
  firstName: String
  lastName: String
  email: String
  phoneNumbers: String
  active: boolean
}
export default function UserPage() {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const [viewRowData, setViewRowData] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [currentPage, setCurrentpage] = React.useState<number>(1)
  const [limitPage, setLimitPage] = React.useState<any>("25")
  const [totalPage, setTotalPage] = React.useState<number>(1)
  const [totalItems, setTotalItems] = React.useState<number>(0)
  const [timer, setTimer] = React.useState(null)
  const [roles, setRoles] = React.useState<string[]>([])
  const [userData, setUserData] = React.useState<User[]>([])
  const [rolesData, setRolesData] = React.useState<Role[]>([])
  const [showFilters, setShowFilters] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [isTheme, setIsTheme] = React.useState(false)
  const [deleteids, setDeleteIds] = React.useState<any>([])
  const searchParams = useSearchParams()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [showColumnIsOpen, setShowColumnIsOpen] = React.useState(false)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columns, setColumns] = React.useState([
    {
      accessorKey: "lastName",
      header: "Last Name",
      show: true,
    },
    {
      accessorKey: "firstName",
      header: "First Name",
      show: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      show: true,
    },
    {
      accessorKey: "role",
      header: "Roles",
      show: true,
    },
    {
      accessorKey: "phoneNumbers",
      header: "Phone Number",
      show: true,
    },
    {
      accessorKey: "active",
      header: "Status",
      show: true,
    },
    {
      accessorKey: "action",
      header: "",
      show: true,
    },
  ])

  const table = useReactTable({
    data: userData,
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

  const [filtersApplied, setFiltersApplied] = React.useState(false)
  const [firstName, setFirstName] = React.useState<any>("")
  const [lastName, setLastName] = React.useState<any>("")
  const [email, setEmail] = React.useState<any>("")
  const [phoneNumber, setPhoneNumber] = React.useState<any>("")
  const [active, setActive] = React.useState<any>("")

  const PreviousPage = () => {
    try {
      let updatePage = currentPage - 1
      setCurrentpage(updatePage)
      fetchData(updatePage, limitPage)
    } catch (err) {}
  }
  const NextPage = () => {
    try {
      let updatePage = currentPage + 1
      setCurrentpage(updatePage)
      fetchData(updatePage, limitPage)
    } catch (err) {}
  }
  const LimitPerPage = (limitValue: any) => {
    setLimitPage(limitValue)
    fetchData(1, limitValue)
  }
  const deleteUser = async (id: any) => {
    let url = `${baseURL}/v1/users/${id}`
    const response = await axiosInstance.delete(url)
    toast({
      variant: "default",
      description: "User Deleted Successfully",
      style: {
        background: "#03C03C",
      },
    })
    fetchData(currentPage, limitPage)
    setIsOpen(false)
  }
  const userSearch = async (Value: any) => {
    let url = `${baseURL}/v1/users?filter=${Value}&page=1&limit=${limitPage}`
    const response = await axiosInstance.get(url)
    if (response?.data?.users?.rows) {
      setUserData(response?.data?.users?.rows)
    } else {
      setUserData([])
    }
  }
  const [filterValue, setFilterValue] = React.useState<any>("")

  const handleSearch = async (event: any) => {
    let Value = event.target.value
    setFilterValue(Value)
    // clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (Value) {
        userSearch(Value)
      } else {
        fetchData(currentPage, limitPage)
      }
    }, 500)
    // setTimer(newTimer);
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
        if (Value) {
          fetchData(Value, limitPage)
        } else {
          fetchData(currentPage, limitPage)
        }
      }, 500)
      setTimer(newTimer)
    }
  }

  const [filterIsOpen, setFilterIsOpen] = React.useState<any>(false)
  const [filterRole, setFilterRole] = React.useState<any>([])

  const fetchData = async (updatePage: any, updateLimit: any) => {
    setIsLoading(true)
    if (!updatePage) {
      updatePage = 1
    }
    if (!updateLimit) {
      updateLimit = 25
    }

    const session = await getSession()
    setRoles(session?.user?.roles)
    const currentUserRoles = session?.user?.roles
    let api = baseURL + "/v1/users"

    try {
      let firstNameValue = firstName
        ? firstName
        : searchParams?.get("firstName")
        ? searchParams?.get("firstName")
        : ""
      let lastNameValue = lastName
        ? lastName
        : searchParams?.get("lastName")
        ? searchParams?.get("lastName")
        : ""
      let emailValue = email
        ? email
        : searchParams?.get("email")
        ? searchParams?.get("email")
        : ""
      let phoneNumberValue = phoneNumber
        ? phoneNumber
        : searchParams?.get("phoneNumber")
        ? searchParams?.get("phoneNumber")
        : ""
      let activeValue = active
        ? active
        : searchParams?.get("active")
        ? searchParams?.get("active")
        : ""

      const response = await axiosInstance.get(
        `${api}?firstName=${firstNameValue}&lastName=${lastNameValue}&email=${emailValue}&phoneNumber=${phoneNumberValue}&active=${activeValue}&page=${updatePage}&limit=${updateLimit}`
      )
      if (response?.data?.users?.rows) {
        let modified = response?.data?.users?.rows
        if (typeof modified === "object") {
          let setData = modified.map((map_ele: any) => {
            if (map_ele.Roles && typeof map_ele.Roles === "object") {
              let role_data = map_ele.Roles.map((ele: any) => {
                return ele.name
              })
              map_ele.role = role_data.join(",")
            }
            if (
              map_ele.phoneNumber &&
              typeof map_ele.phoneNumber === "object"
            ) {
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
          setUserData(setData)
        } else {
          setUserData([])
        }
        if (
          !totalItems ||
          updateLimit != limitPage ||
          (response?.data?.users?.totalItems &&
            totalItems != response?.data?.users?.totalItems)
        ) {
          setCurrentpage(1)
          setTotalPage(
            response?.data?.users?.totalPages
              ? response?.data?.users?.totalPages
              : 1
          )
          setTotalItems(
            response?.data?.users?.totalItems
              ? response?.data?.users?.totalItems
              : 0
          )
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
    setIsLoading(false)
  }

  // React.useEffect(() => {
  //   const InitaialFecthData  = async ()=>{
  //       try{
  //           const roleDetails = await fetchRolesData();
  //           setRolesData(roleDetails);
  //           fetchData(currentPage, limitPage);
  //       }catch(error){}
  //   }
  //   InitaialFecthData();
  // },[])

  const handleRoleChanged = async (e: any, index: any) => {
    if (e) {
      let oldData: any = [...rolesData]
      oldData[index]["checked"] = true
      setRolesData(oldData)
    } else {
      let oldData: any = [...rolesData]
      oldData[index]["checked"] = false
      setRolesData(oldData)
    }
  }

  const handleFilter = async (
    filterValue: any,
    updatePage: any,
    updateLimit: any
  ) => {
    try {
      setFilterIsOpen(false)
      setIsLoading(true)
      let filter_roles: any = []
      if (rolesData && rolesData?.length > 0) {
        rolesData?.map((map_ele: any) => {
          if (map_ele?.checked) {
            filter_roles.push(map_ele.id)
          }
          return map_ele
        })
      }
      setFilterRole(filter_roles)
      const queryParams = new URLSearchParams()
      const session = await getSession()
      const currentUserOrgId = session?.user?.orgId
      const currentUserRoles = session?.user?.roles

      let api = baseURL + "/v1/users"

      let response = await axiosInstance.get(
        filterValue
          ? `${api}?firstName=${firstName}&lastName=${lastName}&email=${email}&phoneNumber=${phoneNumber}&active=${active}&role=${filter_roles}&page=1&limit=${limitPage}
        `
          : `${api}?page=1&limit=${limitPage}`
      )

      if (response?.data?.users?.rows) {
        let modified = response.data.users.rows
        if (typeof modified === "object") {
          let setData = modified.map((map_ele: any) => {
            if (map_ele.Roles && typeof map_ele.Roles === "object") {
              let role_data = map_ele.Roles.map((ele: any) => {
                return ele.name
              })
              map_ele.role = role_data.join(",")
            }
            if (
              map_ele.phoneNumber &&
              typeof map_ele.phoneNumber === "object"
            ) {
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
          setUserData(setData)
          setShowFilters(true)
          setFiltersApplied(true)
        }
      } else {
        setUserData([])
      }

      setTotalPage(
        response?.data?.users?.totalPages
          ? response?.data?.users?.totalPages
          : 1
      )
      setTotalItems(
        response?.data?.users?.totalItems
          ? response?.data?.users?.totalItems
          : 0
      )
      setCurrentpage(1)
      setIsLoading(false)
    } catch (error) {}
  }

  React.useEffect(() => {
    if (
      searchParams?.get("firstName") ||
      searchParams?.get("lastName") ||
      searchParams?.get("email") ||
      searchParams?.get("phoneNumber") ||
      searchParams?.get("active")
    ) {
      setShowFilters(true)
      setFiltersApplied(true)
    }

    if (searchParams?.get("firstName")) {
      setFirstName(searchParams?.get("firstName"))
    }
    if (searchParams?.get("lastName")) {
      setLastName(searchParams?.get("lastName"))
    }
    if (searchParams?.get("email")) {
      setEmail(searchParams?.get("email"))
    }
    if (searchParams?.get("phoneNumber")) {
      setPhoneNumber(searchParams?.get("phoneNumber"))
    }
    if (searchParams?.get("active")) {
      setActive(searchParams?.get("active"))
    }
    const InitaialFecthData = async () => {
      try {
        const roleDetails = await fetchRolesData()
        setRolesData(roleDetails)

        fetchData(currentPage, limitPage)
      } catch (error) {
        setIsLoading(false)
        console.log("Error fetching data:", (error as any).message)
      }
    }

    InitaialFecthData()

    const fetchUserRoles = async () => {
      const session = await getSession();
      setUserRoles(session?.user?.roles || []);
    };
  
    fetchUserRoles();
  }, [])

  return (
    <div className="overscroll-y-none px-2 pb-1 pt-2">
      <div className="hidden">
        <AlertDialogDemo
          ref={userButtonRef}
          hidetext="View"
          rowdata={viewRowData}
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
          <h2 className="text-l mx-1 mt-0.5 font-bold">Users</h2>
          <div className="relative ml-5 h-8">
            <Input
              className="w-32 md:w-44 pl-9 text-xs"
              onChange={handleSearch}
              value={filterValue}
              placeholder="Search"
            />
            <Icons.search className="absolute left-0 top-0 ml-2.5 h-8 w-4 text-muted-foreground" />
          </div>
          <div className="relative mb-2 ml-auto flex">
            <div className="">
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
                  <SheetHeader className="text-start">
                    <SheetTitle className="border-b">Filter</SheetTitle>
                    <SheetDescription>
                      <div className="mt-5 grid grid-cols-2 items-center gap-2">
                        <div className="">
                          <Label className="text-[0.7rem] font-semibold text-gray-600">
                            First Name
                          </Label>
                          <Input
                            type="text"
                            className="h-8 rounded-lg border py-2 pl-3 text-xs xl:w-full"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => {
                              setFirstName(e.target.value)
                              if (
                                !e.target.value &&
                                !lastName &&
                                !email &&
                                !phoneNumber &&
                                !active
                              ) {
                                handleFilter(false, currentPage, limitPage)
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-[0.7rem] font-semibold text-gray-600">
                            Last Name
                          </Label>
                          <Input
                            type="text"
                            className="h-8 rounded-lg border py-2 pl-3 text-xs xl:w-full"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => {
                              setLastName(e.target.value)
                              if (
                                !e.target.value &&
                                !firstName &&
                                !email &&
                                !phoneNumber &&
                                !active
                              ) {
                                handleFilter(false, currentPage, limitPage)
                              }
                            }}
                          />
                        </div>
                        <div className="mb-3 mt-4 grid grid-cols-5 gap-2 ">
                          <Label className="col-span-5 text-[0.7rem] font-semibold text-gray-600">
                            Roles
                          </Label>
                          <RadioGroup className="col-span-5 flex flex-nowrap gap-6">
                            {rolesData
                              ?.sort((a, b) => a.id - b.id)
                              .map((role: any, index: any) => (
                                <div key={role.id} className="flex">
                                  <Checkbox
                                    defaultChecked={
                                      role?.checked ? true : false
                                    }
                                    onCheckedChange={(e) =>
                                      handleRoleChanged(e, index)
                                    }
                                    className=" mr-2 "
                                  />
                                  <Label className="text-xs">
                                    {role.name}
                                  </Label>
                                </div>
                              ))}{" "}
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 items-center">
                        <Label
                          htmlFor="emailFilter"
                          className="text-left text-[0.7rem] font-semibold text-gray-600">
                          Email
                        </Label>
                        <Input
                          id="emailFilter"
                          type="text"
                          placeholder="Email"
                          className="h-8 rounded-lg border py-2 pl-3 text-xs xl:w-full"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (
                              !e.target.value &&
                              !firstName &&
                              !lastName &&
                              !phoneNumber &&
                              !active
                            ) {
                              handleFilter(false, currentPage, limitPage)
                            }
                          }}
                        />
                      </div>
                      </SheetDescription>
                      <div className="relative mt-5 flex items-center justify-between py-1 xl:py-2">
                        <div className="">
                          {filtersApplied && (
                            <Button
                              variant="link"
                              onClick={(e) => {
                                setFirstName("")
                                setLastName("")
                                setEmail("")
                                setPhoneNumber("")
                                setActive("")
                                if (rolesData && rolesData?.length > 0) {
                                  let Roles = rolesData?.map((map_ele: any) => {
                                    map_ele.checked = false
                                    return map_ele
                                  })
                                  setRolesData(Roles)
                                }
                                handleFilter(false, currentPage, limitPage)
                              }}
                              className="text-black-700 items-center px-2 py-1 text-xs hover:underline"
                            >
                              <Icons.close className="mr-1 h-3 w-3" /> Clear
                              Filters
                            </Button>
                          )}
                        </div>
                        <div>
                          <Button
                            onClick={(e) =>
                              handleFilter(true, currentPage, limitPage)
                            }
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
            {!userRoles.includes("COORDINATOR") && (
            <AlertDialogDemo
              text="Add"
              icon={<Icons.add className="mb-0.5 h-3.5 w-5" />}
              afterSuccess={() => fetchData(currentPage, limitPage)}
            />
            )}
          </div>
        </div>
        {showFilters && (
          <div className="flex flex-nowrap border-t py-2">
            {firstName && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  First Name
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {firstName}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setFirstName("")
                    if (
                      !lastName &&
                      !email &&
                      !phoneNumber &&
                      !rolesData?.some((role: any) => role.checked) &&
                      !active
                    ) {
                      setShowFilters(false)
                      setFiltersApplied(false)
                    }
                    fetchData(currentPage, limitPage)
                  }}
                />
              </Badge>
            )}
            {lastName && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Last Name
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {lastName}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setLastName("")
                    if (
                      !firstName &&
                      !email &&
                      !phoneNumber &&
                      !rolesData?.some((role: any) => role.checked) &&
                      !active
                    ) {
                      setShowFilters(false)
                      setFiltersApplied(false)
                    }
                    fetchData(currentPage, limitPage)
                  }}
                />
              </Badge>
            )}
            {email && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Email
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">{email}</span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setEmail("")
                    if (
                      !firstName &&
                      !lastName &&
                      !phoneNumber &&
                      !rolesData?.some((role: any) => role.checked) &&
                      !active
                    ) {
                      setShowFilters(false)
                      setFiltersApplied(false)
                    }
                    fetchData(currentPage, limitPage)
                  }}
                />
              </Badge>
            )}
            {phoneNumber && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Phone Number
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {phoneNumber}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setPhoneNumber("")
                    if (
                      !firstName &&
                      !lastName &&
                      !email &&
                      !rolesData?.some((role: any) => role.checked) &&
                      !active
                    ) {
                      setShowFilters(false)
                      setFiltersApplied(false)
                    }
                    fetchData(currentPage, limitPage)
                  }}
                />
              </Badge>
            )}
            {rolesData &&
              rolesData?.map((roleElement: any, i: any) => {
                if (roleElement.checked) {
                  return (
                    <Badge
                      key={i}
                      variant="outline"
                      className="h-pl-3 mr-2 h-6 rounded-md pr-0"
                    >
                      <span className="border-r pr-2 text-[0.65rem] font-normal">
                        Roles
                      </span>
                      <span className="pl-2 text-[0.65rem] font-normal">
                        {roleElement.name}
                      </span>
                      <Icons.close
                        className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                        onClick={() => {
                          if (rolesData && rolesData?.length > 0) {
                            let Roles = rolesData?.map((map_ele: any) => {
                              map_ele.checked = false
                              return map_ele
                            })
                            setRolesData(Roles)
                          }
                          if (
                            !firstName &&
                            !lastName &&
                            !email &&
                            !phoneNumber &&
                            !active
                          ) {
                            setShowFilters(false)
                            setFiltersApplied(false)
                          }
                          fetchData(currentPage, limitPage)
                        }}
                      />
                    </Badge>
                  )
                }
              })}
            {active && (
              <Badge
                variant="outline"
                className="mr-2 h-6 rounded-md pl-3 pr-0"
              >
                <span className="border-r pr-2 text-[0.65rem] font-normal">
                  Status
                </span>
                <span className="pl-2 text-[0.65rem] font-normal">
                  {active}
                </span>
                <Icons.close
                  className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setActive("")
                    if (
                      !firstName &&
                      !lastName &&
                      !email &&
                      !phoneNumber &&
                      !rolesData?.some((role: any) => role.checked)
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
              {(firstName ||
                lastName ||
                email ||
                phoneNumber ||
                rolesData?.some((role: any) => role.checked) ||
                active) && (
                <Button
                  variant="link"
                  onClick={(e) => {
                    setFirstName("")
                    setLastName("")
                    setEmail("")
                    setPhoneNumber("")
                    if (rolesData && rolesData?.length > 0) {
                      let Roles = rolesData?.map((map_ele: any) => {
                        map_ele.checked = false
                        return map_ele
                      })
                      setRolesData(Roles)
                    }
                    setActive("")
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
            <div className="thin-scrollbar fixed-child-table h-[calc(100vh-9.5rem)] overflow-y-auto border-t">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            className={
                              "text-black-500 sticky top-0 h-auto py-4 text-xs font-bold"
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
                                  <div className="">
                                    {/* <Checkbox
                                    checked={
                                      table.getIsAllPageRowsSelected()
                                      // (table.getIsSomePageRowsSelected() && "indeterminate")
                                    }
                                    onCheckedChange={(value) => {
                                      table?.toggleAllPageRowsSelected(!!value);
                                      selectAllChecked(value)
                                    }}
                                    className="border-slate-600"
                                    aria-label="Select all" /> */}
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
                                if (userButtonRef.current) {
                                  setViewRowData(cell.row.original);
                                  setTimeout(() => {
                                    userButtonRef.current?.click();
                                  }, 200);
                                }
                              }
                            }
                            >
                              {cell.column.id === "active" ? (
                                // Render the "active" cell based on the activeFilter state
                                <div className="ml-1 flex flex-row items-center">
                                  <div
                                    className={` h-2 w-2 rounded-full border-2 ${
                                      cell.row.original.active
                                        ? "border-green-500 text-white"
                                        : "border-red-500 text-white"
                                    }`}
                                    style={{ cursor: "default" }}
                                  ></div>
                                </div>
                              ) : cell.column.id === "action" ? (
                                <div className="">
                                  {!userRoles.includes("COORDINATOR") && (
                                  <Popover>
                                    <PopoverTrigger className="h-8 w-8 px-2.5" onClick={(e) => e.stopPropagation()}>
                                      <Icons.verticalDots className="fixed cursor-pointer" />
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="ml-2 flex h-8 w-auto items-center rounded-lg p-0"
                                      align="center"
                                      side="left"
                                    >
                                      <div className="flex flex-nowrap " onClick={(e) => e.stopPropagation()}>
                                        <AlertDialogDemo
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
                                          afterSuccess={() =>
                                            fetchData(currentPage, limitPage)
                                          }
                                        />
                                        <AlertDialogDemo
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
                                          open={isOpen}
                                          onOpenChange={setIsOpen}
                                        >
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="ghost"
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
                                              Are you sure you want to delete ?
                                            </DialogDescription>
                                            <DialogFooter>
                                              <DialogClose className="text-black-600 pr-6 text-xs">
                                                Cancel
                                              </DialogClose>
                                              <Button
                                                type="submit"
                                                variant="outline"
                                                onClick={() =>
                                                  deleteUser(
                                                    cell.row.original.id
                                                  )
                                                }
                                                className="h-8 bg-transparent py-3 text-xs"
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
    </div>
  )
}
