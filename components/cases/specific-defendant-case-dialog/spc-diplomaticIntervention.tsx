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
import { getSession } from 'next-auth/react'
import * as z from "zod"
const DiplomaticSchema = z.object({
    data: z.any(),
});
type FormData = z.infer<typeof DiplomaticSchema>
import { toast } from "../../../components/ui/use-toast"

export default function DiplomaticInterventionDialog(props : any) {

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
            linkDiplomaticInterventionNotes : '',
            linkDiplomaticNoteFiled : '',
            linkDateDiplomaticNoteFiled : null
        }
    },
    resolver: zodResolver(DiplomaticSchema),
})

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
const searchParams = useSearchParams();
const [userRoles, setUserRoles] = React.useState<string[]>([])
const [isLoading, setIsLoading] = React.useState(true)
const [dateIsOpenDiplomatic, setDateIsOpenDiplomatic] = React.useState(false)
const [dateFiledDiplomatic, setDateFiledDiplomatic] = React.useState<any>(null)
const [diplomaticData, setDiplomaticData] = React.useState<any>({
    linkDiplomaticInterventionNotes : '',
    linkDiplomaticNoteFiled : '',
    linkDateDiplomaticNoteFiled : null,
    linkDOSResponse : '',
    linkDateDOSResponse : null,
    linkFollowUpNotesFiled : '',
    linkDateFollowUpNotesFiled : null
});

const [noteFiled,setNoteFiled] = React.useState("");
const [dosResponse, setDosResponse] = React.useState("");
const [followupNotes, setFolloupNotes] = React.useState("");

const fetchData = async()=>{
    const response = await axiosInstance.get(`${baseURL}/v1/defendants/caseDefLink/${props?.defId}/${props?.caseId}`);
    setIsLoading(false)
    if( response?.data?.data) {
        if( response?.data?.data?.linkDiplomaticNoteFiled){
            setNoteFiled(response?.data?.data?.linkDiplomaticNoteFiled)
        }
        if( response?.data?.data?.linkDOSResponse){
            setDosResponse(response?.data?.data?.linkDOSResponse)
        }
        if( response?.data?.data?.linkFollowUpNotesFiled){
            setFolloupNotes(response?.data?.data?.linkFollowUpNotesFiled)
        }
        setDiplomaticData(response?.data?.data);
        setValue("data",response?.data?.data)
    }
}
const onSubmit = async (payload: any) => {

       let payloadData = {
        linkDiplomaticInterventionNotes : payload?.data?.linkDiplomaticInterventionNotes,
        linkDOSResponse : payload?.data?.linkDOSResponse,
        linkDateDOSResponse : payload?.data?.linkDateDOSResponse,
        linkFollowUpNotesFiled : payload?.data?.linkFollowUpNotesFiled,
        linkDateFollowUpNotesFiled : payload?.data?.linkDateFollowUpNotesFiled,
        linkDiplomaticNoteFiled : payload?.data?.linkDiplomaticNoteFiled,
        linkDateDiplomaticNoteFiled : payload?.data?.linkDateDiplomaticNoteFiled ? payload?.data?.linkDateDiplomaticNoteFiled : null
       }
        try {
                const res = await axiosInstance.patch(`${baseURL}/v1/defendants/caseDefLink/${props?.defId}/${props?.caseId}`, payloadData)
                if (res?.status === 500 || res?.status === 400) {
                    toast({
                        variant: "default",
                        description: "Diplomatic intervention details updated failed",
                        style: {
                            background: "red",
                        },
                    })
                } else {
                    toast({
                        variant: "default",
                        description: "Diplomatic intervention details updated successfully",
                        style: {
                            background: "#03C03C",
                        },
                    })
                }

        } catch (error: any) {
        }
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
            <div className="thin-scrollbar h-[calc(100vh-18.5rem)] overflow-y-auto mx-1 p-3">
        <div className=' border border-dashed py-2 p-2'>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-2">
                <div className="col-span-2">
                    <Label htmlFor="diplomaticNote" className="text-[0.7rem] font-semibold text-gray-600">
                    Diplomatic note filed?
                    </Label>
                    <Select
                    value={noteFiled}
                    onValueChange={(e)=>{
                        let newData  = diplomaticData;
                            newData['linkDiplomaticNoteFiled'] = e;
                            setDiplomaticData(newData);
                            setValue("data",newData);
                            setNoteFiled(e)
                    }}
                    >
                        <SelectTrigger id="diplomaticNote" disabled={userRoles.includes("VIEWER")} className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Select Option" className='text-xs'>
                            {noteFiled ? noteFiled : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
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

                <div className="">
                    <Label htmlFor="dateFiledDiplomatic" className="text-[0.7rem] font-semibold text-gray-600">
                       Date
                    </Label>
                    <div>
                        <Popover >
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "h-8 w-full justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                        !dateFiledDiplomatic && "text-muted-foreground"
                                    )} disabled={userRoles.includes("VIEWER")}>
                                         {diplomaticData && moment(diplomaticData?.linkDateDiplomaticNoteFiled).isValid() ? (
                                                <>
                                                <div className="flex">
                                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                                  {convertToUTCDate(diplomaticData?.linkDateDiplomaticNoteFiled)}
                                                </div>
                                                <div className='flex'>
                                        <Icons.close className="h-4 w-4" onClick = { ()=>{
                                            setDateFiledDiplomatic(null);
                                            let newData = diplomaticData
                                            newData['linkDateDiplomaticNoteFiled'] = null;
                                            setDiplomaticData(newData);
                                            setValue("data",newData);
                                        }}/>
                                        </div>
                                                </>
                                              ) : (
                                                userRoles.includes("VIEWER") ? "-" : (
                                                    <div className="flex">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    <span>Pick a date</span>
                                                  </div>
                                                )
                                              )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent id="dateFiledDiplomatic" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                <Calendar
                                    defaultView="century"
                                    onChange={(e: any) => {
                                        let dateObj = new Date(e);
                                        let day = dateObj.getDate()
                                        let month = dateObj.getMonth() + 1;
                                        let year = dateObj.getFullYear()
                                        let dateStr = `${month}/${day}/${year}`;
                                        setDateFiledDiplomatic(e);
                                        let newData = diplomaticData
                                        newData['linkDateDiplomaticNoteFiled'] = dateStr;
                                        setDiplomaticData(newData);
                                        setValue("data",newData);

                                        setDateIsOpenDiplomatic(false)
                                    }}
                                    defaultValue={diplomaticData && moment(diplomaticData?.linkDateDiplomaticNoteFiled).isValid() ? convertToUTCDate(diplomaticData.linkDateDiplomaticNoteFiled) : null}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-2">
                <div className="col-span-2">
                    <Label htmlFor="Department-of-State" className="text-[0.7rem] font-semibold text-gray-600">
                    Response received from Department of State?
                    </Label>
                    <Select
                    value={dosResponse}
                    onValueChange={(e)=>{
                        let newData  = diplomaticData;
                            newData['linkDOSResponse'] = e;
                            setDiplomaticData(newData);
                            setValue("data",newData);
                            setDosResponse(e)
                    }}
                    >
                        <SelectTrigger id="Department-of-State" disabled={userRoles.includes("VIEWER")} className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Select Option" className='text-xs'>
                            {dosResponse ? dosResponse : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
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

                <div className="">
                    <Label htmlFor="dateDepartmentState" className="text-[0.7rem] font-semibold text-gray-600">
                       Date
                    </Label>
                    <div>
                        <Popover >
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "h-8 w-full justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                        !dateFiledDiplomatic && "text-muted-foreground"
                                    )} disabled={userRoles.includes("VIEWER")}>
                                        {diplomaticData && moment(diplomaticData?.linkDateDOSResponse).isValid() ? (
                                                <>
                                                <div className="flex">
                                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                                  {convertToUTCDate(diplomaticData?.linkDateDOSResponse)}
                                                </div>
                                                <div className='flex'>
                                        <Icons.close className="h-4 w-4" onClick = { ()=>{
                                             setDateFiledDiplomatic(null);
                                             let newData = diplomaticData
                                             newData['linkDateDOSResponse'] = null;
                                             setDiplomaticData(newData);
                                             setValue("data",newData);
                                        }}/>
                                        </div>
                                                </>
                                              ) : (
                                                userRoles.includes("VIEWER") ? "-" : (
                                                  <div className='flex'>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    <span>Pick a date</span>
                                                  </div>
                                                )
                                              )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent id="dateDepartmentState" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                <Calendar
                                    defaultView="century"
                                    onChange={(e: any) => {
                                        let dateObj = new Date(e);
                                        let day = dateObj.getDate()
                                        let month = dateObj.getMonth() + 1;
                                        let year = dateObj.getFullYear()
                                        let dateStr = `${month}/${day}/${year}`;
                                        setDateFiledDiplomatic(e);
                                        let newData = diplomaticData
                                        newData['linkDateDOSResponse'] = dateStr;
                                        setDiplomaticData(newData);
                                        setValue("data",newData);

                                        setDateIsOpenDiplomatic(false)
                                    }}
                                    defaultValue={diplomaticData && moment(diplomaticData?.linkDateDOSResponse).isValid() ? convertToUTCDate(diplomaticData.linkDateDOSResponse) : null}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-2">
                <div className="col-span-1 md:col-span-2">
                    <Label htmlFor="notes-filed" className="text-[0.7rem] font-semibold text-gray-600">
                    Follow-up notes filed?
                    </Label>
                    <Select
                    value={followupNotes}
                    onValueChange={(e)=>{
                        let newData  = diplomaticData;
                            newData['linkFollowUpNotesFiled'] = e;
                            setDiplomaticData(newData);
                            setValue("data",newData);
                            setFolloupNotes(e)
                    }}
                    >
                        <SelectTrigger id="notes-filed" disabled={userRoles.includes("VIEWER")} className="h-8 w-full md:w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                            <SelectValue placeholder="Select Option" className='text-xs'>
                            {followupNotes ? followupNotes : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
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

                <div className="">
                    <Label htmlFor="dateNotesFiled" className="text-[0.7rem] font-semibold text-gray-600">
                     Initial Date
                    </Label>
                    <div>
                        <Popover >
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "h-8 w-full justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                        !dateFiledDiplomatic && "text-muted-foreground"
                                    )} disabled={userRoles.includes("VIEWER")}>
                                        {diplomaticData && moment(diplomaticData?.linkDateFollowUpNotesFiled).isValid() ? (
                                                <>
                                                <div className="flex">
                                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                                  {convertToUTCDate(diplomaticData?.linkDateFollowUpNotesFiled)}
                                                </div>
                                                <div className='flex'>
                                        <Icons.close className="h-4 w-4" onClick = { ()=>{
                                            setDateFiledDiplomatic(null);
                                            let newData = diplomaticData
                                            newData['linkDateFollowUpNotesFiled'] = null;
                                            setDiplomaticData(newData);
                                            setValue("data",newData);
    
                                        }}/>
                                        </div>
                                                </>
                                              ) : (
                                                userRoles.includes("VIEWER") ? "-" : (
                                                  <div className="flex">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    <span>Pick a date</span>
                                                  </div>
                                                )
                                              )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent id="dateNotesFiled" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                <Calendar
                                    defaultView="century"
                                    onChange={(e: any) => {
                                        let dateObj = new Date(e);
                                        let day = dateObj.getDate()
                                        let month = dateObj.getMonth() + 1;
                                        let year = dateObj.getFullYear()
                                        let dateStr = `${month}/${day}/${year}`;
                                        setDateFiledDiplomatic(e);
                                        let newData = diplomaticData
                                        newData['linkDateFollowUpNotesFiled'] = dateStr;
                                        setDiplomaticData(newData);
                                        setValue("data",newData);

                                        setDateIsOpenDiplomatic(false)
                                    }}
                                    defaultValue={diplomaticData && moment(diplomaticData?.linkDateFollowUpNotesFiled).isValid() ? convertToUTCDate(diplomaticData.linkDateFollowUpNotesFiled) : null}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                </div>
                <div className="col-span-1 md:col-span-3 mb-1">
                    <Label htmlFor="notes" className="text-[0.7rem] font-semibold text-gray-600">
                    General Diplomatic Intervention Notes
                    </Label>
                    <Textarea
                    defaultValue={diplomaticData?.linkDiplomaticInterventionNotes ? diplomaticData?.linkDiplomaticInterventionNotes : '' }
                    onChange={(e)=>{
                        let value = e.target.value;
                        let newData = diplomaticData;
                        newData['linkDiplomaticInterventionNotes'] = value;
                        setDiplomaticData(newData);
                        setValue("data",newData);
                    }}
                        id="notes"
                        disabled={userRoles.includes("VIEWER")}
                        placeholder={userRoles.includes("VIEWER") ? "-" : "Type Here..."}
                        className="h-20 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none"
                    />
                </div>


        </div>
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

    </div >
)
}
