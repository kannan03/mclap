"use client"
import React, { ForwardedRef, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from "@/components/ui/checkbox"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Calendar as CalendarIcon } from "lucide-react"
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css"
import moment from "moment"
import { convertToUTCDate } from "@/lib/utils"
import { format } from "date-fns"

import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"
import { useForm, useFieldArray } from "react-hook-form"
import { noteSchema } from "@/lib/validations/note"
import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

import * as z from "zod"
import { cn } from "@/lib/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "../icons"
import { Check, ChevronsUpDown } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "../ui/use-toast"
import { Console } from 'console'
import { CoDefendantCombobox } from '../cases/co-defendant-combobox'
import { DefendantComboBox } from './defendantComboBox'

type FormData = z.infer<typeof noteSchema>

const AddEventNotesDialog = forwardRef((props: any, ref: ForwardedRef<unknown>) => {

  const {
    register,
    handleSubmit,
    control,
    reset,
    clearErrors,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(noteSchema)
  })
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = React.useState<any>(false);

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const [eventTypeList, setEventTypeList] = React.useState<any>([]);
  const [eventType, setEventType] = React.useState<any>("");
  const [eventTypeIsOpen, setEventTypeIsOpen] = React.useState<any>(false);
  const [date, setDate] = React.useState<any>("");

  const [defCaseList, setDefCaseList] = React.useState<any>([]);
  const [selectCase, setSelectCase] = React.useState<any>("");
  const [caseIsOpen, setCaseIsOpen] = React.useState<any>(false);
  const [isViewMode, setIsViewMode] = React.useState(false)
  const [DefendantData, setDefendantData] = React.useState<any>('')

  useImperativeHandle(ref, () => {
    return {
      click: () => setIsOpen(true)
    }
  })

  const selectCaseId = async (defId: any) => {
    const resp = await axiosInstance.get(`${baseURL}/v1/case/defcase/${defId}`);
    if (resp?.data?.data?.rows) {
      setDefCaseList(resp?.data?.data?.rows);
    }
  }
  const handleChange = async (defId: any) => {
    setDefendantData(defId)
    if (defId) {
      selectCaseId(defId)
    }
  }

  const onSubmit = async (payload: any) => {
    if (!payload?.logCaseID) {
      return;
    }
    if (props?.rowdata) {
      let ID = props?.rowdata?.id;
      const res = await axiosInstance.patch(`${baseURL}/v1/eventlog/${ID}`, payload)
      if (res?.status === 500 || res?.status === 400) {
        toast({
          variant: "default",
          description: "Note/Event updated failed",
          style: {
            background: "red",
          },
        })
      } else {
        toast({
          variant: "default",
          description: "Note/Event updated successfully",
          style: {
            background: "#03C03C",
          },
        })
      }
      props.refreshGrid()
      reset()
      setIsOpen(false)

    } else {
      const res = await axiosInstance.post(`${baseURL}/v1/eventlog/${DefendantData}`, payload)
      if (res?.status === 500 || res?.status === 400) {
        toast({
          variant: "default",
          description: "Note/Event created failed",
          style: {
            background: "red",
          },
        })
      } else {
        toast({
          variant: "default",
          description: "Note/Event created successfully",
          style: {
            background: "#03C03C",
          },
        })
      }
      props.refreshGrid()
      reset()
      setIsOpen(false)
    }

  }
  const fetchData = async () => {
    try {
      const eventList = await axiosInstance.get(baseURL + "/v1/codes/codeType/Event Type");
      
      if (eventList?.data?.data) {
        setEventTypeList([{codeCode:""} ,...eventList?.data?.data])
      }
    } catch (error) { }
  }
  React.useEffect(() => {
    fetchData();
    reset();
    setSelectCase("");
    setDate(null)
    selectCaseId('')
    setEventType("");
    if (props?.rowdata) {
      if (props?.rowdata?.logActionDate) {
        setDate(props?.rowdata?.logActionDate);
        setValue("logActionDate", props?.rowdata?.logActionDate)
      }
      if (props?.rowdata?.logEventType) {
        setEventType(props?.rowdata?.logEventType)
        setValue("logEventType", props?.rowdata?.logEventType)
      }

      if (props?.rowdata?.logInitials) {
        setValue("logInitials", props?.rowdata?.logInitials)
      }
      if (props?.rowdata?.logNotes) {
        setValue("logNotes", props?.rowdata?.logNotes)
      }
      if (props?.rowdata?.logApproximate) {
        setValue("logApproximate", props?.rowdata?.logApproximate)
      }
      if (props?.rowdata?.logCaseID) {
        selectCaseId(props?.rowdata?.logDefID)
        setSelectCase(props?.rowdata?.logCaseID)
        setValue("logCaseID", props?.rowdata?.logCaseID)
      }
    }
  }, [isOpen])

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
            }
          }
        } else {
          setIsOpen(openValue)
        }
      }}
    >
      <DialogTrigger asChild>
        <TooltipProvider>
          {(props.text === "Add" || props?.hidetext == "Add") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    // reset();
                    // setSelectCase("");
                    // setDate(null)
                    // setEventType("");
                  }}
                    variant="outline"
                    disabled={props.disable}
                    className={'flex h-8 items-center rounded-lg bg-transparent px-1.5 md:px-3.5 py-1 text-xs xl:py-1.5'}
                  >
                    {props.icon} <span className="hidden md:block">{props.text}</span>
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-950 dark:bg-zinc-50">
                <p className="text-xs text-slate-50 dark:text-slate-950">
                  Create new notes
                </p>
              </TooltipContent>
            </Tooltip>
          )}
          {(props.hidetext === "Edit" || props.hidetext === "View" || props.text === "Edit") && (
            <DialogTrigger asChild>
              <Button
                variant={props.text === "Edit" ? "outline" : "ghost"}
                disabled={props.disable}
                className={
                  props.hidetext === "Edit"
                    ? 'flex h-8 items-center rounded-l-lg border-r rounded-r-none bg-transparent px-3.5 py-1 text-xs xl:py-1.5 '
                    : props.hidetext === "View"
                      ? 'flex h-8 items-center rounded-none bg-transparent px-3.5 py-1 text-xs xl:py-1.5'
                      : 'flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5'
                }>
                {props.icon} {props.hidetext ? "" : props.text}
              </Button>
            </DialogTrigger>
          )}
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="fixed z-50 grid max-h-full max-w-[25rem] md:max-w-[48rem] overflow-auto md:overflow-hidden dark:bg-slate-900 p-0 pt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="border-b border-inherit text-start">
            <DialogTitle
              className="text-black-700 p-2 font-bold text-l ml-2">{props.text == "Add" ? "Add" : (props.text == "Edit" ? "Edit" : "")} Events and Notes
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(100vh-15rem)] max-w-full thin-scrollbar overflow-y-auto overflow-x-hidden px-2">
            <div className="grid grid-cols-2 px-2 gap-2 p-3">
              <div className='px-1'>
                <Label className="text-[0.7rem] font-semibold text-gray-600">Defendant<span className="text-red-500"> *</span></Label>
                <DefendantComboBox
                  handleChange={handleChange}
                  EditData={props?.rowdata?.id ? props?.rowdata?.deffullname : ''}
                  viewMode={props.hidetext === "View"}
                  placholderName={"Search Defendant"}
                  disabled={props?.rowdata?.id}
                />
              <div>
                    {isSubmitted && !DefendantData && (
                      <small className="text-red-500">
                      Defendant is Required
                      </small>
                    )}
                  </div>
              </div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 pt-1 pb-2 gap-2 p-3">
              <div>
                <Label className="text-[0.7rem] font-semibold text-gray-600">Event Type<span className="text-red-500"> *</span></Label>
                <div className="">
                  <Popover
                    open={eventTypeIsOpen} onOpenChange={setEventTypeIsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={eventTypeIsOpen}
                        disabled={props.hidetext === "View"}
                        className="w-[350px] h-8 text-xs justify-between disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:cursor-text disabled:py-0 select-custom">
                        {eventType ? eventType : "Select Type"}
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
                                  setEventType(framework.codeCode == eventType ? "" : framework.codeCode)
                                  setValue("logEventType", framework.codeCode);
                                  setEventTypeIsOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    eventType == framework.codeCode ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {framework?.codeCode ? framework?.codeCode :"Select Type" }
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {isSubmitted && !eventType && (
                    <small className="text-red-500">
                   Event type is Required
                    </small>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-[0.7rem] font-semibold text-gray-600">Case Name<span className="text-red-500"> *</span></Label>
                <div className="">
                  <Popover open={caseIsOpen} onOpenChange={setCaseIsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!DefendantData || props.hidetext === "View"}
                        aria-expanded={caseIsOpen}
                        className={`h-8 w-[350px] justify-between whitespace-nowrap text-xs ${ props.hidetext === "View" ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" : "" }`}
                      >
                        <div className={`max-w-[350px] overflow-hidden text-ellipsis ${props.hidetext === "View" ? "whitespace-normal" : "whitespace-nowrap"
                          }`}>
                        {selectCase
                          ? defCaseList.find(
                            (framework: any) =>
                              framework.id == selectCase
                          )?.caseTitle
                          : "Select Case"}
                          </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0">
                      <Command className="text-xs dark:bg-slate-900">
                        <CommandInput
                          placeholder="Select Case"
                          className="h-8 text-xs"
                        />
                        <CommandEmpty>No Case Found</CommandEmpty>
                        <CommandGroup className="thin-scrollbar h-[150px] overflow-y-scroll text-xs dark:bg-slate-900">
                          {defCaseList && defCaseList?.map((framework: any, i: any) => (
                            <CommandItem
                              key={i}
                              value={framework}
                              className="whitespace-nowrap text-xs"
                              onSelect={(currentValue) => {
                                setValue("logCaseID", framework.id)
                                setSelectCase(framework.id)
                                setCaseIsOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectCase === framework.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {framework?.caseTitle}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div>
                    {isSubmitted && !selectCase && (
                      <small className="text-red-500">
                      Case is Required
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 pt-1 pb-2 gap-2 p-3">
              <div className="">
                <Label className="text-[0.7rem] font-semibold text-gray-600">Initial</Label>
                <Input
                  type="text"
                  onChange={(e) => {
                    console.log(errors)
                    setValue("logInitials", e.target.value)
                  }}
                  placeholder={props.hidetext === "View" ? "-" : "Enter Initial"}
                  defaultValue={props?.rowdata?.logInitials ? props?.rowdata?.logInitials : ''}
                  className="w-[350px] text-xs justify-between disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:cursor-text disabled:py-0 select-custom"
                  disabled={props.hidetext === "View"} />
              </div>
              <div className="flex">
                <div>
                  <Label
                    htmlFor="visit-to-defendant"
                    className="text-[0.7rem] font-semibold text-gray-600">
                    Date
                  </Label>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          disabled={props.hidetext === "View"}
                          className={cn(
                            "h-8 w-[260px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0",
                            !date && "text-muted-foreground"
                          )}>
                            { moment(date).isValid() ? (
                               <>
                               <div className="flex">
                               <CalendarIcon className="mr-2 h-4 w-4" />
                               {convertToUTCDate(date)}
                               </div>
                               <div className="">
                                   <Icons.close className="h-4 w-4"
                                     onClick={()=>setDate(null)} />
                                    </div>
                             </>
                           ) : (
                             (props.hidetext === "View") ? (
                               "-"
                             ) : (
                               <div className="flex">
                                 <CalendarIcon className="mr-2 h-4 w-4" />
                                 <span>Pick a date</span>
                               </div>
                             )
                            )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent id="date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                        <Calendar
                          defaultView="century"
                          onChange={(e: any) => {
                            let dateObj = new Date(e);
                            let day = dateObj.getDate()
                            let month = dateObj.getMonth() + 1;
                            let year = dateObj.getFullYear()
                            let dateStr = `${month}/${day}/${year}`;
                            setValue("logActionDate", dateStr);
                            setDate(dateStr);
                          }}
                          value={date} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex items-center mx-2 pt-5">
                  <Checkbox
                    defaultChecked={props?.rowdata?.logApproximate ? true : false}
                    className="border-slate-600"
                    disabled={props.hidetext === "View"}
                    onCheckedChange={(e) => {
                      setValue("logApproximate", e)
                    }}
                  />
                  <Label className="px-1 text-center text-xs">
                    Approximate
                  </Label>
                </div>
              </div>
              </div>
              <div className="col-span-2 mr-2 pb-2 p-3  ">
                <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="defNotes">
                  Notes</Label>
                <Textarea
                  defaultValue={props?.rowdata?.logNotes ? props?.rowdata?.logNotes : ''}
                  onChange={(e) => {
                    setValue("logNotes", e.target.value)
                  }}
                  className="h-14 md:h-56 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:cursor-text disabled:py-0 select-custom disabled:resize-none" placeholder={props.hidetext === "View" ? "-" : "Type here.."} disabled={props.hidetext === "View"} />
              </div>
            </div>
         
          {props.hidetext !== "View" && (
          <div className="border-t flex justify-end p-2">
            <DialogFooter className="gap-2 mr-5 flex-row">
              <DialogClose hidden={props.hidetext === "View"} className="text-xs text-black-700">
                Discard
              </DialogClose>
              {props.hidetext === "View" ? <></> :
                <Button type="submit" variant="outline"
                  className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs">
                  <Icons.save className="w-4 h-4 mr-0.5" />
                  Save
                </Button>}
            </DialogFooter>
          </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
})
AddEventNotesDialog.displayName = 'AddEventNotesDialog'
export default AddEventNotesDialog;
