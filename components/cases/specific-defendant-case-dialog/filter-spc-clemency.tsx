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

import { CaseFilterContext } from "@/context/caseFilterContext"
import { useContext } from 'react';
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
import { getSession } from 'next-auth/react'
import { Form, useForm } from "react-hook-form"
import * as z from "zod"
const ClemencySchema = z.object({
    data: z.any(),
});
type FormData = z.infer<typeof ClemencySchema>
import { toast } from "../../../components/ui/use-toast"


export default function FilterClemencyDialog(props : any) {
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues : {
            data : {
                linkProgClemencyPetition : '',
                linkDateProgClemencyPetition : null,
                linkPAMetWithClemencyOff : '',
                linkDatePAMetWithClemencyOff : null,
                linkPAAtCommutationHrg : '',
                linkDatePAAtCommutationHrg : null,
                linkClemencyNotes : ''
            }
        },
        resolver: zodResolver(ClemencySchema),
    })

    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
    const appliedCaseFilters = useContext<any>(CaseFilterContext);
    const searchParams = useSearchParams();
    const [clemencyData, setClemencyData] = React.useState<any>(
        {
            linkProgClemencyPetition : '',
            linkDateProgClemencyPetition : null,
            linkPAMetWithClemencyOff : '',
            linkDatePAMetWithClemencyOff : null,
            linkPAAtCommutationHrg : '',
            linkDatePAAtCommutationHrg : null,
            linkClemencyNotes : ''
        }
    );
    const [isLoading, setIsLoading] = React.useState(true)
    const [userRoles, setUserRoles] = React.useState<string[]>([])
    const [clemencyPetition,setClemencyPetition] = React.useState("");
    const [clemencyOff,setClemencyOff] = React.useState("");
    const [commutationHrg,setCommutationHrg] = React.useState("");
    const [clemencyPetitionDate,setClemencyPetitionDate] = React.useState<any>(null);
    const [clemencyOffDate,setClemencyOffDate] = React.useState<any>(null);
    const [commutationHrgDate,setCommutationHrgDate] = React.useState<any>(null);


    const onSubmit = async (e: any) => {

            try {
                e.preventDefault();
                let payloadData = clemencyData;
                props?.closeFilter(payloadData);
            } catch (error: any) {
            }
    }


    const fetchData = async()=>{
        setIsLoading(false)
        if( appliedCaseFilters) {
            setClemencyData(appliedCaseFilters);
            if( appliedCaseFilters?.linkProgClemencyPetition){
                setClemencyPetition(appliedCaseFilters?.linkProgClemencyPetition)
            }
            if( appliedCaseFilters?.linkPAMetWithClemencyOff){
                setClemencyOff(appliedCaseFilters?.linkPAMetWithClemencyOff)
            }
            if( appliedCaseFilters?.linkPAAtCommutationHrg){
                setCommutationHrg(appliedCaseFilters?.linkPAAtCommutationHrg)
            }
        }
    }

    React.useEffect(()=>{
        fetchData()
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
           <div  className="thin-scrollbar h-[calc(100vh-18.5rem)] overflow-y-auto mx-1 p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <div>
                        <Label className="text-[0.7rem] font-semibold text-gray-600"
                            >
                            Program drafted clemency petition?</Label>
                            <Select
                    value={clemencyPetition}
                    onValueChange={(e)=>{
                        let newData  = clemencyData;
                            newData['linkProgClemencyPetition'] = e;
                            setClemencyData(newData);
                            setValue("data",newData);
                            setClemencyPetition(e)
                    }}
                    >
                        <SelectTrigger disabled={userRoles.includes("VIEWER")}  className="h-8 w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Select Option" className='text-xs'>
                            {clemencyPetition ? clemencyPetition : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className='text-xs dark:bg-slate-900'>
                            <SelectGroup>
                                <SelectItem value="" className='text-xs'>Select Option</SelectItem>
                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                </SelectGroup>
                        </SelectContent>
                    </Select>
                    </div>
                    <div>
                        <Label className="text-[0.7rem] font-semibold text-gray-600"
                            htmlFor="linkPAMetWithClemencyOff">
                            Program attorneys met with clemency officials?</Label>
                        <Select
                         value={clemencyOff}
                         onValueChange={(e)=>{
                             let newData  = clemencyData;
                                 newData['linkPAMetWithClemencyOff'] = e;
                                 setClemencyData(newData);
                                 setValue("data",newData);
                                 setClemencyOff(e)
                         }}
                        >
                            <SelectTrigger
                                id="linkPAMetWithClemencyOff"
                                disabled={userRoles.includes("VIEWER")}
                                className="h-8 w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                <SelectValue placeholder="Select Option" className='text-xs'>
                                {clemencyOff ? clemencyOff : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className='text-xs dark:bg-slate-900'>
                            <SelectGroup>
                                <SelectItem value="" className='text-xs'>Select Option</SelectItem>
                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-[0.7rem] font-semibold text-gray-600"
                            htmlFor="commutation-hearing">
                            Program appeared at commutation hearing?</Label>
                        <Select
                         value={commutationHrg}
                         onValueChange={(e)=>{
                             let newData  = clemencyData;
                                 newData['linkPAAtCommutationHrg'] = e;
                                 setClemencyData(newData);
                                 setValue("data",newData);
                                 setCommutationHrg(e)
                         }}
                        >
                            <SelectTrigger
                                id="commutation-hearing"
                                disabled={userRoles.includes("VIEWER")}
                                className="h-8 w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                <SelectValue placeholder="Unknown" className='text-xs'>
                                {commutationHrg ? commutationHrg : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className='text-xs dark:bg-slate-900'>
                                <SelectGroup>
                                <SelectItem value="" className='text-xs'>Select Option</SelectItem>
                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                             </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <Label htmlFor="linkDateProgClemencyPetition" className="text-[0.7rem] font-semibold text-gray-600">
                                Date
                            </Label>
                            <div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "h-8 w-1/2 justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                !clemencyData?.linkDateProgClemencyPetition && "text-muted-foreground"
                                            )} disabled={userRoles.includes("VIEWER")}>
                                                {clemencyData && moment(clemencyData?.linkDateProgClemencyPetition).isValid() ? (
                                                <>
                                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                                  {convertToUTCDate(clemencyData?.linkDateProgClemencyPetition)}
                                                </>
                                              ) : (
                                                userRoles.includes("VIEWER") ? "-" : (
                                                  <>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    <span>Pick a date</span>
                                                  </>
                                                )
                                              )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent id="linkDateProgClemencyPetition" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                        <Calendar
                                            defaultView="century"
                                            onChange={(e: any) => {
                                                let dateObj = new Date(e);
                                                let day = dateObj.getDate()
                                                let month = dateObj.getMonth() + 1;
                                                let year = dateObj.getFullYear()
                                                let dateStr = moment(dateObj).format("YYYY-MM-DD");
                                                setClemencyPetitionDate(e)

                                                let newData  = clemencyData;
                                                newData['linkDateProgClemencyPetition'] = dateStr
                                                setClemencyData(newData);
                                                setValue("data",newData);

                                            }}
                                            defaultValue={clemencyData && moment(clemencyData?.linkDateProgClemencyPetition).isValid() ? convertToUTCDate(clemencyData?.linkDateProgClemencyPetition): null}
                                            />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <Label htmlFor="linkDatePAMetWithClemencyOff" className="text-[0.7rem] font-semibold text-gray-600">
                                Date
                            </Label>
                            <div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "h-8 w-1/2 justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                !clemencyData?.linkDatePAMetWithClemencyOff && "text-muted-foreground"
                                            )} disabled={userRoles.includes("VIEWER")}>
                                                {clemencyData && moment(clemencyData?.linkDatePAMetWithClemencyOff).isValid() ? (
                                                <>
                                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                                  {convertToUTCDate(clemencyData?.linkDatePAMetWithClemencyOff)}
                                                </>
                                              ) : (
                                                userRoles.includes("VIEWER") ? "-" : (
                                                  <>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    <span>Pick a date</span>
                                                  </>
                                                )
                                              )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent id="linkDatePAMetWithClemencyOff" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                        <Calendar
                                            defaultView="century"
                                            onChange={(e: any) => {
                                                let dateObj = new Date(e);
                                                // let day = dateObj.getDate()
                                                // let month = dateObj.getMonth() + 1;
                                                // let year = dateObj.getFullYear()
                                                let dateStr = moment(dateObj).format("YYYY-MM-DD");
                                                let newData  = clemencyData;
                                                newData['linkDatePAMetWithClemencyOff'] = dateStr
                                                setClemencyOffDate(e)

                                                setClemencyData(newData);
                                                setValue("data",newData);

                                            }}
                                            defaultValue={clemencyData && moment(clemencyData?.linkDatePAMetWithClemencyOff).isValid() ? convertToUTCDate(clemencyData?.linkDatePAMetWithClemencyOff) : null}
                                            />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <Label htmlFor="linkDatePAAtCommutationHrg" className="text-[0.7rem] font-semibold text-gray-600">
                                Date
                            </Label>
                            <div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "h-8 w-1/2 justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                !clemencyData?.linkDatePAAtCommutationHrg && "text-muted-foreground"
                                            )} disabled={userRoles.includes("VIEWER")}>
                                                {clemencyData && moment(clemencyData?.linkDatePAAtCommutationHrg).isValid() ? (
                                                <>
                                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                                  {convertToUTCDate(clemencyData?.linkDatePAAtCommutationHrg)}
                                                </>
                                              ) : (
                                                userRoles.includes("VIEWER") ? "-" : (
                                                  <>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    <span>Pick a date</span>
                                                  </>
                                                )
                                              )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent id="linkDatePAAtCommutationHrg" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                        <Calendar
                                            defaultView="century"
                                            onChange={(e: any) => {
                                                let dateObj = new Date(e);
                                                let day = dateObj.getDate()
                                                let month = dateObj.getMonth() + 1;
                                                let year = dateObj.getFullYear()
                                                let dateStr = moment(dateObj).format("YYYY-MM-DD");
                                                setCommutationHrgDate(e)
                                                let newData  = clemencyData;
                                                newData['linkDatePAAtCommutationHrg'] = dateStr
                                                setClemencyData(newData);
                                                setValue("data",newData);

                                            }}
                                            defaultValue={clemencyData && moment(clemencyData?.linkDatePAAtCommutationHrg).isValid() ? convertToUTCDate(clemencyData?.linkDatePAAtCommutationHrg) : null}
                                            />
                                    </PopoverContent>
                                </Popover>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            </div>
            </>
                )}
                {!userRoles.includes("VIEWER") && (
            <div className="border-t flex justify-end p-2">
                            <DialogFooter className="gap-2 mr-7">
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
