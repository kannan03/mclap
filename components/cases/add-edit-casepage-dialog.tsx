"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import moment from "moment"
import { convertToUTCDate } from "@/lib/utils"
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

import Article36Dialog from "./specific-defendant-case-dialog/spc-article36"
import ClemencyDialog from "./specific-defendant-case-dialog/spc-clemency"
import ConsulateDialog from "./specific-defendant-case-dialog/spc-consulate"
import DiplomaticInterventionDialog from "./specific-defendant-case-dialog/spc-diplomaticIntervention"
import GeneralCaseDialog from "./specific-defendant-case-dialog/spc-general"
import OutcomeDialog from "./specific-defendant-case-dialog/spc-outcome"
import PleadingsCaseDialog from "./specific-defendant-case-dialog/spc-pleading"
import ProgramDialog from "./specific-defendant-case-dialog/spc-program"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type FormData = z.infer<typeof ContactSchema>

export function AddCasesDialog(props: any) {
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
  const onSubmit = async (payload: any) => {
    if (payload.conBirthdate) {
      if (!moment(payload.conBirthdate)) {
        delete payload.conBirthdate
      }
    }
    if (payload.conInactivated) {
      if (!moment(payload.conInactivated)) {
        delete payload.conInactivated
      }
    }
    if (payload.conInactivated === "") {
      delete payload.conInactivated
    }
    if (payload.conBirthdate === "") {
      delete payload.conBirthdate
    }
    if (payload.conDoNotList === "") {
      delete payload.conDoNotList
    }
    if (payload.conState) {
      payload.conState = String(payload.conState)
    }

    if (props.rowdata) {
      try {
        payload.phoneNumber = phoneJson

        const contactID = props?.rowdata?.id
        const res = await axiosInstance.patch(
          `${baseURL}/v1/contacts/${contactID}`,
          payload
        )
        if (res?.status === 500) {
          toast({
            variant: "default",
            description: "Contact Updated Failed",
            style: {
              background: "red",
            },
          })
        } else {
          toast({
            variant: "default",
            description: "Contact Updated Successfully",
            style: {
              background: "#03C03C",
            },
          })
        }
        props.refreshGrid()
        reset()
        setIsOpen(false)
      } catch (error: any) {
        console.log(error.message)
        setIsOpen(false)
      }
    } else {
      try {
        payload.phoneNumber = phoneJson
        payload.conCountry =
          payload.conCountry == "" ? "USA" : payload.conCountry
        const res = await axiosInstance.post(baseURL + "/v1/contacts", payload)
        if (res?.status === 500) {
          toast({
            variant: "default",
            description: "Contact Created Failed",
            style: {
              background: "red",
            },
          })
        } else {
          toast({
            variant: "default",
            description: "Contact Created Successfully",
            style: {
              background: "#03C03C",
            },
          })
        }
        props.refreshGrid()
        reset()
        setIsOpen(false)
      } catch (error: any) {
        setIsOpen(false)
      }
    }
  }

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

      const res = await axiosInstance.get(
        `${baseURL}/v1/defendants/${props.defId}`
      )
      setDefData(res?.data?.data)
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
      if (props?.rowdata) {
        if (
          props.rowdata.phoneNumber &&
          typeof props.rowdata.phoneNumber === "object"
        ) {
          setPhoneJson(props.rowdata.phoneNumber)
        } else {
          setPhoneJson([{ phoneNumber: "", type: "mobile", is_primary: 1 }])
        }
        if (props?.rowdata.conFirst) {
          setValue("conFirst", props?.rowdata.conFirst)
        }
        if (props?.rowdata.conSex) {
          setValue("conSex", props?.rowdata.conSex)
        }
        if (props?.rowdata.conEmail) {
          setValue("conEmail", props?.rowdata.conEmail)
        }
        if (props?.rowdata.conType) {
          setValue("conType", props?.rowdata.conType)
        }
        if (props?.rowdata.conState) {
          setState(props?.rowdata.conState)
          setValue("conState", props?.rowdata.conState)
        }
        if (props?.rowdata.conCity) {
          setCity(props?.rowdata.conCity)
          setValue("conCity", props?.rowdata.conCity)
        }
        if (props?.rowdata?.conBirthdate) {
          if (moment(props?.rowdata?.conBirthdate).isValid()) {
            let dateFormat = convertToUTCDate(props?.rowdata?.conBirthdate)
            setDate(new Date(dateFormat))
            setValue("conBirthdate", String(dateFormat))
          }
        }
        setCountry(props?.rowdata ? props?.rowdata?.conCountry : "USA")
      }
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
        if (props?.text == "Add") {
          if (openValue) {
            setIsOpen(openValue)
          } else {
            const values = getValues()
            let formAllValues = Object.values(values)
            let findFormValue = formAllValues?.find((map_val) => {
              return map_val != ""
            })
            if (findFormValue) {
              let ConfirmCloseForm = confirm(
                "The data filled in the form will be lost. Do you want to close the form ?"
              )
              if (ConfirmCloseForm) {
                setIsOpen(openValue)
              }
            } else {
              setIsOpen(openValue)
              if(!openValue){
                props?.refreshGrid();
              }
            }
          }
        } else {
          setIsOpen(openValue)
        }
      }}
    >
      <TooltipProvider>
        {props.text === "Add" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex h-8 items-center rounded-lg bg-transparent px-3.5 text-xs xl:py-1.5"
                >
                  <Icons.PiBookOpenUser />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-zinc-950 dark:bg-zinc-50">
              <p className="text-xs text-slate-50 dark:text-slate-950">
                Case info of the defendant
              </p>
            </TooltipContent>
          </Tooltip>
        )}
        {(props.hidetext === "Edit" ||
          props.hidetext === "View" ||
          props.text === "Edit") && (
          <DialogTrigger asChild>
            <Button
              variant={props.text === "Edit" ? "outline" : "ghost"}
              disabled={props.disable}
              className={
                props.hidetext === "Edit"
                  ? "flex h-8 items-center rounded-l-lg border-r rounded-r-none bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                  : props.hidetext === "View"
                  ? "flex h-8 items-center rounded-none bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                  : "flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
              }
            >
              {props.icon} {props.text}
            </Button>
          </DialogTrigger>
        )}
      </TooltipProvider>
      <div>
        <DialogContent
          className="fixed z-50 grid max-h-[95%] max-w-[60rem] xl:w-full dark:bg-slate-900 p-0 pt-2"
          onInteractOutside={(e) => {
            if (props?.text == "Add") {
              const values = getValues()
              let formAllValues = Object.values(values)
              let findFormValue = formAllValues?.find((map_val) => {
                return map_val != ""
              })
              if (findFormValue) {
                e.preventDefault()
                let ConfirmCloseForm = confirm(
                  "The data filled in the form will be lost. Do you want to close the form ?"
                )
                if (ConfirmCloseForm) {
                  setIsOpen(false)
                }
              }
            }
          }}
        >
          <div className="flex flex-col">
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
                <DialogHeader className="border-b border-inherit">
                  <div className="flex mx-2 mt-5 items-center">
                    <h5 className="text-xs">
                      Defendant:{" "}
                      <HoverCard>
                        <HoverCardTrigger>
                          <span className="text-gray-500 px-1">
                            {defData?.defLast}, {defData?.defFirst} {defData?.defMiddle}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="text-xs"
                          style={{ marginLeft: "60px" }}
                        >
                          <span className="text-black dark:text-white">
                            Case Title:
                          </span>{" "}
                          {props?.caseData?.caseTitle}
                          <br />
                          <span className="text-black dark:text-white">
                            Case ID:
                          </span>{" "}
                          {props?.caseData?.id}
                          <br />
                          <span className="text-black dark:text-white">
                            Description:
                          </span>{" "}
                          {props?.caseData?.caseCrimeDescription}
                        </HoverCardContent>
                      </HoverCard>
                    </h5>
                  </div>
                  <div className="flex mx-2 items-center justify-between">
                    <h5 className="text-xs text-gray-500">
                      County and State:{" "}
                      <span className=" text-gray-500">
                        {" "}
                        {props?.caseData?.caseCounty},{" "}
                        {props?.caseData?.caseState}{" "}
                      </span>
                    </h5>
                    <div></div>
                    {props?.caseData?.caseCrimeDate &&
                      moment(props?.caseData?.caseCrimeDate).isValid() && (
                        <h5 className="text-xs px-1">
                          Crime Date:{" "}
                          <span className=" text-gray-500">
                            {convertToUTCDate(props?.caseData?.caseCrimeDate)}
                          </span>
                        </h5>
                      )}
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
                    <TabsList  className="bg-white dark:bg-inherit h-9 p-0 hidden md:block">
                      <TabsTrigger
                        value="general"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${activeTab === "general" ? "font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""}  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        General
                      </TabsTrigger>
                      <TabsTrigger
                        value="pleadings"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${activeTab === "pleadings" ? "font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""}  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Pleadings
                      </TabsTrigger>
                      <TabsTrigger
                        value="article36"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${activeTab === "article36" ? "font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""}  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Article 36
                      </TabsTrigger>
                      <TabsTrigger
                        value="consulate"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${activeTab === "consulate" ? "font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""}  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Consulate
                      </TabsTrigger>
                      <TabsTrigger
                        value="program"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${activeTab === "program" ? "font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""}  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Program
                      </TabsTrigger>
                      <TabsTrigger
                        value="outcome"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${activeTab === "outcome" ? "font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""}  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Outcome
                      </TabsTrigger>
                      <TabsTrigger
                        value="clemency"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${activeTab === "clemency" ? "font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""}  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Clemency
                      </TabsTrigger>
                      <TabsTrigger
                        value="diplomaticIntervention"
                        className={`border-transparent text-xs decoration-red-500 decoration-2 ${activeTab === "diplomaticIntervention" ? "font-bold rounded-none border-solid border-b-2 h-full border-red-500" : ""}  focus:shadow-none focus:outline-none active:text-red-600 dark:text-white`}
                      >
                        Diplomatic Intervention
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </DialogHeader>
                <TabsContent value="general">
                  {" "}
                  <GeneralCaseDialog
                    caseId={props?.caseId}
                    defId={props?.defId}
                  />{" "}
                </TabsContent>
                <TabsContent value="pleadings">
                  {" "}
                  <PleadingsCaseDialog
                    caseId={props?.caseId}
                    defId={props?.defId}
                  />{" "}
                </TabsContent>
                <TabsContent value="article36">
                  <Article36Dialog
                    caseId={props?.caseId}
                    defId={props?.defId}
                  />
                </TabsContent>
                <TabsContent value="consulate">
                  <ConsulateDialog
                    caseId={props?.caseId}
                    defId={props?.defId}
                  />
                </TabsContent>
                <TabsContent value="program">
                  <ProgramDialog caseId={props?.caseId} defId={props?.defId} />
                </TabsContent>
                <TabsContent value="outcome">
                  {" "}
                  <OutcomeDialog caseId={props?.caseId} defId={props?.defId} />
                </TabsContent>
                <TabsContent value="clemency">
                  <ClemencyDialog caseId={props?.caseId} defId={props?.defId} />
                </TabsContent>
                <TabsContent value="diplomaticIntervention">
                  {" "}
                  <DiplomaticInterventionDialog
                    caseId={props?.caseId}
                    defId={props?.defId}
                  />
                </TabsContent>
              </Tabs>
            </div>
            {/* <div className="border-t flex justify-end p-2">
                                <DialogFooter className="gap-2 mr-7">
                                    <DialogClose className="text-black-700" hidden={props.hidetext === "View"}>Discard</DialogClose>
                                    {props.hidetext !== "View" && (
                                        <Button type="submit" variant="outline" className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs">
                                            Submit
                                        </Button>
                                    )}
                                </DialogFooter>
                            </div> */}
          </div>
        </DialogContent>
      </div>
    </Dialog>
  )
}
