"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Label } from "@radix-ui/react-label"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import moment from "moment"
import Calendar from "react-calendar"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { cn, convertToUTCDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import "react-calendar/dist/Calendar.css"
import { getSession } from "next-auth/react"

import { Button } from "../ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { AddCasesDialog } from "./add-edit-casepage-dialog"
import { AddDefendantCases } from "./add-edit-defendantCasePage"
import { CoDefendantCombobox } from "./co-defendant-combobox"

export default function DefendantCasesPage(props: any) {
  const searchParams = useSearchParams()
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [caseData, setCaseData] = React.useState<any>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentPage, setCurrentpage] = React.useState<number>(1)
  const [limitPage, setLimitPage] = React.useState<any>("25")
  const [totalPage, setTotalPage] = React.useState<number>(1)
  const [totalItems, setTotalItems] = React.useState<number>(0)
  const [filterValue, setFilterValue] = React.useState<any>("")
  const [timer, setTimer] = React.useState(null)
  const [deleteIsOpen, setDeleteIsOpen] = React.useState<any>(false)
  const [deleteid, setDeleteId] = React.useState<any>("")

  const [filterHeight, setFilterHeight] = React.useState<any>("")
  const [filterIsOpen, setFilterIsOpen] = React.useState<any>(false)
  const [filtersApplied, setFiltersApplied] = React.useState(false)
  const [showFilters, setShowFilters] = React.useState(false)
  const [filterCaseTitle, setFilterCaseTitle] = React.useState<any>("")
  const [filterCaseNo, setFilterCaseNo] = React.useState<any>("")
  const [filterCrimeDate, setFilterCrimeDate] = React.useState<any>("")
  const [filterCaseStatus, setFilterCaseStatus] = React.useState<any>("")
  const [filterCaseID, setFilterCaseID] = React.useState<any>("")
  const [filterCoDefendant, setFilterCoDefendant] = React.useState<any>([])
  const [coDefendantData, setcoDefendantData] = React.useState<any>([])
  const [caseStatusTypeList, setCaseStatusTypeList] = React.useState<any>([])
  const [filterCrimeDateIsOpen, setFilterCrimeDateIsOpen] =
    React.useState<any>(false)

  const getCoDefendant = (value: any) => {
    setFilterCoDefendant(value)
  }

  const PreviousPage = () => {
    try {
      let updatePage = currentPage - 1
      setCurrentpage(updatePage)
      fetchData(updatePage, limitPage)
      const queryParams = new URLSearchParams()
      queryParams.set("defendantId", String(searchParams?.get("defendantId")))
      queryParams.set("active", "contacts")
      queryParams.set("page", String(updatePage))
      queryParams.set("limit", String(limitPage))
      if (window.location.pathname) {
        const newUrl = window.location.pathname + "?" + queryParams.toString()
        window.history.pushState({}, "", newUrl)
      }
    } catch (err) {}
  }
  const NextPage = () => {
    try {
      let updatePage = Number(currentPage) + 1
      setCurrentpage(updatePage)
      const queryParams = new URLSearchParams()
      queryParams.set("defendantId", String(searchParams?.get("defendantId")))
      queryParams.set("active", "contacts")
      queryParams.set("page", String(updatePage))
      queryParams.set("limit", String(limitPage))
      if (window.location.pathname) {
        const newUrl = window.location.pathname + "?" + queryParams.toString()
        window.history.pushState({}, "", newUrl)
      }
      setCurrentpage(updatePage)
      fetchData(updatePage, limitPage)
    } catch (err) {}
  }
  const LimitPerPage = (limitValue: any) => {
    const queryParams = new URLSearchParams()
    queryParams.set("defendantId", String(searchParams?.get("defendantId")))
    queryParams.set("active", "contacts")
    queryParams.set("page", "1")
    queryParams.set("limit", String(limitValue))
    if (window.location.pathname) {
      const newUrl = window.location.pathname + "?" + queryParams.toString()
      window.history.pushState({}, "", newUrl)
    }
    setLimitPage(limitValue)
    setCurrentpage(1)
    fetchData(1, limitValue)
  }
  const filterSearch = async (Value: any) => {
    setIsLoading(true)
    let defId = searchParams?.get("defendantId")
    let url = `${baseURL}/v1/case/defcase/${defId}?filter=${Value}&page=1&limit=${limitPage}`
    const response = await axiosInstance.get(url)
    let listData = response?.data?.data?.rows ? response?.data?.data?.rows : []
    let caseLinkData = response?.data?.data?.caseLinkData
      ? response?.data?.data?.caseLinkData
      : []
    listData = listData?.map((map_ele: any) => {
      let findCaseStatus = caseLinkData.find(
        (find_ele: any) => find_ele.linkCaseID == map_ele.id
      )
      if (findCaseStatus) {
        map_ele.linkData = findCaseStatus
      }
      return map_ele
    })
    setCaseData(listData)
    setCurrentpage(1)
    setTotalPage(
      response?.data?.data?.totalPages ? response?.data?.data?.totalPages : 1
    )
    setTotalItems(
      response?.data?.data?.totalItems ? response?.data?.data?.totalItems : 0
    )
    setIsLoading(false)
  }
  const handleSearch = async (event: any) => {
    let Value = event.target.value
    setFilterValue(Value)
    clearTimeout(timer)
    const newTimer = setTimeout(() => {
      if (Value) {
        filterSearch(Value)
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
    try {
      let defId = searchParams?.get("defendantId")
      const response = await axiosInstance.get(
        `${baseURL}/v1/case/defcase/${defId}?page=${updatePage}&limit=${updateLimit}`
      )
      let listData = response?.data?.data?.rows
        ? response?.data?.data?.rows
        : []
      let caseLinkData = response?.data?.data?.caseLinkData
        ? response?.data?.data?.caseLinkData
        : []
      console.log("caseLinkData", caseLinkData)
      console.log("listData", listData)
      listData = listData?.map((map_ele: any) => {
        let findCaseStatus = caseLinkData.find(
          (find_ele: any) => find_ele.linkCaseID == map_ele.id
        )
        if (findCaseStatus) {
          map_ele.linkData = findCaseStatus
        }
        return map_ele
      })
      setCaseData(listData)
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

  const applyFilter = async () => {
    try {
      setTimeout(() => {
        let divElement: any = showfilterRef.current
        let elemRect = divElement?.getBoundingClientRect()

        let elemHeight = Math.ceil(
          Number(elemRect?.height ? elemRect?.height : 0) + 92
        )
        console.log(`${elemHeight}px`, "kkkk")
        setFilterHeight(`${elemHeight}px`)
      }, 3000)
      setFilterIsOpen(false)
      setFiltersApplied(true)
      setShowFilters(true)
      let defId = searchParams?.get("defendantId")
      let crimeDate = ""
      if (filterCrimeDate && filterCrimeDate?.length > 0) {
        crimeDate = filterCrimeDate.join(",")
        console.log("crimeDate-----", crimeDate)
      }
      const response = await axiosInstance.get(
        `${baseURL}/v1/case/defcase/${defId}?caseID=${filterCaseID}&caseStatus=${filterCaseStatus}&coDefendant=${filterCoDefendant}&caseTitle=${filterCaseTitle}&caseNo=${filterCaseNo}&crimeDate=${crimeDate}&page=${currentPage}&limit=${limitPage}`
      )
      let listData = response?.data?.data?.rows
        ? response?.data?.data?.rows
        : []
      setCaseData(listData)
      setTotalItems(
        response?.data?.data?.totalItems ? response?.data?.data?.totalItems : 0
      )
      setTotalPage(
        response?.data?.data?.totalPages ? response?.data?.data?.totalPages : 0
      )
    } catch (err) {}
  }
  const showfilterRef = React.useRef(null)
  const showtableRef = React.useRef(null)

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
        if (Value) {
          fetchData(Value, limitPage)
        } else {
          fetchData(currentPage, limitPage)
        }
      }, 500)
      setTimer(newTimer)
    }
  }

  React.useEffect(() => {
    console.log(
      "defendantId------------------",
      searchParams?.get("defendantId")
    )
    const intialFecthData = async () => {
      fetchData(currentPage, limitPage)
    }
    intialFecthData()
    const fetchUserRoles = async () => {
      const session = await getSession()
      setUserRoles(session?.user?.roles || [])
    }

    const fetchCode = async () => {
      let caseStatus = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/Case Status`
      )
      let dataStatus = caseStatus?.data?.data ? caseStatus?.data?.data : []
      setCaseStatusTypeList(dataStatus)
    }

    fetchUserRoles()
    fetchCode()
  }, [])

  const handleDelete = async () => {
    try {
      if (!deleteid) {
        return
      }
      console.log("case/defcase--------", deleteid)
      setIsLoading(true)
      let defId = searchParams?.get("defendantId")
      await axiosInstance.delete(
        `${baseURL}/v1/case/defcasedelete/${defId}/${deleteid}`
      )
      toast({
        variant: "default",
        description: "Case Deleted Successfully",
        style: {
          background: "#03C03C",
        },
      })
      setDeleteIsOpen(false)
      fetchData(currentPage, limitPage)
      setIsLoading(false)
    } catch (error: any) {
      console.log("Error deleting item:", error.message)
    }
  }
  const [expandedNotes, setExpandedNotes] = React.useState<{
    [key: string]: boolean
  }>({})

  const handleToggle = (id: string) => {
    setExpandedNotes((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }))
  }

  return (
    <div className="dark-container relative h-[calc(100vh-127px)] min-w-full bg-white">
      <div className="flex border-b">
        <div className="relative ml-2 h-8">
          <Input
            className="w-58 pl-9 text-xs"
            onChange={handleSearch}
            value={filterValue}
            placeholder="Search Case ID, Case Title"
          />
          <Icons.search className="absolute top-0 ml-2.5  h-8 w-4 text-muted-foreground" />
        </div>

        <div className="relative mb-2 ml-auto flex">
          <div className="mx-2">
            <Sheet
              open={filterIsOpen}
              onOpenChange={(e) => {
                setFilterIsOpen(e)
              }}
            >
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                >
                  <Icons.filter className="h-3.5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="text-start">
                  <SheetTitle className="border-b">Filter</SheetTitle>
                  <SheetDescription className="thin-scrollbar h-[380px] overflow-y-auto overflow-x-hidden">
                    <div className="mt-5 grid grid-cols-2 items-center gap-2">
                      <div>
                        <Label className="text-[0.7rem] font-semibold text-gray-600">
                          Case Title
                        </Label>
                        <Input
                          type="text"
                          className="mt-2 h-8 rounded-lg border py-2 pl-3 text-xs xl:w-full"
                          placeholder="Case Title"
                          value={filterCaseTitle}
                          onChange={(e) => {
                            setFilterCaseTitle(e.target.value)
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-[0.7rem] font-semibold text-gray-600">
                          Case Number
                        </Label>
                        <Input
                          type="text"
                          className="mt-2 h-8 w-28 md:w-[160px] rounded-lg border py-2 pl-3 text-xs"
                          placeholder="Case Number"
                          value={filterCaseNo}
                          onChange={(e) => {
                            setFilterCaseNo(e.target.value)
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 items-center gap-3">
                      <div>
                        <Label className="text-[0.7rem] font-semibold text-gray-600">
                          Case ID
                        </Label>
                        <Input
                          type="text"
                          className=" h-8 rounded-lg border py-2 pl-3 text-xs xl:w-full"
                          placeholder="Case ID"
                          value={filterCaseID}
                          onChange={(e) => {
                            setFilterCaseID(e.target.value)
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-1 items-center gap-3">
                      <div>
                        <Label className="text-[0.7rem] font-semibold text-gray-600">
                          Crime Date
                        </Label>
                        <div>
                          <Popover
                            open={filterCrimeDateIsOpen}
                            onOpenChange={setFilterCrimeDateIsOpen}
                          >
                            <PopoverTrigger
                              asChild
                              disabled={props.hidetext === "View"}
                            >
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "h-8 w-full md:w-[335px] justify-between text-left text-xs font-normal",
                                  !filterCrimeDate && "text-muted-foreground"
                                )}
                              >
                                <div className="flex">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {filterCrimeDate?.length > 0 &&
                                filterCrimeDate[0] &&
                                moment(filterCrimeDate[0]).isValid()
                                  ? convertToUTCDate(filterCrimeDate[0])
                                  : "Pick date range"}{" "}
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
                            <PopoverContent className="thin-scrollbar max-h-50 m-1 w-[420px] overflow-hidden whitespace-nowrap p-0 text-xs text-black">
                              <Calendar
                                defaultView="century"
                                selectRange={true}
                                showDoubleView={true}
                                onChange={(dateFields: any) => {
                                  let startDate = moment(dateFields[0]).format(
                                    "YYYY-MM-DD"
                                  )
                                  let endDate = moment(dateFields[1]).format(
                                    "YYYY-MM-DD"
                                  )
                                  let dateArray = [startDate, endDate]
                                  setFilterCrimeDate(dateArray)
                                  setFilterCrimeDateIsOpen(false)
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 items-center gap-3">
                      <div>
                        <Label className="text-[0.7rem] font-semibold text-gray-600">
                          Case Status
                        </Label>
                        <Select
                          value={filterCaseStatus}
                          onValueChange={(e) => {
                            setFilterCaseStatus(String(e))
                          }}
                        >
                          <SelectTrigger className="h-8 w-full md:w-[335px] text-xs">
                            <SelectValue
                              placeholder="Select Type"
                              className="text-xs"
                            >
                              {filterCaseStatus
                                ? filterCaseStatus
                                : "Select Type"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="h-[300px] overflow-y-auto text-xs dark:bg-slate-900">
                            <SelectGroup>
                              {caseStatusTypeList &&
                                caseStatusTypeList?.map(
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

                    <div className="mt-5 grid grid-cols-1 items-center gap-3">
                      <div className="">
                        <Label className="text-[0.7rem] font-semibold text-gray-600">
                          Co-defendant
                        </Label>
                        <div className="">
                          <CoDefendantCombobox
                            handleChange={getCoDefendant}
                            EditData={coDefendantData}
                            placholderName={"Link Co-defendant"}
                            viewMode={false}
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
                              setFilterCaseTitle("")
                              setFilterCaseNo("")
                              setFilterCrimeDate("")
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
                        onClick={applyFilter}
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

          {!userRoles.includes("VIEWER") && (
            <div className="mr-1">
              <AddDefendantCases
                icon={<Icons.add className="mb-0.5 h-3.5 w-5" />}
                hidetext={"Add"}
                refreshGrid={() => {
                  fetchData(currentPage, limitPage)
                }}
              />
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div
          ref={showfilterRef}
          id="ggg"
          className="ml-1 flex flex-nowrap border-b py-2"
        >
          {filterCaseTitle && (
            <Badge variant="outline" className="mr-2 h-6 rounded-md pl-3 pr-0">
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
                  if (
                    !filterCaseNo ||
                    !filterCrimeDate ||
                    !filterCaseID ||
                    !filterCaseStatus ||
                    !filterCoDefendant
                  ) {
                    setShowFilters(false)
                    setFiltersApplied(false)
                  }
                  fetchData(currentPage, limitPage)
                }}
              />
            </Badge>
          )}

          {filterCaseNo && (
            <Badge variant="outline" className="mr-2 h-6 rounded-md pl-3 pr-0">
              <span className="border-r pr-2 text-[0.65rem] font-normal">
                Case No
              </span>
              <span className="pl-2 text-[0.65rem] font-normal">
                {filterCaseNo}
              </span>
              <Icons.close
                className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilterCaseNo("")
                  if (
                    !filterCaseTitle ||
                    !filterCrimeDate ||
                    !filterCaseID ||
                    !filterCaseStatus ||
                    !filterCoDefendant
                  ) {
                    setShowFilters(false)
                    setFiltersApplied(false)
                  }
                  fetchData(currentPage, limitPage)
                }}
              />
            </Badge>
          )}
          {filterCrimeDate && (
            <Badge variant="outline" className="mr-2 h-6 rounded-md pl-3 pr-0">
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
                  ? convertToUTCDate(filterCrimeDate[0])
                  : ""}
              </span>
              <Icons.close
                className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilterCrimeDate("")
                  if (
                    !filterCaseTitle ||
                    !filterCaseNo ||
                    !filterCaseID ||
                    !filterCaseStatus ||
                    !filterCoDefendant
                  ) {
                    setShowFilters(false)
                    setFiltersApplied(false)
                  }
                  fetchData(currentPage, limitPage)
                }}
              />
            </Badge>
          )}

          {filterCaseID && (
            <Badge variant="outline" className="mr-2 h-6 rounded-md pl-3 pr-0">
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
                  if (
                    !filterCaseTitle ||
                    !filterCaseNo ||
                    !filterCaseTitle ||
                    !filterCaseStatus ||
                    !filterCoDefendant
                  ) {
                    setShowFilters(false)
                    setFiltersApplied(false)
                  }
                  fetchData(currentPage, limitPage)
                }}
              />
            </Badge>
          )}

          {filterCaseStatus && (
            <Badge variant="outline" className="mr-2 h-6 rounded-md pl-3 pr-0">
              <span className="border-r pr-2 text-[0.65rem] font-normal">
                Case Status
              </span>
              <span className="pl-2 text-[0.65rem] font-normal">
                {filterCaseStatus}
              </span>
              <Icons.close
                className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilterCaseStatus("")
                  if (
                    !filterCaseTitle ||
                    !filterCaseNo ||
                    !filterCaseTitle ||
                    !filterCrimeDate ||
                    !filterCoDefendant
                  ) {
                    setShowFilters(false)
                    setFiltersApplied(false)
                  }
                  fetchData(currentPage, limitPage)
                }}
              />
            </Badge>
          )}

          {filterCoDefendant && filterCoDefendant?.length > 0 && (
            <Badge variant="outline" className="mr-2 h-6 rounded-md pl-3 pr-0">
              <span className="border-r pr-2 text-[0.65rem] font-normal">
                Co defendant
              </span>
              <span className="pl-2 text-[0.65rem] font-normal">
                {filterCoDefendant && filterCoDefendant?.length > 0
                  ? filterCoDefendant.join(",")
                  : ""}
              </span>
              <Icons.close
                className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilterCoDefendant([])
                  if (
                    !filterCaseTitle ||
                    !filterCaseNo ||
                    !filterCaseTitle ||
                    !filterCrimeDate ||
                    !filterCaseStatus
                  ) {
                    setShowFilters(false)
                    setFiltersApplied(false)
                  }
                  fetchData(currentPage, limitPage)
                }}
              />
            </Badge>
          )}

          {(filterCaseTitle ||
            filterCaseNo ||
            filterCrimeDate ||
            filterCaseID ||
            filterCaseStatus ||
            filterCoDefendant) && (
            <Button
              variant="link"
              onClick={(e) => {
                setFilterCaseTitle("")
                setFilterCaseNo("")
                setFilterCrimeDate("")
                setFilterCaseID("")
                setFilterCaseStatus("")
                setFilterCoDefendant([])
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
                : "calc(100vh - 13.5rem)",
            }}
            className="thin-scrollbar relative overflow-y-auto p-0"
          >
            {/* <div className="relative thin-scrollbar h-[calc(100vh-14.5rem)] overflow-y-auto  p-0"> */}
            {caseData.length > 0 ? (
              caseData?.map((map_case: any, i: any) => {
                const caseSummary = caseData[i]["caseCaseSummary"]
                const shortSummary =
                  caseSummary && caseSummary.length > 100
                    ? caseSummary.slice(0, 100) + "..."
                    : caseSummary
                const isExpanded = expandedNotes[caseData[i].id] || false
                if (caseData[i] && typeof caseData[i] === "object") {
                  return (
                    <Card
                      key={i}
                      className="container border-0 border-b p-0  py-2 shadow-none"
                    >
                      <div className="flex justify-between text-xs font-semibold">
                        <div className="flex items-center px-0 md:px-4">
                          <h5 className="mr-0 md:mr-1 font-bold capitalize">
                            <Icons.PiBooksInner />
                            {caseData[i]["caseTitle"]}{" "}
                          </h5>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Icons.PiInfo />
                                <TooltipContent
                                  side="top"
                                  className="bg-zinc-950 dark:bg-zinc-50"
                                >
                                  <div className="text-xs text-slate-50 dark:text-slate-950">
                                    Case ID: {caseData[i]["id"]}
                                  </div>
                                </TooltipContent>
                              </TooltipTrigger>
                            </Tooltip>
                          </TooltipProvider>
                          {/* <div>Case Title: {caseData[i]["caseTitle"]}</div> */}
                        </div>
                        <div className="">
                          {!userRoles.includes("VIEWER") && (
                            <div className="grid grid-cols-3 gap-2 p-1 ">
                              <div>
                                <AddCasesDialog
                                  text={"Add"}
                                  defcase={caseData.defendantId}
                                  caseData={caseData[i]}
                                  defId={searchParams?.get("defendantId")}
                                  caseId={caseData[i]["id"]}
                                  refreshGrid={() => {
                                    fetchData(currentPage, limitPage)
                                  }}
                                />
                              </div>
                              <div>
                                <AddDefendantCases
                                  rowdata={caseData[i]}
                                  icon={<Icons.eye className="h-3 w-3 " />}
                                  hidetext={"View"}
                                  refreshGrid={() => {
                                    fetchData(currentPage, limitPage)
                                  }}
                                />
                              </div>
                              <div>
                                <Dialog
                                  open={deleteIsOpen}
                                  onOpenChange={(e) => {
                                    if (e) {
                                      setDeleteId(caseData[i]["id"])
                                      setTimeout(() => {
                                        setDeleteIsOpen(e)
                                      }, 300)
                                    } else {
                                      setDeleteIsOpen(e)
                                    }
                                  }}
                                >
                                  <div>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className="flex h-8 items-center rounded-lg bg-transparent px-4 py-1 text-xs xl:py-1.5"
                                            >
                                              <Icons.trash
                                                className="h-3 w-3"
                                                // onClick={() => {
                                                //   setDeleteId(caseData[i]["id"])
                                                //   setDeleteIsOpen(true)
                                                // }}
                                              />
                                            </Button>
                                          </DialogTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent
                                          side="top"
                                          className="bg-zinc-950 dark:bg-zinc-50"
                                        >
                                          <p className="text-xs text-slate-50 dark:text-slate-950">
                                            Delete case
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <DialogContent className="max-w-[400px] dark:bg-slate-900">
                                      <DialogHeader className="border-b border-inherit ">
                                        <DialogTitle className="mb-2">
                                          Confirm Deletion
                                        </DialogTitle>
                                      </DialogHeader>
                                      <DialogDescription className="py-2 text-sm">
                                        Are you sure you want to delete the
                                        item?
                                      </DialogDescription>
                                      <DialogFooter>
                                        <DialogClose className="text-black-600 pr-6 text-xs">
                                          Cancel
                                        </DialogClose>
                                        <Button
                                          type="submit"
                                          variant="outline"
                                          onClick={() => handleDelete()}
                                          className="h-8 bg-transparent py-3 text-xs"
                                        >
                                          Delete
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </div>
                                </Dialog>
                              </div>
                            </div>
                          )}
                        </div>
                        {userRoles.includes("VIEWER") && (
                          <div className="grid grid-cols-2 gap-2 p-1">
                            <div>
                              <AddCasesDialog
                                text={"Add"}
                                defcase={caseData.defendantId}
                                caseData={caseData[i]}
                                defId={searchParams?.get("defendantId")}
                                caseId={caseData[i]["id"]}
                                refreshGrid={() => {
                                  fetchData(currentPage, limitPage)
                                }}
                              />
                            </div>
                            <div className="">
                              <AddDefendantCases
                                rowdata={caseData[i]}
                                icon={<Icons.eye className="h-3 w-3 " />}
                                hidetext={"View"}
                                refreshGrid={() => {
                                  fetchData(currentPage, limitPage)
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-0 px-4">
                        <div className="my-3 text-xs">
                          <p className="p-0 text-start font-semibold text-gray-500">
                            Crime Description{" "}
                          </p>
                          <p className="text-start">
                            {caseData[i]["caseCrimeDescription"]
                              ? caseData[i]["caseCrimeDescription"]
                              : "-"}
                          </p>
                        </div>

                        <div className="my-3 text-xs">
                          <p className="p-0 text-start font-semibold text-gray-500">
                            Case Summary{" "}
                          </p>
                          <p className="text-left">
                            {caseSummary
                              ? isExpanded
                                ? caseSummary
                                : shortSummary
                              : "-"}
                            {caseSummary && caseSummary.length > 100 && (
                              <span
                                className="ml-1 cursor-pointer text-blue-600 underline"
                                onClick={() => handleToggle(caseData[i].id)}
                              >
                                {isExpanded ? "show less" : "view more"}
                              </span>
                            )}
                          </p>
                        </div>
                      </CardContent>
                      <div className="flex justify-between">
                        <span className="my-3 ml-3.5 align-middle text-xs font-bold text-gray-400">
                          {caseData[i]["linkData"]
                            ? caseData[i]["linkData"]["linkStatus"]
                            : ""}
                        </span>
                        <div className="my-3.5 mr-2 text-xs">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <h5>
                                  {moment(
                                    caseData[i]["caseCrimeDate"]
                                  ).isValid() ? (
                                    <>
                                      <CalendarIcon className="mb-1 mr-1 inline-flex h-4 w-4 text-gray-500" />
                                      {convertToUTCDate(
                                        caseData[i]["caseCrimeDate"]
                                      )}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </h5>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="bg-zinc-950 dark:bg-zinc-50"
                              >
                                <p className="text-xs text-slate-50 dark:text-slate-950">
                                  Crime Date{" "}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        {/* {!userRoles.includes("VIEWER") && (
                          <div className="grid grid-cols-3 divide-x divide-slate-400/25 ">
                            <div>
                              <AddCasesDialog text={"Add"} defcase={caseData.defendantId} caseData={caseData[i]} defId={searchParams?.get("defendantId")} caseId={caseData[i]['id']} />
                            </div>
                            <div>
                              <AddDefendantCases
                                rowdata={caseData[i]}
                                icon={<Icons.eye className="h-3 w-3 " />}
                                hidetext={"View"}
                                refreshGrid={() => {
                                  fetchData(currentPage, limitPage)
                                }}
                              />
                            </div>
                            <div>
                              <Dialog
                                open={deleteIsOpen}
                                onOpenChange={(e)=>{
                                  if(e){
                                    setDeleteId(caseData[i]["id"])
                                    setTimeout(()=>{
                                      setDeleteIsOpen(e);
                                    },300);
                                 }else{
                                      setDeleteIsOpen(e);
                                 }
                                }}
                              >
                                <div>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="h-10 w-12 rounded-none border-none p-1"
                                          >
                                            <Icons.trash
                                              className="h-3 w-3"
                                              // onClick={() => {
                                              //   setDeleteId(caseData[i]["id"])
                                              //   setDeleteIsOpen(true)
                                              // }}
                                            />
                                          </Button>
                                        </DialogTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="top"
                                        className="bg-zinc-950 dark:bg-zinc-50"
                                      >
                                        <p className="text-xs text-slate-50 dark:text-slate-950">
                                          Delete case
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <DialogContent className="max-w-[400px] dark:bg-slate-900">
                                    <DialogHeader className="border-b border-inherit ">
                                      <DialogTitle className="mb-2">
                                        Confirm Deletion
                                      </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription className="py-2 text-sm">
                                      Are you sure you want to delete the item?
                                    </DialogDescription>
                                    <DialogFooter>
                                      <DialogClose className="text-black-600 pr-6 text-xs">
                                        Cancel
                                      </DialogClose>
                                      <Button
                                        type="submit"
                                        variant="outline"
                                        onClick={() => handleDelete()}
                                        className="h-8 bg-transparent py-3 text-xs"
                                      >
                                        Delete
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </div>
                              </Dialog>
                            </div>
                          </div>
                        )} */}
                      </div>
                    </Card>
                  )
                }
              })
            ) : (
              <div className="mr-2 mt-16">
                <div className="flex items-center justify-center">
                  <Icons.ic_outline_post_add />
                </div>
                <h5 className="text-center text-xs tracking-wide">
                  Add your first case
                </h5>
                <p className="text-center text-xs tracking-wide text-muted-foreground">
                  There are no case detail with this record
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {caseData.length > 0 ? (
        <div className="absolute bottom-0 left-0 mx-2 w-full  rounded-b-lg border-t border-inherit bg-inherit">
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
      ) : (
        <div></div>
      )}
    </div>
  )
}
