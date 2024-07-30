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
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from 'next/navigation'
import { Form, useForm } from "react-hook-form"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from "@/components/ui/command"
  import { Check, ChevronsUpDown } from "lucide-react"
  import { getSession } from "next-auth/react";
  import { Checkbox } from "@/components/ui/checkbox"
  import { toast } from "../../../components/ui/use-toast"
  import * as z from "zod"
  const CaseProgramSchema = z.object({
      data: z.any(),
  });
  type FormData = z.infer<typeof CaseProgramSchema>

export default function ConsulateDialog(props : any) {
    const [date, setDate] = React.useState<any>(null)
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors , isSubmitted},
    } = useForm<FormData>({
        resolver: zodResolver(CaseProgramSchema)
    })

    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [consulateId, setConsulateId] = React.useState<any>("");
    const [isLoading, setIsLoading] = React.useState(true)
    const [userRoles, setUserRoles] = React.useState<string[]>([])
    const [ciNotified , setCiNotified] = React.useState<any>("");
    const [ciDateNotified, setCiDateNotified] = React.useState<any>("");
    const [ciNotifiedByWhom, setCiNotifiedByWhom] = React.useState<any>("");
    const [ciNotifiedHow, setCiNotifiedHow] = React.useState<any>("");
    const [ciDateFirstVisit, setCiDateFirstVisit] = React.useState<any>("");
    const [ciDateFirstVisitApprox, setCiDateFirstVisitApprox] = React.useState<any>("");
    const [ciContactedFamily, setCiContactedFamily] = React.useState<any>("");
    const [ciRecordsObtained, setCiRecordsObtained] = React.useState<any>("");
    const [ciRecordsCheck, setCiRecordsCheck] = React.useState<any>("");
    const [ciAssistWithVisas, setCiAssistWithVisas] = React.useState<any>("");
    const [ciPaidFamilyTravel, setCiPaidFamilyTravel] = React.useState<any>("");
    const [ciRecordsDesc, setCiRecordsDesc] = React.useState<any>("");
    const [ciLegalMaterials, setCiLegalMaterials] = React.useState<any>("");
    const [ciAssistDefenseMex, setCiAssistDefenseMex] = React.useState<any>("");
    const [ciDateMetDefAtt, setCiDateMetDefAtt] = React.useState<any>("");
    const [ciInterpretation, setCiInterpretation] = React.useState<any>("");
    const [ciMetWithDefAtt, setCiMetWithDefAtt] = React.useState<any>("");
    const [ciDeathPenPosLtrToCourt, setCiDeathPenPosLtrToCourt] = React.useState<any>("");
    const [ciMetWithPros, setCiMetWithPros] = React.useState<any>("");
    const [ciDeathPenPosLtrToPros, setCiDeathPenPosLtrToPros] = React.useState<any>("");
    const [ciNotes, setCiNotes] = React.useState<any>("");
    const [ciDateMet, setCiDateMet] = React.useState<any>("");
    const [consulateData, setConsulateDate] = React.useState<any>({})

    const fetchData = async()=>{
       const responseData = await axiosInstance.get(`${baseURL}/v1/defendants/consulate/${props?.defId}/${props?.caseId}`);
       setIsLoading(false)
        if( responseData?.data?.data){
            let consulate = responseData?.data?.data;
            setConsulateDate(consulate);
            if( consulate?.id){
                setConsulateId(responseData?.data?.data?.id)
            }
            if( consulate?.ciNotified){
                setCiNotified(consulate?.ciNotified);
            }
            if( consulate?.ciDateNotified){
                setCiDateNotified(moment(consulate?.ciDateNotified).isValid() ? convertToUTCDate(consulate?.ciDateNotified) : null);
            }
            if( consulate?.ciNotifiedByWhom){
                setCiNotifiedByWhom(consulate?.ciNotifiedByWhom);
            }
            if( consulate?.ciNotifiedHow){
                setCiNotifiedHow(consulate?.ciNotifiedHow);
            }
            if( consulate?.ciDateFirstVisit){
                setCiDateFirstVisit(moment(consulate?.ciDateFirstVisit).isValid() ? convertToUTCDate(consulate?.ciDateFirstVisit): null );
            }
            if( consulate?.ciDateFirstVisitApprox){
                setCiDateFirstVisitApprox(consulate?.ciDateFirstVisitApprox);
            }
            if( consulate?.ciContactedFamily){
                setCiContactedFamily(consulate?.ciContactedFamily);
            }
            if( consulate?.ciRecordsObtained){
                setCiRecordsObtained(consulate?.ciRecordsObtained);
            }
            if( consulate?.ciRecordsCheck){
                setCiRecordsCheck(consulate?.ciRecordsCheck);
            }
            if( consulate?.ciAssistWithVisas){
                setCiAssistWithVisas(consulate?.ciAssistWithVisas);
            }
            if( consulate?.ciPaidFamilyTravel){
                setCiPaidFamilyTravel(consulate?.ciPaidFamilyTravel);
            }
            if( consulate?.ciRecordsDesc){
                setCiRecordsDesc(consulate?.ciRecordsDesc);
            }
            if( consulate?.ciLegalMaterials){
                setCiLegalMaterials(consulate?.ciLegalMaterials);
            }
            if( consulate?.ciAssistDefenseMex){
                setCiAssistDefenseMex(consulate?.ciAssistDefenseMex);
            }
            if( consulate?.ciDateMetDefAtt){
                setCiDateMetDefAtt(moment(consulate?.ciDateMetDefAtt).isValid() ? convertToUTCDate(consulate?.ciDateMetDefAtt) : null);
            }
            if( consulate?.ciDateMet){
                setCiDateMet(moment(consulate?.ciDateMet).isValid() ? convertToUTCDate(consulate?.ciDateMet) : null);
            }
            if( consulate?.ciInterpretation){
                setCiInterpretation(consulate?.ciInterpretation);
            }
            if( consulate?.ciMetWithDefAtt){
                setCiMetWithDefAtt(consulate?.ciMetWithDefAtt);
            }
            if( consulate?.ciDeathPenPosLtrToCourt){
                setCiDeathPenPosLtrToCourt(consulate?.ciDeathPenPosLtrToCourt);
            }
            if( consulate?.ciMetWithPros){
                setCiMetWithPros(consulate?.ciMetWithPros);
            }
            if( consulate?.ciDeathPenPosLtrToPros){
                setCiDeathPenPosLtrToPros(consulate?.ciDeathPenPosLtrToPros);
            }
            if( consulate?.ciNotes){
                setCiNotes(consulate?.ciNotes);
            }

        }
    }

    const onSubmit = async (payload: any) => {

       let payloadData = {
        ciNotified  : ciNotified  ? ciNotified  : null,
        ciDateNotified : ciDateNotified ? ciDateNotified : null,
        ciNotifiedByWhom : ciNotifiedByWhom ? ciNotifiedByWhom : null,
        ciNotifiedHow : ciNotifiedHow ? ciNotifiedHow : null,
        ciDateFirstVisit : ciDateFirstVisit ? ciDateFirstVisit : null,
        ciDateFirstVisitApprox : ciDateFirstVisitApprox ? ciDateFirstVisitApprox : null,
        ciAssistWithVisas : ciAssistWithVisas ? ciAssistWithVisas : null,
        ciPaidFamilyTravel : ciPaidFamilyTravel ? ciPaidFamilyTravel : null,
        ciContactedFamily : ciContactedFamily ? ciContactedFamily : null,
        ciRecordsObtained : ciRecordsObtained ? ciRecordsObtained : null,
        ciRecordsCheck : ciRecordsCheck ? ciRecordsCheck : null,
        ciRecordsDesc : ciRecordsDesc ? ciRecordsDesc : null,
        ciLegalMaterials : ciLegalMaterials ? ciLegalMaterials : null,
        ciAssistDefenseMex : ciAssistDefenseMex ? ciAssistDefenseMex : null,
        ciDateMetDefAtt : ciDateMetDefAtt ? ciDateMetDefAtt : null,
        ciInterpretation : ciInterpretation ? ciInterpretation : null,
        ciMetWithDefAtt : ciMetWithDefAtt ? ciMetWithDefAtt : null,
        ciDeathPenPosLtrToCourt : ciDeathPenPosLtrToCourt ? ciDeathPenPosLtrToCourt : null,
        ciMetWithPros : ciMetWithPros ? ciMetWithPros : null,
        ciDeathPenPosLtrToPros : ciDeathPenPosLtrToPros ? ciDeathPenPosLtrToPros : null,
        ciNotes : ciNotes ? ciNotes : null,
        ciDateMet : ciDateMet ? ciDateMet : null
       }


         try {
            if( consulateId){
                const res = await axiosInstance.patch(`${baseURL}/v1/defendants/consulate/${consulateId}`, payloadData)
                if (res?.status === 500 || res?.status === 400) {
                    toast({
                        variant: "default",
                        description: "Consulate details updated failed",
                        style: {
                            background: "red",
                        },
                    })
                } else {
                    toast({
                        variant: "default",
                        description: "Consulate details updated successfully",
                        style: {
                            background: "#03C03C",
                        },
                    })
                }
            }else{
                const res = await axiosInstance.post(`${baseURL}/v1/defendants/consulate/${props?.defId}/${props?.caseId}`, payloadData)
                setConsulateId(res?.data?.data?.id);
                if (res?.status === 500 || res?.status === 400) {
                    toast({
                        variant: "default",
                        description: "Created Failed",
                        style: {
                            background: "red",
                        },
                    })
                } else {
                    toast({
                        variant: "default",
                        description: "Created Successfully",
                        style: {
                            background: "#03C03C",
                        },
                    })
                }
            }
         }
         catch (error: any) {}
    }

    React.useEffect(()=>{
    const fetchUserRoles = async () => {
            const session = await getSession();
            setUserRoles(session?.user?.roles || []);
          };

      fetchUserRoles();
      fetchData();
    },[])


    return (
       <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                {isLoading && (
          <div className="h-[calc(100vh-18.5rem)]">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20">
              <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-red-700" />
            </div>
          </div>
        )}

        {!isLoading && (
            <>
           <div className="thin-scrollbar h-[calc(100vh-18.5rem)] overflow-y-auto mx-1 p-4">
                    <div className="flex justify-start items-center">
                        <Label className='text-sm font-semibold'>Notification of the case to the consulate</Label>
                    </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
            <div className="">
                    <Label htmlFor="dateDeathSought?" className="text-[0.7rem] font-semibold text-gray-600">
                    Date consulate learned of case
                    </Label>
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "h-8 w-full md:w-1/2 justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                        !ciDateNotified && "text-muted-foreground"
                                    )} disabled={userRoles.includes("VIEWER")}>
                                         {ciDateNotified&& moment(ciDateNotified).isValid() ? (
                                      <>
                                      <div className='flex'>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {convertToUTCDate(ciDateNotified)}
                                        </div>
                                        <div className='flex'>
                                        <Icons.close className="h-4 w-4" onClick = { ()=>{
                                            setValue("data",{ ...consulateData, ciDateMet : null});
                                            setCiDateNotified(null)
                                        }}/>
                                        </div>
                                      </>
                                    ) : (
                                      userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                        <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                      </div>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent id="crime-date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                <Calendar
                                    defaultView="century"
                                    onChange={(e: any) => {
                                        let dateObj = new Date(e);
                                        let day = dateObj.getDate()
                                        let month = dateObj.getMonth() + 1;
                                        let year = dateObj.getFullYear()
                                        let dateStr = `${month}/${day}/${year}`;
                                        setValue("data",{ ...consulateData, ciDateNotified : dateStr});
                                        setCiDateNotified(e)

                                    }}
                                    value={ciDateNotified}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="enforcement-of-defendant-detention">
                        Was consulate notified by law enforcement of defendant’s detention?</Label>
                        <Select
                            value={ciNotified}
                            onValueChange={(e) => {
                                setValue("data", { ...consulateData, ciNotified: e });
                                setCiNotified(e)
                            }}

                        >
                        <SelectTrigger id="enforcement-of-defendant-detention" disabled={userRoles.includes("VIEWER")} className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {ciNotified
                                                    ? ciNotified
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className='dark:bg-slate-900 text-xs'>
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                               <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs">Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="Who-notified-consulate">
                        Who notified consulate?</Label>
                        <Input
                        value={ciNotifiedByWhom}
                        disabled={userRoles.includes("VIEWER")}
                        onChange={(e) => {
                            setValue("data", { ...consulateData, ciNotifiedByWhom: e.target.value });
                            setCiNotifiedByWhom(e.target.value)
                        }}
                        placeholder={userRoles.includes("VIEWER") ? "-" : "Type here"}
                        className='w-[320px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none'
                        />

                </div>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="how">How?</Label>
                    <Input
                        id="how"
                        value={ciNotifiedHow}
                        type="text"
                        className="w-[320px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                        disabled={userRoles.includes("VIEWER")}
                        placeholder={userRoles.includes("VIEWER") ? "-" : "Type here"}
                        onChange={(e) => {
                            setValue("data", { ...consulateData, ciNotifiedHow: e.target.value });
                            setCiNotifiedHow(e.target.value)
                        }} />
                </div>
                </div>
                <div className="border-y border-x-0 my-3" />
                    <div className="flex justify-start items-center my-2">
                        <Label className='text-sm font-semibold'>Consular encounters</Label>
                    </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-2">
                    <div>
                        <Label htmlFor="visit-to-defendant" className="text-[0.7rem] font-semibold text-gray-600">
                            Date of first consular visit to defendant
                        </Label>
                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "h-8 w-full md:w-[225px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                            !ciDateFirstVisit && "text-muted-foreground"
                                        )} disabled={userRoles.includes("VIEWER")}>
                                             {ciDateFirstVisit&& moment(ciDateFirstVisit).isValid() ? (
                                      <>
                                      <div className='flex'>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {convertToUTCDate(ciDateFirstVisit)}
                                      </div>
                                        <div className='flex'>
                                        <Icons.close className="h-4 w-4" onClick = { ()=>{
                                                                                        setValue("data",{ ...consulateData, ciDateFirstVisit : null});
                                                                                        setCiDateFirstVisit(null)
                                        }}/>
                                        </div>
                                      </>
                                    ) : (
                                      userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                        <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                      </div>
                                    )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent id="visit-to-defendant" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                    <Calendar
                                        defaultView="century"
                                        onChange={(e: any) => {
                                            let dateObj = new Date(e);
                                            let day = dateObj.getDate()
                                            let month = dateObj.getMonth() + 1;
                                            let year = dateObj.getFullYear()
                                            let dateStr = `${month}/${day}/${year}`;
                                            setValue("data",{ ...consulateData, ciDateFirstVisit : dateStr});
                                            setCiDateFirstVisit(e)

                                        }}
                                        value={ciDateFirstVisit}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-center pt-5">
                        <Checkbox
                          checked={ciDateFirstVisitApprox}
                          onCheckedChange={(e)=>{
                            setValue("data",{ ...consulateData, ciDateFirstVisitApprox : e});
                            setCiDateFirstVisitApprox(e)

                          }}
                          disabled={userRoles.includes("VIEWER")}
                          className='disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text' />
                        <Label className="px-1 text-center text-xs">
                            Is this date approximate?
                        </Label>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 my-2'>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="defense-attorney">
                        Did consulate meet with defense attorney?</Label>
                    <Select
                   value={ciMetWithDefAtt}
                    onValueChange={(e)=>{
                        setValue("data",{ ...consulateData, ciMetWithDefAtt : e});
                        setCiMetWithDefAtt(e)
                    }}

                    >
                        <SelectTrigger
                            id="defense-attorney" disabled={userRoles.includes("VIEWER")}
                            className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Unknown" className="text-xs">
                                                {ciMetWithDefAtt
                                                    ? ciMetWithDefAtt
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs dark:bg-slate-900">
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                            <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs">Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                    <div className="">
                    <div>
                        <Label htmlFor="date" className="text-[0.7rem] font-semibold text-gray-600">
                            Date
                        </Label>
                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "h-8 w-full md:w-1/2 justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                            !ciDateMetDefAtt && "text-muted-foreground"
                                        )} disabled={userRoles.includes("VIEWER")}>
                                                        {ciDateMetDefAtt && moment(ciDateMetDefAtt).isValid() ? (
                                                            <>
                                                            <div className='flex'>
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {convertToUTCDate(ciDateMetDefAtt)}
                                                            </div>
                                                            <div className='flex'>
                                        <Icons.close className="h-4 w-4" onClick = { ()=>{
                                            setValue("data",{ ...consulateData, ciDateMetDefAtt : null});
                                            setCiDateMetDefAtt(null)
                                        }}/>
                                        </div>
                                                            </>
                                                        ) : (
                                                            userRoles.includes("VIEWER") ? "-" : 
                                                            <div className='flex'>
                                                                <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                            </div>
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
                                            setValue("data",{ ...consulateData, ciDateMetDefAtt : e});
                                            setCiDateMetDefAtt(e)

                                        }}
                                        value={ciDateMetDefAtt} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 my-2'>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="prosecutor">
                        Did consulate meet with prosecutor?</Label>
                    <Select
                                      value={ciMetWithPros}
                                       onValueChange={(e)=>{
                                           setValue("data",{ ...consulateData, ciMetWithPros : e});
                                           setCiMetWithPros(e)
                                       }}

                    >
                        <SelectTrigger
                            id="prosecutor" disabled={userRoles.includes("VIEWER")}
                            className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Unknown" className="text-xs">
                                                {ciMetWithPros
                                                    ? ciMetWithPros
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs dark:bg-slate-900">
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                            <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs" >Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <div>
                        <Label htmlFor="Date" className="text-[0.7rem] font-semibold text-gray-600">
                            Date
                        </Label>
                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "h-8 w-full md:w-1/2 justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                            !ciDateMet && "text-muted-foreground"
                                        )} disabled={userRoles.includes("VIEWER")}>
                                                        {ciDateMet && moment(ciDateMet).isValid() ? (
                                                            <>
                                                            <div className='flex'>
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {convertToUTCDate(ciDateMet)}
                                                                </div>
                                                                <div className='flex'>
                                                                    <Icons.close className="h-4 w-4" onClick={
                                                                        ()=> {
                                                                            setValue("data",{ ...consulateData, ciDateMet : null});
                                                                            setCiDateMet(null)
                                                                        }
                                                                    } />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            userRoles.includes("VIEWER") ? "-" :
                                                             <div className="flex">
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                <span>Pick a date</span>
                                                            </div>
                                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                    <Calendar
                                        defaultView="century"
                                        onChange={(e: any) => {
                                            let dateObj = new Date(e);
                                            let day = dateObj.getDate()
                                            let month = dateObj.getMonth() + 1;
                                            let year = dateObj.getFullYear()
                                            let dateStr = `${month}/${day}/${year}`;
                                            setValue("data",{ ...consulateData, ciDateMet : dateStr});
                                            setCiDateMet(dateStr)

                                        }}
                                        value={ciDateMet} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                </div>
                            <div className="border-y border-x-0 my-3" />
                            <div className="flex justify-start items-center">
                                <Label className='text-sm font-semibold'>Consular assistance</Label>
                            </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 my-2'>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="records-check-mexico">
                        Did consulate complete a criminal records check in Mexico?</Label>
                    <Select
                    value={ciRecordsCheck}
                    onValueChange={(e)=>{
                        setValue("data",{ ...consulateData, ciRecordsCheck : e});
                        setCiRecordsCheck(e)
                    }}

                    >
                        <SelectTrigger
                            id="records-check-mexico"
                            disabled={userRoles.includes("VIEWER")}
                            className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Unknown" className="text-xs">
                                                {ciRecordsCheck
                                                    ? ciRecordsCheck
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs dark:bg-slate-900">
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                            <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs">Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="records-from-mexico">
                        Did consulate obtain other records from Mexico?</Label>
                    <Select
                     value={ciRecordsObtained}
                    onValueChange={(e)=>{
                        setValue("data",{ ...consulateData, ciRecordsObtained : e});
                        setCiRecordsObtained(e)
                    }}

                    >
                        <SelectTrigger
                            id="records-from-mexico"
                            disabled={userRoles.includes("VIEWER")}
                            className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Unknown" className="text-xs">
                                                {ciRecordsObtained
                                                    ? ciRecordsObtained
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs dark:bg-slate-900">
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                            <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs">Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 my-2'>
                <div className='mt-6'>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="What-records">
                        If yes, What records?</Label>
                        <Input
                         value={ciRecordsDesc}
                         disabled={userRoles.includes("VIEWER")}
                         placeholder={userRoles.includes("VIEWER") ? "-" : "Type here"}
                         onChange={(e)=>{
                             setValue("data",{ ...consulateData, ciRecordsDesc : e.target.value});
                             setCiRecordsDesc(e.target.value)
                         }}
                         className='w-[320px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text'
                         />
                </div>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="travelling-to-Mexico">
                        Did consulate provide assistance to attorneys or investigators travelling to Mexico?</Label>
                    <Select
                     value={ciAssistDefenseMex}
                    onValueChange={(e)=>{
                        setValue("data",{ ...consulateData, ciAssistDefenseMex : e});
                        setCiAssistDefenseMex(e)
                    }}
                    >
                        <SelectTrigger
                            id="travelling-to-Mexico" disabled={userRoles.includes("VIEWER")}
                            className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Unknown" className="text-xs">
                                                {ciAssistDefenseMex
                                                    ? ciAssistDefenseMex
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs dark:bg-slate-900">
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                            <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs">Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
               </div>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-2 my-2'>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="interpretation-services">
                        Did consulate provide interpretation services?</Label>
                    <Select
                    value={ciInterpretation}
                    onValueChange={(e)=>{
                        setValue("data",{ ...consulateData, ciInterpretation : e});
                        setCiInterpretation(e)
                    }}

                    >
                        <SelectTrigger
                            id="interpretation-services" disabled={userRoles.includes("VIEWER")}
                            className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className="text-xs">
                                                {ciInterpretation
                                                    ? ciInterpretation
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs dark:bg-slate-900">
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                            <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs">Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="legal-materials">
                        Did consulate provide legal materials?</Label>
                    <Select
                    value={ciLegalMaterials}
                    onValueChange={(e)=>{
                        setValue("data",{ ...consulateData, ciLegalMaterials : e});
                        setCiLegalMaterials(e)
                    }}

                    >
                        <SelectTrigger
                            id="legal-materials" disabled={userRoles.includes("VIEWER")}
                            className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Unknown" className="text-xs">
                                                {ciLegalMaterials
                                                    ? ciLegalMaterials
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs dark:bg-slate-900">
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                            <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs">Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 my-2'>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="prosecutors-regarding">
                        Did consulate present letter to prosecutors regarding Mexico’s position on the death penalty?</Label>
                    <Select
                                      value={ciDeathPenPosLtrToPros}
                                       onValueChange={(e)=>{
                                           setValue("data",{ ...consulateData, ciDeathPenPosLtrToPros : e});
                                           setCiDeathPenPosLtrToPros(e)
                                       }}

                    >
                        <SelectTrigger
                            id="prosecutors-regarding" disabled={userRoles.includes("VIEWER")}
                            className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Unknown" className="text-xs">
                                                {ciDeathPenPosLtrToPros
                                                    ? ciDeathPenPosLtrToPros
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs dark:bg-slate-900">
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                            <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs">Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="death-penalty">
                        Did consulate present letter to Court regarding Mexico’s position on the death penalty?</Label>
                    <Select
                                       value={ciDeathPenPosLtrToCourt}
                                       onValueChange={(e)=>{
                                           setValue("data",{ ...consulateData, ciDeathPenPosLtrToCourt : e});
                                           setCiDeathPenPosLtrToCourt(e)
                                       }}
                    >
                        <SelectTrigger
                            id="death-penalty" disabled={userRoles.includes("VIEWER")}
                            className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Unknown" className="text-xs">
                                                {ciDeathPenPosLtrToCourt
                                                    ? ciDeathPenPosLtrToCourt
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs dark:bg-slate-900">
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                            <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs">Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 my-2'>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="contact-family-members">
                        Did consulate contact family members?</Label>
                    <Select
                   value={ciContactedFamily}
                    onValueChange={(e)=>{
                        setValue("data",{ ...consulateData, ciContactedFamily : e});
                        setCiContactedFamily(e)
                    }}
>
                        <SelectTrigger
                            id="contact-family-members" disabled={userRoles.includes("VIEWER")}
                            className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className="text-xs">
                                                {ciContactedFamily
                                                    ? ciContactedFamily
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs dark:bg-slate-900">
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                            <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs">Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="witnesses-in-obtaining-visas">
                        Did consulate assist defense witnesses in obtaining visas?</Label>
                    <Select
                    value={ciAssistWithVisas}
                    onValueChange={(e)=>{
                        setValue("data",{ ...consulateData, ciAssistWithVisas : e});
                        setCiAssistWithVisas(e)
                    }}

                    >
                        <SelectTrigger
                            id="witnesses-in-obtaining-visas" disabled={userRoles.includes("VIEWER")}
                            className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Unknown" className="text-xs">
                                                {ciAssistWithVisas
                                                    ? ciAssistWithVisas
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs dark:bg-slate-900">
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                            <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs">Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                </div>
                <div className='grid grid-cols-1 gap-2 my-2'>
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                        htmlFor="witnesses-in-obtaining-visas">
                       Did consulate pay for family members to travel to the U.S.?</Label>
                    <Select
                    value={ciPaidFamilyTravel}
                    onValueChange={(e)=>{
                        setValue("data",{ ...consulateData, ciPaidFamilyTravel : e});
                        setCiPaidFamilyTravel(e)
                    }}
                    >
                        <SelectTrigger
                            id="witnesses-in-obtaining-visas" disabled={userRoles.includes("VIEWER")}
                            className="h-8 w-full md:w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Unknown" className="text-xs">
                                                {ciPaidFamilyTravel
                                                    ? ciPaidFamilyTravel
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-xs dark:bg-slate-900">
                            <SelectGroup>
                            <SelectItem value="" className="text-xs">Select Option</SelectItem>
                            <SelectItem value="NA" className="text-xs">NA</SelectItem>
                                <SelectItem value="Yes" className="text-xs">Yes</SelectItem>
                                <SelectItem value="No" className="text-xs">No</SelectItem>
                                <SelectItem value="Unknown" className="text-xs">Unknown</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                </div>
                <div className="border-y border-x-0 my-3" />
                <div className="col-span-2 mr-0 md:mr-2 my-2">
                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="Consular-involvement">
                        General Comments on Consular Involvement</Label>
                    <Textarea id="Consular-involvement"
                     value={ciNotes}
                     disabled={userRoles.includes("VIEWER")}
                     onChange={(e)=>{
                         setValue("data",{ ...consulateData, ciNotes : e.target.value});
                         setCiNotes(e.target.value)
                     }}
                        className="h-20 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none" placeholder={userRoles.includes("VIEWER") ? "-" : "Type here.."} />
                </div>
                {/*  */}
            </div>
             </>
         )}
         {!userRoles.includes("VIEWER") && (
            <div className="border-t flex justify-end p-2">
                            <DialogFooter className="gap-2 mr-7 flex-row">
                                <DialogClose className="text-black-700 text-xs" hidden={props.hidetext === "View"}>Discard</DialogClose>
                                {props.hidetext !== "View" && (
                                    <Button type="submit" variant="outline" className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs">
                                     <Icons.save className="w-4 h-4 mr-0.5" /> Save
                                    </Button>
                                )}
                            </DialogFooter>
        </div>
         )}
            </form>
        </div>
    )
}
