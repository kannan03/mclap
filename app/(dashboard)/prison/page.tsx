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
import { getSession } from "next-auth/react";
import { useRef } from "react"

export default function Prsion() {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const [isLoading, setIsLoading] = React.useState(true)
  const prisonButtonRef = useRef<HTMLButtonElement>(null);
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
  const [showFilters, setShowFilters] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [isOpen1, setIsOpen1] = React.useState(false)
  const [isTheme, setIsTheme] = React.useState(false)
  const [deleteids, setDeleteIds] = React.useState<any>([])
  const [prisonData, setPrisonData] = React.useState<any[]>([])
  const searchParams = useSearchParams()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [selectedRows, setSelectedRows] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [columns, setColumns] = React.useState([
    {
      accessorKey: "id",
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "prisonName",
      header: "Name",
      show: true,
    },
    {
      accessorKey: "prisonAddress",
      header: "Address",
      show: true,
    },
    {
      accessorKey: "prisonState",
      header: "State",
      show: true,
    },
    {
      accessorKey: "prisonCity",
      header: "City",
      show: true,
    },
    {
      accessorKey: "prisonZip",
      header: "Zip Code",
      show: true,
    },
    {
      accessorKey: "action",
      header: "",
      show: true,
    },
  ])

  const table = useReactTable({
    data: prisonData,
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
      if( filterValue){
        filterSearch(filterValue, updatePage, limitPage)
      }else{
        fetchData(updatePage, limitPage)
      }

    } catch (err) {}
  }
  const NextPage = () => {
    try {
      let updatePage = currentPage + 1
      setCurrentpage(updatePage)
      if( filterValue){
        filterSearch(filterValue, updatePage, limitPage)
      }else{
        fetchData(updatePage, limitPage)
      }

    } catch (err) {}
  }
  const LimitPerPage = (limitValue: any) => {
    setLimitPage(limitValue)
    if( filterValue){
      filterSearch(filterValue, 1, limitValue)
    }else{
      fetchData(1, limitValue)
    }
  }
  const filterSearch = async (Value: any, updatePage: any, updateLimit: any) => {
    setIsLoading(true)
    let url = `${baseURL}/v1/prisons?filter=${Value}&page=${updatePage}&limit=${updateLimit}`
    const response = await axiosInstance.get(url)
    let listData = response?.data?.data?.rows ? response?.data?.data?.rows : []
    let modified = listData.map((map_ele: any) => {
      map_ele.check = false
      return map_ele
    })
    setPrisonData(modified)
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
        filterSearch(Value,currentPage,limitPage)
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
      const response = await axiosInstance.get(
        `${baseURL}/v1/prisons?page=${updatePage}&limit=${updateLimit}`
      )
      let listData = response?.data?.data?.rows
        ? response?.data?.data?.rows
        : []
      let modified = listData.map((map_ele: any) => {
        map_ele.check = false
        return map_ele
      })
      setPrisonData(modified)
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
      const session = await getSession();
      setUserRoles(session?.user?.roles || []);
    };
  
    fetchUserRoles();
  }, [])

  const handleDelete = async (id: any) => {
    try {
      if (!id) {
        return
      }
      setIsLoading(true)
      await axiosInstance.delete(`${baseURL}/v1/prisons/${id}`)
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

  return (
    <div className="overscroll-y-none px-2 pb-1 pt-2">
      <div className="dark-container relative h-[calc(100vh-72px)] rounded-lg border bg-white p-2">
        <div className="flex">
          <h2 className="text-l ml-2 mt-0.5 font-bold">Prisons</h2>
          <div className="relative ml-5 h-8">
            <Input
              className="w-36 md:w-44 pl-9 text-xs"
              onChange={handleSearch}
              value={filterValue}
              placeholder="Search"
            />
            <Icons.search className="absolute top-0 ml-2.5  h-8 w-4 text-muted-foreground" />
          </div>
          
            <div className="hidden">
          <AddPrisonAlert
            ref={prisonButtonRef}
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

          <div className="relative mb-2 ml-auto flex">
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
            {/* <div className="mx-2">
            </div> */}
            {!userRoles.includes("VIEWER") && (
            <AddPrisonAlert
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
        {isLoading && (
          <div className="h-[calc(100vh-9.5rem)]">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20">
              <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-red-700" />
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="thin-scrollbar fixed-child-table relative h-[calc(100vh-10.65rem)] overflow-y-auto border-t">
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
                                if (prisonButtonRef.current) {
                                  setViewRowData(cell.row.original);
                                  setTimeout(() => {
                                    prisonButtonRef.current?.click();
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
                                        let findObj = prisonData.find(
                                          (find_ele: any) => find_ele?.id == ID
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
                                <div className="" onClick={(e) => e.stopPropagation()}>
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
                                              Are you sure you want to delete ?
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
