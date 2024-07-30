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
import { getSession } from "next-auth/react";
import * as z from "zod"
const PleadingsSchema = z.object({
    data: z.any(),
});
type FormData = z.infer<typeof PleadingsSchema>
import { toast } from "../../../components/ui/use-toast"

export default function PleadingsCaseDialog(props: any) {
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(PleadingsSchema),
    })

    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = React.useState(true)
    const [dateIsOpen, setDateIsOpen] = React.useState(false)
    const [userRoles, setUserRoles] = React.useState<string[]>([])
    const [pleadingTypeList, setPleadingTypeList] = React.useState<any>([])
    // const [pleadings, setPleadings] = React.useState<any>([])
    const [dateFiled, setDateFiled] = React.useState<any>(null)
    const [pleadingsData, setPleadingsData] = React.useState<any>([{pleadName : '',pleadDateFiled : null,pleadNotes : ''}]);
    const [pleadingsDeleteData, setPleadingsDeleteData] = React.useState<any>([]);

    const [filterType, setFilterType] = React.useState<any>("");

    const fetchCodeTypeData = async ()=>{
        setIsLoading(true)
        const response = await axiosInstance.get(`${baseURL}/v1/codes/codeType/Pleading Type`);
            setIsLoading(false)
        let data = response?.data?.data ? response?.data?.data : [];
        setPleadingTypeList(data);
    }

    const fetchPleadingsData = async(filterValue : any)=>{
        setIsLoading(true)
        const response = await axiosInstance.get(`${baseURL}/v1/defendants/pleadings/${props?.defId}/${props?.caseId}?filter=${filterValue}`);
        setTimeout(() => {
            setIsLoading(false)
        }, 500);
        let responseData = response?.data?.data ? response?.data?.data : [{pleadName : '',pleadDateFiled : null,pleadNotes : ''}];
        setPleadingsData(responseData);

    }
    const onSubmit = async (payload: any) => {

            try {
                const res = await axiosInstance.post(`${baseURL}/v1/defendants/pleadings/${props?.defId}/${props?.caseId}`, payload)
                if (res?.status === 500 || res?.status === 400) {
                    toast({
                        variant: "default",
                        description: "Pleading details updated failed",
                        style: {
                            background: "red",
                        },
                    })
                } else {
                    toast({
                        variant: "default",
                        description: "Pleading details updated successfully",
                        style: {
                            background: "#03C03C",
                        },
                    })
                }
                props.refreshGrid()
                reset()
                // setIsOpen(false)
            } catch (error: any) {
            }
    }


    React.useEffect(()=>{
        const fetchUserRoles = async () => {
            const session = await getSession();
            setUserRoles(session?.user?.roles || []);
          };

        fetchUserRoles();
        fetchCodeTypeData();
        fetchPleadingsData('');
    },[])

    return (
        <div>
        <form onSubmit={handleSubmit(onSubmit)}>
        {isLoading && (
          <div className="h-[calc(100vh-19rem)]">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/20">
              <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-red-700" />
            </div>
          </div>
        )}

        {!isLoading && (
            <>
        <div className="thin-scrollbar h-[calc(100vh-19rem)] overflow-y-auto mx-1 p-2">
            <div className="flex justify-end">
                <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="pleadingType">Filter By Pleading Type</Label>
                    <Select
                    value={filterType}
                    onValueChange={(e)=>{
                        setFilterType(e);
                        fetchPleadingsData(e);
                    }}
                    >
                            <SelectTrigger id="pleading" disabled={userRoles.includes("VIEWER")} className="h-8 w-[310px] text-xs whitespace-nowrap disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                <SelectValue placeholder="Select Type" className='text-xs'>
                                                {filterType
                                                    ? filterType
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className='h-48 w-[310px] overflow-y-auto dark:bg-slate-900'>
                            <SelectGroup>
                                <SelectItem value="" className="text-xs">Select All</SelectItem>
                                        {pleadingTypeList &&
                                          pleadingTypeList?.map(
                                            (map_ele: any, i: any) => (
                                              <SelectItem
                                                value={String(map_ele?.codeCode)}
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
            <div className="flex justify-end p-2.5">
                {!userRoles.includes("VIEWER") && (
                <Icons.add className="w-4 h-4 cursor-pointer" onClick={() => {
                        let newData = JSON.parse(JSON.stringify([...pleadingsData, {pleadName : '',pleadDateFiled : null,pleadNotes : ''}]))
                        setPleadingsData(newData);
                        let payLoadData : any = {
                            pleadings : newData,
                            pleadingsDelete : pleadingsDeleteData
                        };
                        setValue("data",payLoadData);
                      }}
                      />
                    )}
            </div>
            <div>
             { pleadingsData && pleadingsData?.length > 0 && pleadingsData?.map((pleadings_ele : any, i: any)=>{
               if( pleadingsData[i] && typeof pleadingsData[i] === "object"){
                return (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 border border-dashed p-2 mb-2">
                           <div className="col-span-3">
                            <div className='flex justify-end'>
                                {!userRoles.includes("VIEWER") && (
                            <Icons.close className="w-4 h-4 cursor-pointer" onClick={()=>{
                                  let oldData: any = JSON.parse(
                                    JSON.stringify(pleadingsData)
                                  )
                                  if( oldData[i]){
                                    let deleteItem :any = JSON.parse(JSON.stringify(oldData[i]))
                                    setPleadingsDeleteData([...pleadingsDeleteData,deleteItem]);
                                    delete oldData[i]
                                    setPleadingsData(oldData)
                                    let payLoadData : any = {
                                        pleadings : oldData,
                                        pleadingsDelete : [...pleadingsDeleteData,deleteItem]
                                    };
                                    setValue("data",payLoadData);
                                  }
                                  }}
                                  />
                                )}
                            </div>
                           </div>

                    <div className="col-span-1 md:col-span-2">
                        <Label htmlFor="pleading" className="text-[0.7rem] font-semibold text-gray-600">
                            Pleading
                        </Label>
                        <Select
                        value={pleadingsData[i]['pleadName']}
                        onValueChange={(e)=>{
                            let newData = [...pleadingsData];
                            newData[i]['pleadName'] = e;
                            setPleadingsData(newData);
                            let payLoadData : any = {
                                pleadings : newData,
                                pleadingsDelete : pleadingsDeleteData
                            };
                            setValue("data",payLoadData);

                        }}
                        >
                            <SelectTrigger id="pleading" disabled={userRoles.includes("VIEWER")} className="h-8 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                <SelectValue placeholder="Select Type" className='text-xs'>
                                        {pleadingsData[i]['pleadName']
                                            ? pleadingsData[i]['pleadName']
                                            : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className='h-48 overflow-y-auto dark:bg-slate-900'>
                            <SelectGroup>
                                <SelectItem value="" className="text-xs">Select Type</SelectItem>
                                        {pleadingTypeList &&
                                          pleadingTypeList?.map(
                                            (map_ele: any, i: any) => (
                                              <SelectItem
                                                value={String(map_ele?.codeCode)}
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

                    <div className="">
                        <Label htmlFor="dateFiled" className="text-[0.7rem] font-semibold text-gray-600">
                            Date Filed
                        </Label>
                        <div>
                            <Popover >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "h-8 w-full justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                            !pleadingsData[i]['pleadDateFiled'] && "text-muted-foreground"
                                        )} disabled={userRoles.includes("VIEWER")}>
                                             {pleadingsData[i]['pleadDateFiled']&& moment(pleadingsData[i]['pleadDateFiled']).isValid() ? (
                                      <>
                                        <div className='flex'>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {convertToUTCDate(pleadingsData[i]['pleadDateFiled'])}</div>
                                        <div className="ml-14 w-4">
                                          <Icons.close className="h-4 w-4"
                                           onClick={()=>{
                                            let newData = [...pleadingsData];
                                            newData[i]['pleadDateFiled'] = null
                                            setPleadingsData(newData);
                                        }} />
                                        </div>
                                      </>
                                    ) : (
                                        userRoles.includes("VIEWER") ? "-" : 
                                        <div className='flex'>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <span>Pick a date</span>
                                      </div>
                                    )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent id="dateFiled" className="text-xs text-black thin-scrollbar m-1 w-[270px] max-h-50 overflow-y-auto p-0">
                                    <Calendar
                                        defaultView="century"
                                        onChange={(e: any) => {
                                            let dateObj = new Date(e);
                                            let day = dateObj.getDate()
                                            let month = dateObj.getMonth() + 1;
                                            let year = dateObj.getFullYear()
                                            let dateStr = `${month}/${day}/${year}`;
                                            setDateFiled(e);

                                            let newData = [...pleadingsData];
                                            newData[i]['pleadDateFiled'] = dateStr;
                                            setPleadingsData(newData);
                                            let payLoadData : any = {
                                                pleadings : newData,
                                                pleadingsDelete : pleadingsDeleteData
                                            };
                                            setValue("data",payLoadData);

                                            setDateIsOpen(false)
                                        }}
                                        value={moment(pleadingsData[i]['pleadDateFiled']).isValid() ? convertToUTCDate(pleadingsData[i]['pleadDateFiled']) : null}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="col-span-3">
                        <Label htmlFor="notes" className="text-[0.7rem] font-semibold text-gray-600">
                            Notes
                        </Label>
                        <Textarea
                        value={pleadingsData[i]['pleadNotes']}
                        disabled={userRoles.includes("VIEWER")}
                        onChange={(e)=>{
                            let value = e.target.value;
                            let newData = [...pleadingsData];
                            newData[i]['pleadNotes'] = value;
                            setPleadingsData(newData);
                            let payLoadData : any = {
                                pleadings : newData,
                                pleadingsDelete : pleadingsDeleteData
                            };
                            setValue("data",payLoadData);
                        }}
                            id="notes"
                            placeholder={userRoles.includes("VIEWER") ? "-" : "Type Here..."}
                            className="h-20 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none"
                        />
                    </div>
                </div>

                )
               }
             })}
            </div>
            </div>
            </>
        )}
        {userRoles && !userRoles.includes("VIEWER") && (
            <div className="border-t mt-2 flex justify-end p-2">
                                <DialogFooter className="gap-2 mr-7 flex-row">
                                    <DialogClose className="text-black-700 text-xs" hidden={userRoles.includes("VIEWER")}>Discard</DialogClose>
                                    {!userRoles.includes("VIEWER") && (
                                        <Button type="submit" variant="outline" className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs">
                                         <Icons.save className="w-4 h-4 mr-0.5" /> Save
                                        </Button>
                                    )}
                                </DialogFooter>
                            </div>
        )}
            </form>

        </div >
    )
}
