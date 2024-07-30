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
import { useContext } from 'react';
import { CaseFilterContext } from "@/context/caseFilterContext"

export default function FilterPleadingsCaseDialog(props: any) {
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
    const appliedCaseFilters = useContext<any>(CaseFilterContext);
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

    const onSubmit = async (e: any) => {
            try {
                e.preventDefault();

                let pleadings = pleadingsData?.map((map_ele : any)=>{
                    return map_ele?.pleadName;
                });

                let filterObj = {
                    page: props?.page,
                    limit : props?.limit,
                    pleadName : pleadings
                }
                props?.closeFilter(filterObj);
        
            } catch (error: any) {
            }
    }


    React.useEffect(()=>{
        if( appliedCaseFilters){
            setPleadingsData(appliedCaseFilters);
        }
        fetchCodeTypeData();
    },[])

    return (
        <div>
        <form onSubmit={onSubmit}>
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
           
            <div className="flex justify-end p-2.5">
                {!userRoles.includes("VIEWER") && (
                <Icons.add className="w-4 h-4 cursor-pointer" onClick={() => {
                        let newData = JSON.parse(JSON.stringify([...pleadingsData, {pleadName : '',pleadDateFiled : null,pleadNotes : ''}]))
                        setPleadingsData(newData);
                        let payLoadData : any = {
                            pleadings : newData,
                            pleadingsDelete : pleadingsDeleteData
                        };
                      }}
                      />
                    )}
            </div>
            <div>
             { pleadingsData && pleadingsData?.length > 0 && pleadingsData?.map((pleadings_ele : any, i: any)=>{
               if( pleadingsData[i] && typeof pleadingsData[i] === "object"){
                return (
                    <div key={i} className="grid grid-cols-3 gap-2 border border-dashed p-2 mb-2">
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
                                  }
                                  }}
                                  />
                                )}
                            </div>
                           </div>

                    <div className="col-span-2">
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
                                         <Icons.save className="w-4 h-4 mr-0.5" /> Apply Filters
                                        </Button>
                                    )}
                                </DialogFooter>
                            </div>
        )}
            </form>

        </div >
    )
}
