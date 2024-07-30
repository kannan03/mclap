"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Label } from "@radix-ui/react-label"
import moment from "moment"
import { convertToUTCDate } from "@/lib/utils"
import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { Button } from "../ui/button"
// import { AddCasesDialog } from "./add-edit-casepage-dialog"
// import { AddDefendantCases } from "./add-edit-defendantCasePage"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { getSession } from "next-auth/react";
import { AddDefendantNotesDialog } from "@/components/notes/add-edit-defendantNotes"

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
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Timeline, TimelineContent, TimelineDot, TimelineHeading, TimelineItem, TimelineLine } from "../ui/timeline"

export default function DefendantNotesPage(props: any) {
  const searchParams = useSearchParams()
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [noteData, setNoteData] = React.useState<any>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentPage, setCurrentpage] = React.useState<number>(1)
  const [limitPage, setLimitPage] = React.useState<any>("25")
  const [totalPage, setTotalPage] = React.useState<number>(1)
  const [totalItems, setTotalItems] = React.useState<number>(0)
  const [filterValue, setFilterValue] = React.useState<any>("")
  const [timer, setTimer] = React.useState(null)
  const [deleteIsOpen, setDeleteIsOpen] = React.useState<any>(false);
  const [eventLogId, setEventLogId] = React.useState<any>("")

  const [deleteEnable, setDeleteEnable] = React.useState<any>(false)
  const [hoveredItem, setHoveredItem] = React.useState(null);
  const [filterHeight, setFilterHeight] = React.useState<any>("")
  const [filterIsOpen, setFilterIsOpen] = React.useState<any>(false)
  const [filtersApplied, setFiltersApplied] = React.useState(false)
  const [showFilters, setShowFilters] = React.useState(false)
  const [filterInitial, setFilterInitial] = React.useState<any>("")
  const [filterEventType, setFilterEventType] = React.useState<any>("")
  const [eventTypeList, setEventTypeList] = React.useState<any>([]);

  const applyFilter = async () => {
    setTimeout(() => {
      let divElement: any = showfilterRef.current
      let elemRect = divElement?.getBoundingClientRect()

      let elemHeight = Math.ceil(Number(elemRect?.height ? elemRect?.height : 0) + 100)
      console.log(`${elemHeight}px`, "kkkk")
      setFilterHeight(`${elemHeight}px`)
    }, 3000)
    setFilterIsOpen(false)
    setFiltersApplied(true)
    setShowFilters(true)
    let defId = searchParams?.get("defendantId")
    const response = await axiosInstance.get(
      `${baseURL}/v1/eventlog/defnotes/${defId}?eventType=${filterEventType}&Initial=${filterInitial}&page=1&limit=${limitPage}`
    )
    let listData = response?.data?.data?.rows
      ? response?.data?.data?.rows
      : []
    setCurrentpage(1)
    setNoteData(listData)
    setTotalPage(
      response?.data?.data?.totalPages
        ? response?.data?.data?.totalPages
        : 0
    )
    setTotalItems(
      response?.data?.data?.totalItems
        ? response?.data?.data?.totalItems
        : 0
    )

  }
  const showfilterRef = React.useRef(null)
  const showtableRef = React.useRef(null)

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
    } catch (err) { }
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
    } catch (err) { }
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
    let url = `${baseURL}/v1/eventlog/defnotes/${defId}?filter=${Value}&page=1&limit=${limitPage}`
    const response = await axiosInstance.get(url)
    let listData = response?.data?.data?.rows ? response?.data?.data?.rows : []
    setNoteData(listData)
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
        `${baseURL}/v1/eventlog/defnotes/${defId}?page=${updatePage}&limit=${updateLimit}`
      )
      let listData = response?.data?.data?.rows
        ? response?.data?.data?.rows
        : []
      setNoteData(listData)
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

  const [expandedNotes, setExpandedNotes] = React.useState<{ [key: string]: boolean }>({});

  const handleToggle = (id: string) => {
    setExpandedNotes(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleMouseEnter = (item: any) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

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
    const intialFecthData = async () => {
      fetchData(currentPage, limitPage)
    }
    intialFecthData()
    const fetchUserRoles = async () => {
      const session = await getSession();
      setUserRoles(session?.user?.roles || []);
    };

    const fetchCode = async () => {
      const eventList = await axiosInstance.get(baseURL + "/v1/codes/codeType/Event Type");
      if (eventList?.data?.data) {
        setEventTypeList(eventList?.data?.data)
      }
    }

    fetchUserRoles();
    fetchCode();
  }, [])

  const handleDelete = async () => {
    try {
      if (!eventLogId) {
        return;
      }
      setIsLoading(true)
      await axiosInstance.delete(
        `${baseURL}/v1/eventlog/${eventLogId}`
      )
      toast({
        variant: "default",
        description: "Note/Event deleted successfully",
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

  return (
    <div className="relative dark-container min-w-full bg-white h-[calc(100vh-127px)]">
      <div className="flex border-b">
        <div className="relative ml-2 h-8">
          <Input
            className="pl-9 text-xs w-44"
            onChange={handleSearch}
            value={filterValue}
            placeholder="Search"
          />
          <Icons.search className="absolute ml-2.5 top-0  h-8 w-4 text-muted-foreground" />
        </div>

        <div className="relative mb-2 ml-auto flex mr-1">

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
                  <SheetDescription>
                    <div className="mt-5 grid grid-cols-1 items-center gap-2">
                      <div>
                        <Label className="text-[0.7rem] font-semibold text-gray-600">Event Type</Label>
                        <div className="">
                          <Popover
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full md:w-[335px] h-8 text-xs justify-between"
                              >
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
                                          setFilterEventType(framework.codeCode)
                                        }}
                                      >
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

                    </div>

                    <div className="mt-4 grid grid-cols-1 items-center gap-2">
                      <div>
                        <Label className="text-[0.7rem] font-semibold text-gray-600">
                          Initial
                        </Label>
                        <Input
                          type="text"
                          className="h-8 rounded-lg border py-2 pl-3 text-xs w-full"
                          placeholder="Initial"
                          value={filterInitial}
                          onChange={(e) => {
                            setFilterInitial(e.target.value)
                          }}
                        />
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
                                setFilterEventType("")
                                setFilterInitial("")
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
            <AddDefendantNotesDialog
              icon={<Icons.add className="mb-0.5 h-3.5 w-5" />}
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
          id="ggg"
          className="flex flex-nowrap border-b ml-1 py-2"
        >
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
                  if (
                    !filterInitial
                  ) {
                    setShowFilters(false)
                    setFiltersApplied(false)
                  }
                  fetchData(currentPage, limitPage)
                }}
              />
            </Badge>
          )}

          {filterInitial && (
            <Badge
              variant="outline"
              className="mr-2 h-6 rounded-md pl-3 pr-0"
            >
              <span className="border-r pr-2 text-[0.65rem] font-normal">
                Initial
              </span>
              <span className="pl-2 text-[0.65rem] font-normal">
                {filterInitial}
              </span>
              <Icons.close
                className="ml-3 mr-1 h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilterInitial("")
                  if (
                    !filterEventType
                  ) {
                    setShowFilters(false)
                    setFiltersApplied(false)
                  }
                  fetchData(currentPage, limitPage)
                }}
              />
            </Badge>
          )}

          {(filterEventType || filterInitial
          ) && (
              <Button
                variant="link"
                onClick={(e) => {
                  setFilterEventType("")
                  setFilterInitial("")
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
                : "calc(100vh - 14rem)",
            }}
            className="relative thin-scrollbar ml-2 overflow-y-auto p-0 mt-1.5">
            {noteData.length > 0 ?
              noteData?.map((map_notes: any, i: any) => {
                if (noteData[i] && typeof noteData[i] === "object") {
                  const note = noteData[i]["logNotes"];
                  const shortSummary = note && note.length > 100 ? note.slice(0, 100) + "..." : note;
                  const isExpanded = expandedNotes[noteData[i].id] || false;
                  const isLastItem = i === noteData.length - 1;

                  return (
                    <div className="" >
                      <Timeline>
                        <TimelineItem key={i} status="done" onMouseEnter={() => handleMouseEnter(noteData[i])}
                          onMouseLeave={handleMouseLeave}>
                          <TimelineHeading className="">
                            <div className="inline-flex items-center">
                              <h5 className="text-xs text-black dark:text-white font-semibold">{noteData[i]["logEventType"]}</h5>
                              <div className="">
                                <p className="text-[0.625rem] ml-4 mt-1 text-gray-500">
                                  <CalendarIcon className="mr-1 mb-1 h-3 w-3 inline-flex text-gray-500" />
                                  {noteData[i]["logActionDate"] && moment(noteData[i]["logActionDate"]).isValid() ? convertToUTCDate(noteData[i]["logActionDate"]) : ''}
                                </p>
                              </div>
                              {!userRoles.includes("VIEWER") && hoveredItem === noteData[i] && (
                                <div className="absolute right-0">
                                  <div className="grid grid-cols-2 divide-x divide-slate-400/25 m-1">
                                    <div>
                                      <AddDefendantNotesDialog
                                        rowdata={noteData[i]}
                                        icon={<Icons.pencil className="h-3 w-3 text-gray-500" />}
                                        hidetext={"Edit"}
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
                                            setEventLogId(noteData[i]["id"]);
                                            setTimeout(() => {
                                              setDeleteIsOpen(e);
                                            }, 300);
                                          } else {
                                            setDeleteIsOpen(e);
                                          }
                                        }}
                                      >
                                        <div>
                                          {/* <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild> */}
                                                <DialogTrigger asChild>
                                                  <Button
                                                    variant="outline"
                                                    className="h-8 w-10 rounded-none border-none hover:bg-transparent p-1"
                                                  >
                                                    <Icons.trash
                                                      className="h-3 w-3 text-gray-500"
                                                    />
                                                  </Button>
                                                </DialogTrigger>
                                              {/* </TooltipTrigger>
                                              <TooltipContent
                                                side="top"
                                                className="bg-zinc-950 dark:bg-zinc-50"
                                              >
                                                <p className="text-xs text-slate-50 dark:text-slate-950">
                                                  Delete notes
                                                </p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider> */}
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
                                </div>
                              )}
                            </div>
                          </TimelineHeading>
                          <TimelineDot className="w-3 h-3 bg-inherit border-4 border-gray-600" status="done" />
                          <TimelineContent className=" text-xs">
                            <div>
                              <div>
                                <p className="mt-2 mr-10 inline-flex items-center">
                                  <Icons.PiBooksInner /> <span className="mb-0.5 text-black dark:text-white">{noteData[i]["cases"] ? noteData[i]["cases"]["caseTitle"] : ""}</span>
                                </p>

                                <div className=" inline-flex">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        {noteData[i]["logInitials"] && (
                                          <>
                                            <p className="mt-2 inline-flex uppercase"><Icons.PiUserCircle /><span className="text-black dark:text-white">{noteData[i]["logInitials"]}</span></p>
                                          </>
                                        )}

                                        <TooltipContent side="top"
                                          className="bg-zinc-950 dark:bg-zinc-50">

                                          <p className="text-xs text-slate-50 dark:text-slate-950">Initial</p>
                                        </TooltipContent>
                                      </TooltipTrigger>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            </div>
                            <div className="inline-flex mt-2">
                              <div>
                                <Icons.PiNotes />
                              </div>
                              <div>
                                <p className="font-normal text-black dark:text-white">
                                  {note ? (isExpanded ? note : shortSummary) : "-"}
                                  {note && note.length > 100 && (
                                    <span
                                      className="text-blue-600 cursor-pointer underline ml-1"
                                      onClick={() => handleToggle(noteData[i].id)}
                                    >
                                      {isExpanded ? "show less" : "view more"}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </TimelineContent>
                          {isLastItem ? null : <TimelineLine done className="w-[1px]" />}
                        </TimelineItem>
                      </Timeline>
                    </div>
                  )
                }
              }) : <div className="mt-[72px]">
                <div className="flex justify-center items-center">
                  <Icons.ic_outline_post_add />
                </div>
                <h2 className="text-center text-xs tracking-wide">Add your first note/event</h2>
                <p className="text-center text-muted-foreground text-xs tracking-wide">There are no note/event details with this record</p>
              </div>}
          </div>
        </>
      )}
      {noteData.length > 0 ? (
        <div className="absolute left-0 mx-2 w-full bottom-0  border-t border-inherit rounded-br-lg rounded-bl-lg bg-inherit">
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
      ) : <div></div>}
    </div>
  )
}
