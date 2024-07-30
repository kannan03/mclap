"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { ContactSchema } from "@/lib/validations/home/contact"
import { Button } from "@/components/ui/button"
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

import { toast } from "../ui/use-toast"
import "react-calendar/dist/Calendar.css"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import FilterArticle36Dialog from "./specific-defendant-case-dialog/filter-spc-article36"
import FilterClemencyDialog from "./specific-defendant-case-dialog/filter-spc-clemency"
import FilterConsulateDialog from "./specific-defendant-case-dialog/filter-spc-consulate"
import FilterDiplomaticInterventionDialog from "./specific-defendant-case-dialog/filter-spc-diplomaticIntervention"
import FilterGeneralCaseDialog from "./specific-defendant-case-dialog/filter-spc-general"
import FilterOutcomeDialog from "./specific-defendant-case-dialog/filter-spc-outcome"
import FilterPleadingsCaseDialog from "./specific-defendant-case-dialog/filter-spc-pleading"
import FilterProgramDialog from "./specific-defendant-case-dialog/filter-spc-program"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FormData = z.infer<typeof ContactSchema>

export function CaseDialogFilter(props: any) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ContactSchema),
  })
  const [isOpen, setIsOpen] = React.useState(false)
  const [date, setDate] = React.useState<any>(null)
  const [dateIsOpen, setDateIsOpen] = React.useState(false)
  const [phoneJson, setPhoneJson] = React.useState<any>([
    { phoneNumber: "", type: "mobile", is_primary: 1, extension: "" },
  ])
  const [activeTab, setActiveTab] = React.useState("general")
  const [phoneError, setPhoneError] = React.useState(false)
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

  const [conactTypeList, setContactTypeList] = React.useState<any>([])
  const [defData, setDefData] = React.useState<any>([])

  const fetchData = async () => {
    try {
      let params = "Contact Type"
      const response = await axiosInstance.get(
        `${baseURL}/v1/codes/codeType/${params}`
      )
      const resp = response?.data?.data
      setContactTypeList(resp)
    } catch (error) {}
  }
  React.useEffect(() => {
    if (isOpen) {
      reset()
      fetchData()
      setValue("conCountry", "")
      setValue("conCity", "")
      setValue("conState", "")

      setPhoneJson([
        { phoneNumber: "", type: "mobile", is_primary: 1, extension: "" },
      ])
      setDate(null)
    }
    // popup close
    // if( !isOpen){
    //   try{
    //     props?.refreshGrid();
    //   }catch(err){}
    // }
  }, [isOpen])

  const [country, setCountry] = React.useState(
    props?.rowdata ? props?.rowdata?.conCountry : "USA"
  )
  const [state, setState] = React.useState("")
  const [city, setCity] = React.useState("")

  const [applyFilterObject, setApplyFilterObject] = React.useState<any>(props?.applyFilterData);  
  const [clearFilter, setClearFilter] = React.useState<any>(false)
  const setStateValue = (value: any) => {
    setState(value)
    setValue("conState", String(value), { shouldValidate: true })
    setCity("")
  }
  const setCityValue = (value: any) => {
    setCity(value)
    setValue("conCity", String(value), { shouldValidate: true })
  }
  //date picker
  const [dateFiledIsOpen, setDateFiledIsOpen] = React.useState(false)
  const [dateFiled, setDateFiled] = React.useState<any>(null)
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(openValue) => {
        setIsOpen(openValue)
      }}
    >
      <TooltipProvider>
        {props.text === "filter" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="link">Advanced Filters</Button>
              </DialogTrigger>
            </TooltipTrigger>
          </Tooltip>
        )}
        {props.text === "appliedFilter" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="ghost" className="pr-2 text-[0.65rem] font-normal h-6 hover:bg-transparent hover:text-inherit">Advanced Filter Applied</Button>
              </DialogTrigger>
            </TooltipTrigger>
          </Tooltip>
        )}
      </TooltipProvider>
      <div>
        <DialogContent className="fixed z-50 grid max-h-[95%] max-w-[60rem] p-0 pt-2 dark:bg-slate-900 xl:w-full">
          <div className="flex flex-col">
            <div>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full "
              >
                <DialogHeader className="border-b border-inherit">
                <div className="flex mx-3 mt-2 items-center">
                    <h5 className="text-sm font-medium">
                      Advanced Filters
                      {/* <HoverCard>
                        <HoverCardTrigger>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="text-xs"
                          style={{ marginLeft: "60px" }}
                        >
                        </HoverCardContent>
                      </HoverCard> */}
                    </h5>
                    {/* { applyFilterObject &&  (
                                          <div className="">
                                          <Button
                                            variant="link"
                                            onClick={(e) => {
                                              e.preventDefault()
                                              setClearFilter(true)
                                            }}
                                            className="text-black-700 items-center px-2 py-1 text-xs hover:underline"
                                          >
                                            <Icons.close className="mr-1 h-3 w-3" />
                                            Clear Avanced Filters
                                          </Button>
                                </div>              
                    )} */}
                  </div>

                  <div className="flex justify-between">
                  <div className="block md:hidden">
                  <Select onValueChange={setActiveTab} >
                        <SelectTrigger className="w-[180px] text-xs mx-1.5 my-1">
                          <SelectValue placeholder="General" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-900" >
                          <SelectItem value="general" className="text-xs">General</SelectItem>
                          <SelectItem value="pleadings" className="text-xs">Pleadings</SelectItem>
                          <SelectItem value="article36" className="text-xs">Article 36</SelectItem>
                          <SelectItem value="consulate" className="text-xs">Consulate</SelectItem>
                          <SelectItem value="program" className="text-xs">Program</SelectItem>
                          <SelectItem value="outcome" className="text-xs">Outcome</SelectItem>
                          <SelectItem value="clemency" className="text-xs">Clemency</SelectItem>
                          <SelectItem value="diplomaticIntervention" className="text-xs">Diplomatic Intervention</SelectItem>
                         </SelectContent>
                      </Select>
                        </div>
                    <TabsList className="h-9 bg-white p-0 dark:bg-inherit hidden md:block">
                      <TabsTrigger
                        value="general"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${
                          activeTab === "general"
                            ? "h-full rounded-none border-b-2 border-solid border-red-500 font-bold"
                            : ""
                        }  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        General
                      </TabsTrigger>
                      <TabsTrigger
                        value="pleadings"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${
                          activeTab === "pleadings"
                            ? "h-full rounded-none border-b-2 border-solid border-red-500 font-bold"
                            : ""
                        }  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Pleadings
                      </TabsTrigger>
                      <TabsTrigger
                        value="article36"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${
                          activeTab === "article36"
                            ? "h-full rounded-none border-b-2 border-solid border-red-500 font-bold"
                            : ""
                        }  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Article 36
                      </TabsTrigger>
                      <TabsTrigger
                        value="consulate"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${
                          activeTab === "consulate"
                            ? "h-full rounded-none border-b-2 border-solid border-red-500 font-bold"
                            : ""
                        }  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Consulate
                      </TabsTrigger>
                      <TabsTrigger
                        value="program"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${
                          activeTab === "program"
                            ? "h-full rounded-none border-b-2 border-solid border-red-500 font-bold"
                            : ""
                        }  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Program
                      </TabsTrigger>
                      <TabsTrigger
                        value="outcome"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${
                          activeTab === "outcome"
                            ? "h-full rounded-none border-b-2 border-solid border-red-500 font-bold"
                            : ""
                        }  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Outcome
                      </TabsTrigger>
                      <TabsTrigger
                        value="clemency"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${
                          activeTab === "clemency"
                            ? "h-full rounded-none border-b-2 border-solid border-red-500 font-bold"
                            : ""
                        }  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Clemency
                      </TabsTrigger>
                      <TabsTrigger
                        value="diplomaticIntervention"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${
                          activeTab === "diplomaticIntervention"
                            ? "h-full rounded-none border-b-2 border-solid border-red-500 font-bold"
                            : ""
                        }  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Diplomatic Intervention
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </DialogHeader>
                <TabsContent value="general">
                  {" "}
                  <FilterGeneralCaseDialog
                    applyData = { props?.applyFilterData}
                    closeFilter={(filterData: any) => {
                      setIsOpen(false)
                      props?.closeCase(filterData)
                    }}
                  />{" "}
                </TabsContent>
                <TabsContent value="pleadings">
                  {" "}
                  <FilterPleadingsCaseDialog
                    applyData = { props?.applyFilterData}
                    closeFilter={(filterData: any) => {
                      setIsOpen(false)
                      props?.closeCase(filterData)
                    }}
                  />{" "}
                </TabsContent>
                <TabsContent value="article36">
                  <FilterArticle36Dialog
                    applyData = { props?.applyFilterData}
                    closeFilter={(filterData: any) => {
                      setIsOpen(false)
                      props?.closeCase(filterData)
                    }}
                  />
                </TabsContent>
                <TabsContent value="consulate">
                  <FilterConsulateDialog
                    applyData = { props?.applyFilterData}
                    closeFilter={(filterData: any) => {
                      setIsOpen(false)
                      props?.closeCase(filterData)
                    }}
                  />
                </TabsContent>
                <TabsContent value="program">
                  <FilterProgramDialog
                    applyData = { props?.applyFilterData}
                    closeFilter={(filterData: any) => {
                      setIsOpen(false)
                      props?.closeCase(filterData)
                    }}
                  />
                </TabsContent>
                <TabsContent value="outcome">
                  {" "}
                  <FilterOutcomeDialog
                    applyData = { props?.applyFilterData}
                    closeFilter={(filterData: any) => {
                      setIsOpen(false)
                      props?.closeCase(filterData)
                    }}
                  />
                </TabsContent>
                <TabsContent value="clemency">
                  <FilterClemencyDialog
                    applyData = { props?.applyFilterData}
                    closeFilter={(filterData: any) => {
                      setIsOpen(false)
                      props?.closeCase(filterData)
                    }}
                  />
                </TabsContent>
                <TabsContent value="diplomaticIntervention">
                  {" "}
                  <FilterDiplomaticInterventionDialog
                    applyData = { props?.applyFilterData}
                    closeFilter={(filterData: any) => {
                      setIsOpen(false)
                      props?.closeCase(filterData)
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  )
}
