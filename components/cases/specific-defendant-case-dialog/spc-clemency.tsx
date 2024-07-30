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
import { getSession } from 'next-auth/react'
import { Form, useForm } from "react-hook-form"
import * as z from "zod"
const ClemencySchema = z.object({
    data: z.any(),
});
type FormData = z.infer<typeof ClemencySchema>
import { toast } from "../../../components/ui/use-toast"


export default function ClemencyDialog(props: any) {
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            data: {
                linkProgClemencyPetition: '',
                linkDateProgClemencyPetition: null,
                linkPAMetWithClemencyOff: '',
                linkDatePAMetWithClemencyOff: null,
                linkPAAtCommutationHrg: '',
                linkDatePAAtCommutationHrg: null,
                linkClemencyNotes: ''
            }
        },
        resolver: zodResolver(ClemencySchema),
    })

    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
    const searchParams = useSearchParams();
    const [clemencyData, setClemencyData] = React.useState<any>(
        {
            linkProgClemencyPetition: '',
            linkDateProgClemencyPetition: null,
            linkPAMetWithClemencyOff: '',
            linkDatePAMetWithClemencyOff: null,
            linkPAAtCommutationHrg: '',
            linkDatePAAtCommutationHrg: null,
            linkClemencyNotes: ''
        }
    );
    const [isLoading, setIsLoading] = React.useState(true)
    const [userRoles, setUserRoles] = React.useState<string[]>([])
    const [clemencyPetition, setClemencyPetition] = React.useState("");
    const [clemencyOff, setClemencyOff] = React.useState("");
    const [commutationHrg, setCommutationHrg] = React.useState("");
    const [clemencyPetitionDate, setClemencyPetitionDate] = React.useState<any>(null);
    const [clemencyOffDate, setClemencyOffDate] = React.useState<any>(null);
    const [commutationHrgDate, setCommutationHrgDate] = React.useState<any>(null);


    const fetchData = async () => {
        const response = await axiosInstance.get(`${baseURL}/v1/defendants/caseDefLink/${props?.defId}/${props?.caseId}`);
        setIsLoading(false)
        if (response?.data?.data) {

            if (response?.data?.data?.linkProgClemencyPetition) {
                setClemencyPetition(response?.data?.data?.linkProgClemencyPetition)
            }
            if (response?.data?.data?.linkPAMetWithClemencyOff) {
                setClemencyOff(response?.data?.data?.linkPAMetWithClemencyOff)
            }
            if (response?.data?.data?.linkPAAtCommutationHrg) {
                setCommutationHrg(response?.data?.data?.linkPAAtCommutationHrg)
            }

            setClemencyData(response?.data?.data);
            setValue("data", response?.data?.data)
        }
    }
    const onSubmit = async (payload: any) => {

        let payloadData = {
            linkProgClemencyPetition: payload?.data?.linkProgClemencyPetition ? payload?.data?.linkProgClemencyPetition : '',
            linkDateProgClemencyPetition: payload?.data?.linkDateProgClemencyPetition ? payload?.data?.linkDateProgClemencyPetition : null,
            linkPAMetWithClemencyOff: payload?.data?.linkPAMetWithClemencyOff ? payload?.data?.linkPAMetWithClemencyOff : '',
            linkDatePAMetWithClemencyOff: payload?.data?.linkDatePAMetWithClemencyOff ? payload?.data?.linkDatePAMetWithClemencyOff : null,
            linkPAAtCommutationHrg: payload?.data?.linkPAAtCommutationHrg ? payload?.data?.linkPAAtCommutationHrg : '',
            linkDatePAAtCommutationHrg: payload?.data?.linkDatePAAtCommutationHrg ? payload?.data?.linkDatePAAtCommutationHrg : null,
            linkClemencyNotes: payload?.data?.linkClemencyNotes ? payload?.data?.linkClemencyNotes : ''

        }

        try {
            const res = await axiosInstance.patch(`${baseURL}/v1/defendants/caseDefLink/${props?.defId}/${props?.caseId}`, payloadData)
            if (res?.status === 500 || res?.status === 400) {
                toast({
                    variant: "default",
                    description: "Clemency details updated failed",
                    style: {
                        background: "red",
                    },
                })
            } else {
                toast({
                    variant: "default",
                    description: "Clemency details updated successfully",
                    style: {
                        background: "#03C03C",
                    },
                })
            }

        } catch (error: any) {
        }
    }


    React.useEffect(() => {
        const fetchUserRoles = async () => {
            const session = await getSession();
            setUserRoles(session?.user?.roles || []);
        };

        fetchUserRoles();
        fetchData();
    }, [])

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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                    <div>
                                        <Label className="text-[0.7rem] font-semibold text-gray-600"
                                        >
                                            Program drafted clemency petition?</Label>
                                        <Select
                                            value={clemencyPetition}
                                            onValueChange={(e) => {
                                                let newData = clemencyData;
                                                newData['linkProgClemencyPetition'] = e;
                                                setClemencyData(newData);
                                                setValue("data", newData);
                                                setClemencyPetition(e)
                                            }}
                                        >
                                            <SelectTrigger disabled={userRoles.includes("VIEWER")} className="h-8 w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
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
                                            onValueChange={(e) => {
                                                let newData = clemencyData;
                                                newData['linkPAMetWithClemencyOff'] = e;
                                                setClemencyData(newData);
                                                setValue("data", newData);
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
                                            onValueChange={(e) => {
                                                let newData = clemencyData;
                                                newData['linkPAAtCommutationHrg'] = e;
                                                setClemencyData(newData);
                                                setValue("data", newData);
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
                                                                "h-8 w-1/2 justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !clemencyData?.linkDateProgClemencyPetition && "text-muted-foreground"
                                                            )} disabled={userRoles.includes("VIEWER")}>
                                                            {clemencyData && moment(clemencyData?.linkDateProgClemencyPetition).isValid() ? (
                                                                <>
                                                                    <div className="flex">
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {convertToUTCDate(clemencyData?.linkDateProgClemencyPetition)}
                                                                    </div>
                                                                    <div className='flex'>
                                                                        <Icons.close className="h-4 w-4" onClick={() => {
                                                                            setClemencyPetitionDate(null)
                                                                            let newData = clemencyData;
                                                                            newData['linkDateProgClemencyPetition'] = null
                                                                            setClemencyData(newData);
                                                                            setValue("data", newData);
                                                                        }} />
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
                                                    <PopoverContent id="linkDateProgClemencyPetition" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                        <Calendar
                                                            defaultView="century"
                                                            onChange={(e: any) => {
                                                                let dateObj = new Date(e);
                                                                let day = dateObj.getDate()
                                                                let month = dateObj.getMonth() + 1;
                                                                let year = dateObj.getFullYear()
                                                                let dateStr = `${month}/${day}/${year}`;
                                                                setClemencyPetitionDate(e)

                                                                let newData = clemencyData;
                                                                newData['linkDateProgClemencyPetition'] = dateStr
                                                                setClemencyData(newData);
                                                                setValue("data", newData);

                                                            }}
                                                            defaultValue={clemencyData && moment(clemencyData?.linkDateProgClemencyPetition).isValid() ? convertToUTCDate(clemencyData?.linkDateProgClemencyPetition) : null}
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
                                                                "h-8 w-1/2 justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !clemencyData?.linkDatePAMetWithClemencyOff && "text-muted-foreground"
                                                            )} disabled={userRoles.includes("VIEWER")}>
                                                            {clemencyData && moment(clemencyData?.linkDatePAMetWithClemencyOff).isValid() ? (
                                                                <>
                                                                    <div className="flex">
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {convertToUTCDate(clemencyData?.linkDatePAMetWithClemencyOff)}
                                                                    </div>
                                                                    <div className='flex'>
                                                                        <Icons.close className="h-4 w-4" onClick={() => {
                                                                            let newData = clemencyData;
                                                                            newData['linkDatePAMetWithClemencyOff'] = null
                                                                            setClemencyOffDate(null)
                                                                            setClemencyData(newData);
                                                                            setValue("data", newData);
                                                                        }} />
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
                                                    <PopoverContent id="linkDatePAMetWithClemencyOff" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                        <Calendar
                                                            defaultView="century"
                                                            onChange={(e: any) => {
                                                                let dateObj = new Date(e);
                                                                let day = dateObj.getDate()
                                                                let month = dateObj.getMonth() + 1;
                                                                let year = dateObj.getFullYear()
                                                                let dateStr = `${month}/${day}/${year}`;

                                                                let newData = clemencyData;
                                                                newData['linkDatePAMetWithClemencyOff'] = dateStr
                                                                setClemencyOffDate(e)
                                                                setClemencyData(newData);
                                                                setValue("data", newData);

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
                                                                "h-8 w-1/2 justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !clemencyData?.linkDatePAAtCommutationHrg && "text-muted-foreground"
                                                            )} disabled={userRoles.includes("VIEWER")}>
                                                            {clemencyData && moment(clemencyData?.linkDatePAAtCommutationHrg).isValid() ? (
                                                                <>
                                                                <div className="flex">
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(clemencyData?.linkDatePAAtCommutationHrg)}
                                                                </div>
                                                                <div className='flex'>
                                                                            <Icons.close className="h-4 w-4" onClick={() => {
                                                                                setCommutationHrgDate(null)
                                                                                let newData = clemencyData;
                                                                                newData['linkDatePAAtCommutationHrg'] = null
                                                                                setClemencyData(newData);
                                                                                setValue("data", newData);
                                                                            }} />
                                                                        </div>
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : (
                                                                    <>
                                                                        <div className="flex">
                                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                                            <span>Pick a date</span>
                                                                        </div>
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
                                                                let dateStr = `${month}/${day}/${year}`;
                                                                setCommutationHrgDate(e)
                                                                let newData = clemencyData;
                                                                newData['linkDatePAAtCommutationHrg'] = dateStr
                                                                setClemencyData(newData);
                                                                setValue("data", newData);

                                                            }}
                                                            defaultValue={clemencyData && moment(clemencyData?.linkDatePAAtCommutationHrg).isValid() ? convertToUTCDate(clemencyData?.linkDatePAAtCommutationHrg) : null}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 mr-2 my-1">
                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="Clemency-related-notes">
                                        General Clemency Related Notes</Label>
                                    <Textarea id="Clemency-related-notes"
                                        defaultValue={clemencyData?.linkClemencyNotes ? clemencyData?.linkClemencyNotes : ''}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            let newData = clemencyData;
                                            newData['linkClemencyNotes'] = value;
                                            setClemencyData(newData);
                                            setValue("data", newData);
                                        }}
                                        disabled={userRoles.includes("VIEWER")}
                                        className="h-20 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none" placeholder={userRoles.includes("VIEWER") ? "-" : "Type here.."} />
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

        </div>
    )
}
