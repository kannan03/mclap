'use client'

import * as React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@radix-ui/react-label"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
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

import { Button } from "@/components/ui/button"
import 'react-calendar/dist/Calendar.css';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import Calendar from 'react-calendar';
import moment from "moment"
import { convertToUTCDate } from "@/lib/utils"
import { Textarea } from '@/components/ui/textarea'
import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from 'next/navigation'
import { Form, useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "../../../components/ui/input"

const OutcomeSchema = z.object({
    data: z.any(),
});
type FormData = z.infer<typeof OutcomeSchema>
import { toast } from "../../../components/ui/use-toast"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from "@/components/ui/command"
  import { Check, ChevronsUpDown } from "lucide-react"
  import { getSession } from 'next-auth/react'
import { useContext } from 'react';
import { CaseFilterContext } from "@/context/caseFilterContext"
import { MultipleCombobox } from '../multiple-combobox'

export default function FilterOutcomeDialog(props : any) {

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(OutcomeSchema),
    })
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
    const appliedCaseFilters = useContext<any>(CaseFilterContext);
    const searchParams = useSearchParams();
    const [userRoles, setUserRoles] = React.useState<string[]>([])
    const [outComeData, setOutComeData] = React.useState<any>({});
    const [isLoading, setIsLoading] = React.useState(true)
    const [linkConvictionDate, setLinkConvictionDate] = React.useState<any>(null);
    const [linkDateDSImposed, setLinkDateDSImposed] = React.useState<any>(null)
    const [linkConvictionDateIsOpen, setLinkConvictionDateIsOpen] = React.useState<any>(false);
    const [linkDateDSImposedIsOpen, setLinkDateDSImposedIsOpen] = React.useState<any>(false);

    const [linkDateDSJury, setLinkDateDSJury] = React.useState<any>("");
    const [linkConvictionCharges, setLinkConvictionCharges] = React.useState<any>("");
    const [linkNoLongerCapital, setLinkNoLongerCapital] = React.useState<any>("");
    const [linkNoLongerCapitalNotes, setLinkNoLongerCapitalNotes] = React.useState<any>("");
    const [linkTotalInvested, setLinkTotalInvested] = React.useState<any>("");
    const [linkInvestedSinceDate, setLinkInvestedSinceDate] = React.useState<any>("");

    const [factorsData,setFactorsData] = React.useState<any>([]);
    const [factorTypeList,setFactorTypeList] = React.useState<any>([]);
    const [capitalTypeList,setCapitalTypeList] = React.useState<any>([]);
    const [ capitalIsOpen, setCapitalIsOpen] = React.useState<any>(false);
    const [isViewMode, setIsViewMode] = React.useState<any>(false)

    const handleChangeFactors = (val: any) => {
        setFactorsData(val)
    }

    const fetchData = async()=>{
         let factorList =  await axiosInstance.get(`${baseURL}/v1/codes/codeType/Aggravating Factor`);
         setIsLoading(false)
         if( factorList?.data?.data && factorList?.data?.data?.length > 0){
            setFactorTypeList(factorList?.data?.data);
         }

         let capitals =  await axiosInstance.get(`${baseURL}/v1/codes/codeType/No Longer Capital`);
         if( capitals?.data?.data){
            setCapitalTypeList(capitals?.data?.data);
         }


         if( appliedCaseFilters) {
            if( appliedCaseFilters?.linkConvictionDate){
                setLinkConvictionDate( moment(appliedCaseFilters?.linkConvictionDate).isValid() ? convertToUTCDate(appliedCaseFilters?.linkConvictionDate): null)
            }
            if( appliedCaseFilters?.linkDateDSImposed){
                setLinkDateDSImposed( moment(appliedCaseFilters?.linkDateDSImposed).isValid() ? convertToUTCDate(appliedCaseFilters?.linkDateDSImposed) : null)
            }

            if( appliedCaseFilters?.linkDateDSJury){
                setLinkDateDSJury( moment(appliedCaseFilters?.linkDateDSJury).isValid() ? convertToUTCDate(appliedCaseFilters?.linkDateDSJury) : null)
            }

            if( appliedCaseFilters?.linkConvictionCharges){
                setLinkConvictionCharges(appliedCaseFilters?.linkConvictionCharges)
            }
            if( appliedCaseFilters?.linkNoLongerCapitalNotes){
                setLinkNoLongerCapitalNotes(appliedCaseFilters?.linkNoLongerCapitalNotes)
            }
            if( appliedCaseFilters?.linkTotalInvested){
                setLinkTotalInvested(appliedCaseFilters?.linkTotalInvested)
            }
            if( appliedCaseFilters?.linkInvestedSinceDate){
                setLinkInvestedSinceDate( moment(appliedCaseFilters?.linkInvestedSinceDate).isValid() ? convertToUTCDate(appliedCaseFilters?.linkInvestedSinceDate) : null)
            }
            if( appliedCaseFilters?.linkNoLongerCapital){
                setLinkNoLongerCapital(appliedCaseFilters?.linkNoLongerCapital)
            }
        }
    }
    const onSubmit = async (e: any) => {

            try {
                e.preventDefault();
            let payloadData = {
            linkConvictionDate : linkConvictionDate ? linkConvictionDate : null ,
            linkDateDSJury : linkDateDSJury ? linkDateDSJury : null,
            linkDateDSImposed : linkDateDSImposed ? linkDateDSImposed : null,
            linkNoLongerCapital  : linkNoLongerCapital ? linkNoLongerCapital : null,
            linkTotalInvested : linkTotalInvested ? linkTotalInvested : null,
            linkInvestedSinceDate : linkInvestedSinceDate ? linkInvestedSinceDate : null,
            affFactor : factorsData,
            page : props?.page,
            limit : props?.limit
           }
           props?.closeFilter(payloadData);

            } catch (error: any) {
            }
    }


    React.useEffect(()=>{
        const fetchUserRoles = async () => {
            setIsLoading(false)
            const session = await getSession()
            // setUserRoles(session?.user?.roles || [])
          }
        fetchUserRoles()
        fetchData();
    },[])

    return (
            <div>
        <form onSubmit={onSubmit}>
        {isLoading && (
          <div className="h-[calc(100vh-18.5rem)]">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20">
              <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-red-700" />
            </div>
          </div>
        )}
                {!isLoading && (
                    <>
        <div className="thin-scrollbar h-[calc(100vh-18.5rem)] overflow-y-auto mx-1 p-3">
            <div>
                <div>
                    <Label htmlFor="Date-of-conviction" className="text-[0.7rem] font-semibold text-gray-600">
                        Date of Conviction
                    </Label>
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "h-8 w-full md:w-[220px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                        !linkConvictionDate && "text-muted-foreground"
                                    )}
                                    disabled={userRoles.includes("VIEWER")}>
                                         {linkConvictionDate && moment(linkConvictionDate).isValid() ? (
                                      <>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {convertToUTCDate(linkConvictionDate)}
                                      </>
                                    ) : (
                                        userRoles.includes("VIEWER") ? "-" : <>
                                        <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                      </>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent id="Date-of-conviction" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                <Calendar
                                    defaultView="century"
                                    onChange={(e: any) => {
                                        let dateObj = new Date(e);
                                        let dateStr = moment(dateObj).format("YYYY-MM-DD");
                                        setLinkConvictionDate(dateStr);
                                        let newData = outComeData;
                                        newData['linkConvictionDate'] = dateStr;
                                        setOutComeData(newData);
                                        setValue("data",newData)

                                    }}
                                    value={linkConvictionDate} />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div>
                    <Label htmlFor="death-sentence" className="text-[0.7rem] font-semibold text-gray-600">
                        Date jury recommended death sentence
                    </Label>
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "h-8 w-full md:w-[220px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                        !linkDateDSJury && "text-muted-foreground"
                                    )} disabled={userRoles.includes("VIEWER")}>
                                        {linkDateDSJury && moment(linkDateDSJury).isValid() ? (
                                      <>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {convertToUTCDate(linkDateDSJury)}
                                      </>
                                    ) : (
                                        userRoles.includes("VIEWER") ? "-" : <>
                                        <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                      </>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent id="death-sentence" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                <Calendar
                                    defaultView="century"
                                    onChange={(e: any) => {
                                        let dateObj = new Date(e)
                                        let dateStr = moment(dateObj).format("YYYY-MM-DD");
                                        setLinkDateDSJury(dateStr);
                                        let newData = outComeData;
                                        newData['linkDateDSJury'] = dateStr;
                                        setOutComeData(newData);
                                        setValue("data",newData)

                                    }}
                                    value={linkDateDSJury} />
                            </PopoverContent>
                        </Popover>
                    </div>

                </div>
                <div className='mx-0 md:mx-5'>
                    <Label htmlFor="death-sentence-court" className="text-[0.7rem] font-semibold text-gray-600">
                        Date death sentence imposed by court</Label>
                        <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "h-8 w-full md:w-[220px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                        !linkDateDSImposed && "text-muted-foreground"
                                    )}
                                    disabled={userRoles.includes("VIEWER")}>
                                        {linkDateDSImposed && moment(linkDateDSImposed).isValid() ? (
                                      <>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {convertToUTCDate(linkDateDSImposed)}
                                      </>
                                    ) : (
                                        userRoles.includes("VIEWER") ? "-" : <>
                                        <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                      </>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent id="death-sentence-court" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                <Calendar
                                    defaultView="century"
                                    onChange={(e: any) => {
                                        let dateObj = new Date(e)
                                        let dateStr = moment(dateObj).format("YYYY-MM-DD");
                                        setLinkDateDSImposed(dateStr);
                                        let newData = outComeData;
                                        newData.linkDateDSImposed = dateStr;
                                        setOutComeData(newData);
                                        setValue("data",newData)

                                    }}
                                    value={linkDateDSImposed} />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div>
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex flex-col mt-2 w-full md:w-[480px]">
                                    <Label className="text-[0.7rem] font-semibold text-gray-600 mb-1">Aggravating Factor(s)</Label>
                                    <MultipleCombobox
                                        ListData={factorTypeList}
                                        handleChange={handleChangeFactors}
                                        placholderName={userRoles.includes("VIEWER") ? ' ' : 'Select factor'}
                                        EditData={factorsData?.length > 0 ? factorsData : []}
                                        viewMode={isViewMode}
                                        disabled={userRoles.includes("VIEWER")}
                                    />
                                </div>
                            </div>
                </div>
                <div>
                    <div className="grid grid-cols-1 my-1 mx-0 md:mx-5">
                <div className="my-1 col-span-1 md:col-span-2">
                  <h4 className="text-[0.7rem] font-semibold text-gray-600 mb-1">Case no longer capital because</h4>
                  <Popover
                  open={capitalIsOpen} onOpenChange={setCapitalIsOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={capitalIsOpen}
                        disabled={userRoles.includes("VIEWER")}
                        className="w-full md:w-[350px] h-8 text-xs justify-between disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom"
                      >
                         {linkNoLongerCapital ? linkNoLongerCapital : (userRoles.includes("VIEWER") ? "-" : "Select option")}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-0">
                      <Command className="dark:bg-slate-900 text-xs">
                        <CommandInput placeholder="Select Option" className="h-8 text-xs" />
                        <CommandEmpty>No Found</CommandEmpty>
                        <CommandGroup className="h-[150px] text-xs thin-scrollbar overflow-y-scroll text-xs dark:bg-slate-900">
                       {capitalTypeList && capitalTypeList?.map((framework: any, i : any) => {
                          return(
                            <CommandItem
                            key={i}
                            value={framework}
                            className="text-xs whitespace-nowrap"
                            onSelect={(currentValue) => {
                            setLinkNoLongerCapital(framework.codeCode)
                            let newData = outComeData;
                            newData['linkNoLongerCapital'] = framework.codeCode;
                            setOutComeData(newData);
                            setValue("data",newData);
                            setCapitalIsOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                linkNoLongerCapital == framework.codeCode ? "opacity-100" : "opacity-0"
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

            </div>
            </div>
            </>
            )}
            {!userRoles.includes("VIEWER") && (
            <div className="border-t flex justify-end p-2">
                                <DialogFooter className="gap-2 mr-7 flex-row">
                                    <DialogClose className="text-black-700 text-xs" >Discard</DialogClose>
                                    {props.hidetext !== "View" && (
                                        <Button type="submit" variant="outline" className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs">
                                         <Icons.save className="w-4 h-4 mr-0.5" /> Apply Filters
                                        </Button>
                                    )}
                                </DialogFooter>
                </div>
            )}
            </form>
            </div>

    )
}
