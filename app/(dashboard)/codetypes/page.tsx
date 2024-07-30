"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { CustomActionToast } from "@/components/utils/custom-action-toast"
import { getSession } from "next-auth/react";
import { useRef } from "react"
import AddCodeTypessDialog from "@/components/codeTypes/addCodeTypesDialog"

export default function CodeTypes() {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const codeButtonRef = useRef<HTMLButtonElement>(null);
  const [userRoles, setUserRoles] = React.useState<string[]>([])
  const [viewRowData, setViewRowData] = React.useState(null)  
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentPage, setCurrentpage] = React.useState<number>(1)
  const [limitPage, setLimitPage] = React.useState<any>("10")
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
  const [codesData, setCodesData] = React.useState([])
  const searchParams = useSearchParams()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [selectedRows, setSelectedRows] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [codeType, setCodeType] = React.useState([])
  const [columns, setColumns] = React.useState([
    // {
    //   accessorKey: "id",
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "codeType",
      header: "Code Type",
      show: true,
    },
    {
      accessorKey: "action",
      header: "",
      show: true,
    },
  ])

  const table = useReactTable({
    data: codesData,
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
  const filterSearch = async (searchValue: any, filterType: any) => {
    setIsLoading(true)
    let url = `${baseURL}/v1/codeType?filter=${searchValue}&page=10&limit=100`
    // let url
    // if (filterType == "dropdown") {
    //   url = `${baseURL}/v1/codes?type=${searchValue}&page=10&limit=100`
    // } else {
    //   url = `${baseURL}/v1/codeType?filter=${searchValue}&page=10&limit=100`
    // }
    const response = await axiosInstance.get(url)
    let listData = response?.data ? response?.data?.data : []
    let modified = listData.map((map_ele: any) => {
      map_ele.check = false
      return map_ele
    })
    let collectionBoxes = document.querySelectorAll(".mycheckbox")
    collectionBoxes.forEach((checkbox: any) => {
      checkbox.checked = false
    })
    setCodesData(modified)
    setDeleteEnable(true)
    setEditEnable(true)
    setDeleteIds([])
    setEditObj("")
    setIsLoading(false)
  }

  const [filterValue, setFilterValue] = React.useState<any>("")
  const [filterSelectValue, setFilterSelectValue] = React.useState<any>("")

  const CodesTypeData = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(baseURL + "/v1/codes/codeType")
      const stateValue = response?.data?.data

      setCodeType(stateValue)
      setIsLoading(false)
      // if (stateValue !== null && stateValue !== undefined && stateValue.length > 0) {
      //   sessionStorage.setItem("CodeTypeData", JSON.stringify(stateValue));
      // }
    } catch (error: any) {
      console.log(error.message)
    }
  }

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

    const response = await axiosInstance.get(`${baseURL}/v1/codeType`)  
    let data = response?.data ? response?.data?.data : []
    setCodesData(data)
    if (
      !totalItems ||
      updateLimit != limitPage ||
      (response?.data?.data?.totalItems &&
        totalItems != response?.data?.data?.totalItems)
    ) {
      let page: any = searchParams?.get("page") ? searchParams?.get("page") : 1
      setCurrentpage(page)
      setTotalPage(
        response?.data?.data?.totalPages ? response?.data?.data?.totalPages : 1
      )
      setTotalItems(
        response?.data?.data?.totalItems ? response?.data?.data?.totalItems : 0
      )
    }
    setIsLoading(false)
  }

  const deleteCodesData = async (delType: any) => {
    try {
   
      setIsLoading(true)
      let url = `${baseURL}/v1/codetype/${delType}`
      const response = await axiosInstance.delete(url)
      toast({
        variant: "default",
        description: "Code Type deleted successfully",
        style: {
          background: "#03C03C",
        },
      })
      // fetchData(currentPage,limitPage)
      // setIsOpen(false);
      table?.toggleAllPageRowsSelected(false)
      fetchData(currentPage, limitPage)
      setSelectedRows([])
      setIsOpen(false)
      setIsOpen1(false)
    } catch (error: any) {
      console.log("Error deleting item:", error.message)
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
    CodesTypeData()
    InitaialFecthData()
  }, [])

  const handleSearch = async (event: any) => {
    setFilterSelectValue("")

    let searchValue = event.target.value
    setFilterValue(searchValue)
    clearTimeout(timer)
    const newTimer = setTimeout(() => {
      if (searchValue) {
        filterSearch(searchValue, "search")
      } else {
        fetchData(1, limitPage)
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
    const fetchUserRoles = async () => {
      const session = await getSession();
      setUserRoles(session?.user?.roles || []);
    };
  
    fetchUserRoles();
    InitaialFecthData()
    fetchContactType()
  }, [])

  const [showColumnIsOpen, setShowColumnIsOpen] = React.useState(false)
  const [conactTypeList, setContactTypeList] = React.useState<any>([])

  const fetchContactType = async () => {
    try {
      let params = "Contact Type"
      const response = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/${params}`
      )
      const resp = response?.data?.data
      setContactTypeList(resp)
    } catch (error) {}
  }

  function handleSelectedRows(selectedRows: any) {
    setSelectedRows(selectedRows)
  }

  // function DeleteButton() {
  //   return (
  //     <Dialog open={isOpen} onOpenChange={setIsOpen}>
  //       <div className="ml-1">
  //         <DialogTrigger asChild>
  //           <Button
  //             disabled={deleteEnable}
  //             variant="outline"
  //             className="flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
  //           >
  //             <Icons.trash className="mb-1 h-3.5 w-5" /> Delete
  //           </Button>
  //         </DialogTrigger>
  //         <DialogContent className="max-w-[400px] dark:bg-slate-900">
  //           <DialogHeader className="border-b border-inherit ">
  //             <DialogTitle className="mb-2">Confirm Deletion</DialogTitle>
  //           </DialogHeader>
  //           <DialogDescription className="py-2 text-sm">
  //             Are you sure you want to delete {deleteids.length}{" "}
  //             {deleteids.length === 1 ? "item" : "items"}?
  //           </DialogDescription>
  //           <DialogFooter>
  //             <DialogClose className="text-black-600 pr-6 text-xs">
  //               Cancel
  //             </DialogClose>
  //             <Button
  //               type="submit"
  //               variant="outline"
  //               onClick={() => deleteCodesData(deleteids)}
  //               className="h-8 bg-transparent py-3 text-xs"
  //             >
  //               Delete
  //             </Button>
  //           </DialogFooter>
  //         </DialogContent>
  //       </div>
  //     </Dialog>
  //   )
  // }

  return (
    <div className="overscroll-y-none px-2 pb-1 pt-2">
      <div className="dark-container relative h-[calc(100vh-72px)] rounded-lg border bg-white p-2">
        <div className="flex">
          <h2 className="text-l mx-1 mt-0.5 font-bold">Code Types</h2>
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
          <AddCodeTypessDialog
            ref={codeButtonRef}
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
            {/* <div className="mx-2">
              <Sheet
                open={showColumnIsOpen}
                onOpenChange={(e) => {
                  setShowColumnIsOpen(e)
                }}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="py- flex h-8 items-center rounded-lg bg-transparent px-3.5 text-xs xl:py-3">
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
            </div> */}
            {!userRoles.includes("VIEWER") && (
            <AddCodeTypessDialog
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
            <div className="thin-scrollbar fixed-child-table relative h-[calc(100vh-9.5rem)] overflow-y-auto border-t">
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
                               {header.isPlaceholder ? null : (
                              <div className="flex items-center">
                                {header.column.id === "id" ? (
                                  <div className="" onClick={(e) => e.stopPropagation()}>
                                    {!userRoles.includes("VIEWER") && (
                                    <Checkbox
                                      checked={
                                        table.getIsAllPageRowsSelected()
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
                        // style={{ cursor: "pointer" }}
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
                                        let findObj = codesData.find(
                                          (find_ele: any) => find_ele?.id == ID
                                        )
                                        setEditObj(findObj)
                                        // toast({
                                        //   variant: "default",
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
                                    <PopoverTrigger className="h-8 w-8 px-2.5">
                                      <Icons.verticalDots className="fixed cursor-pointer" />
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="ml-2 flex h-8 w-auto items-center rounded-lg p-0"
                                      align="center"
                                      side="left"
                                    >
                                      <div className="flex flex-nowrap">
                                        <AddCodeTypessDialog
                                          text="Edit"
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
                                        <Dialog
                                          open={isOpen1}
                                          onOpenChange={setIsOpen1}
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
                                                className="h-8 bg-transparent py-3 text-xs"
                                                onClick={() =>
                                                  deleteCodesData(
                                                    cell.row.original.codeType
                                                  )
                                                }
                                              >
                                                Delete
                                              </Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>{" "}
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
      </div>
      {/* {selectedRows.length > 0 && (
        <div>
          <CustomActionToast
            selectedRows={selectedRows}
            action={
              <>
                <div className="flex items-center">
                  <div className="m-3">
                    {selectedRows?.length > 0 && selectedRows?.length <= 1 && (
                      <AddCodeTypessDialog
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
      )} */}
    </div>
  )
}
