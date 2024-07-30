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
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "../../../components/ui/use-toast"
import { getSession } from "next-auth/react";
import * as z from "zod"
const CaseProgramSchema = z.object({
    data: z.any(),
});
type FormData = z.infer<typeof CaseProgramSchema>

export default function ProgramDialog(props: any) {

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors, isSubmitted },
    } = useForm<FormData>({
        resolver: zodResolver(CaseProgramSchema)
    })

    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

    const [date, setDate] = React.useState<any>(null)
    const [legalMeterial, setLegalMeterial] = React.useState([]);
    const [legalMeterialDelete, setLegalMeterialDelete] = React.useState<any>([]);

    const [programTraining, setProgramTraining] = React.useState<any>([]);
    const [programTrainingDelete, setProgramTrainingDelete] = React.useState<any>([]);

    const [programData, setProgramData] = React.useState<any>({});

    const [programId, setProgramId] = React.useState<any>("");
    const [isLoading, setIsLoading] = React.useState(true)
    const [userRoles, setUserRoles] = React.useState<string[]>([])
    const [piDateFirstInvolvement, setPiDateFirstInvolvement] = React.useState<any>("");
    const [piLtrToPros, setPiLtrToPros] = React.useState<any>("");
    const [piMetWithDefCouns, setPiMetWithDefCouns] = React.useState<any>("");
    const [piMetWithDef, setPiMetWithDef] = React.useState<any>("");
    const [piMetWithDefDate, setPiMetWithDefDate] = React.useState<any>("");
    const [piMetWithDefDateApprox, setPiMetWithDefDateApprox] = React.useState<any>(false);
    const [piMetWithDefCounsDate, setPiMetWithDefCounsDate] = React.useState<any>("");
    const [piMetWithDefCounseDateApprox, setPiMetWithDefCounseDateApprox] = React.useState<any>(false);
    const [piInvitedDefCounsToTraining, setPiInvitedDefCounsToTraining] = React.useState<any>("");
    const [piInvitedDefCounsToTrainingNotes, setPiInvitedDefCounsToTrainingNotes] = React.useState<any>("");
    const [piAmicusBriefStateTrial, setPiAmicusBriefStateTrial] = React.useState<any>("");
    const [piDateAmicusBriefStateTrial, setPiDateAmicusBriefStateTrial] = React.useState<any>("");
    const [piAmicusBrieFedTrial, setPiAmicusBrieFedTrial] = React.useState<any>("");
    const [piDateAmicusBrieFedTrial, setPiDateAmicusBrieFedTrial] = React.useState<any>("");
    const [piAmicusBriefFedHabeas, setPiAmicusBriefFedHabeas] = React.useState<any>("");
    const [piDateAmicusBriefFedHabeas, setPiDateAmicusBriefFedHabeas] = React.useState<any>("");
    const [piAmicusBriefFedAppeals, setPiAmicusBriefFedAppeals] = React.useState<any>("");
    const [piDateAmicusBriefFedAppeals, setPiDateAmicusBriefFedAppeals] = React.useState<any>("");
    const [piPAAppearedCourt, setPiPAAppearedCourt] = React.useState<any>("");
    const [piDatePAAppearedCourt, setPiDatePAAppearedCourt] = React.useState<any>("");
    const [piPAAppearedCourtNotes, setPiPAAppearedCourtNotes] = React.useState<any>("");
    const [piPAMetWithGov, setPiPAMetWithGov] = React.useState<any>("");
    const [piDatePAMetWithGov, setPiDatePAMetWithGov] = React.useState<any>("");
    const [piPetitionToIACHR, setPiPetitionToIACHR] = React.useState<any>("");
    const [piDatePetitionToIACHR, setPiDatePetitionToIACHR] = React.useState<any>("");
    const [piIACHRPrecaution, setPiIACHRPrecaution] = React.useState<any>("");
    const [piDateIACHRPrecaution, setPiDateIACHRPrecaution] = React.useState<any>("");
    const [piIACHRMerits, setPiIACHRMerits] = React.useState<any>("");
    const [piDateIACHRMerits, setPiDateIACHRMerits] = React.useState<any>("");
    const [piAmicusBriefStateSupr, setPiAmicusBriefStateSupr] = React.useState<any>("");
    const [piDateAmicusBriefStateSupr, setPiDateAmicusBriefStateSupr] = React.useState<any>("");
    const [piAmicusBriefStatePostCon, setPiAmicusBriefStatePostCon] = React.useState<any>("");
    const [piDateAmicusBriefStatePostCon, setPiDateAmicusBriefStatePostCon] = React.useState<any>("");
    const [piAmicusBriefUSSupr, setPiAmicusBriefUSSupr] = React.useState<any>("");
    const [piPARepresented, setPiPARepresented] = React.useState<any>("");
    const [piProgRecruitedDefCouns, setPiProgRecruitedDefCouns] = React.useState<any>("");
    const [piProgRetainedDefCouns, setPiProgRetainedDefCouns] = React.useState<any>("");
    const [piProgFundedExperts, setPiProgFundedExperts] = React.useState<any>("");
    const [piPAMetWithParoleBd, setPiPAMetWithParoleBd] = React.useState<any>("");
    const [piDatePAMetWithParoleBd, setPiDatePAMetWithParoleBd] = React.useState<any>("");
    const [piPAMetWithPros, setPiPAMetWithPros] = React.useState<any>("");
    const [piDatePAMetWithPros, setPiDatePAMetWithPros] = React.useState<any>("");
    const [piDateAmicusBriefUSSupr, setPiDateAmicusBriefUSSupr] = React.useState<any>("");

    const fetchData = async () => {
        setIsLoading(false)
        const response = await axiosInstance.get(`${baseURL}/v1/defendants/program/${props?.defId}/${props?.caseId}`);
        setIsLoading(false)
        if (response?.data?.data && response?.data?.data?.id) {
            setProgramId(response?.data?.data?.id);
            setProgramData(response?.data?.data);
            let program = response?.data?.data;
            if (program?.piDateFirstInvolvement) {
                setPiDateFirstInvolvement(program?.piDateFirstInvolvement)
            }
            if (program?.piLtrToPros) {
                setPiLtrToPros(program?.piLtrToPros)

            }
            if (program?.piMetWithDef) {
                setPiMetWithDef(program?.piMetWithDef)
            }
            if (program?.piDateMetWithDef) {
                setPiMetWithDefDate(program?.piDateMetWithDef)
            }
            if (program?.piDateMetWithDefApprox) {
                setPiMetWithDefDateApprox(program?.piDateMetWithDefApprox)
            }
            if (program?.piMetWithDefCouns) {
                setPiMetWithDefCouns(program?.piMetWithDefCouns)
            }
            if (program?.piMetWithDefCounsDate) {
                setPiMetWithDefCounsDate(program?.piMetWithDefCounsDate)
            }
            if (program?.piMetWithDefCounseDateApprox) {
                setPiMetWithDefCounseDateApprox(program?.piMetWithDefCounseDateApprox)
            }
            if (program?.piInvitedDefCounsToTraining) {
                setPiInvitedDefCounsToTraining(program?.piInvitedDefCounsToTraining)
            }
            if (program?.piInvitedDefCounsToTrainingNotes) {
                setPiInvitedDefCounsToTrainingNotes(program?.piInvitedDefCounsToTrainingNotes)
            }
            if (program?.piAmicusBriefStateTrial) {
                setPiAmicusBriefStateTrial(program?.piAmicusBriefStateTrial)
            }
            if (program?.piDateAmicusBriefStateTrial) {
                setPiDateAmicusBriefStateTrial(program?.piDateAmicusBriefStateTrial)
            }
            if (program?.piAmicusBrieFedTrial) {
                setPiAmicusBrieFedTrial(program?.piAmicusBrieFedTrial)
            }
            if (program?.piDateAmicusBrieFedTrial) {
                setPiDateAmicusBrieFedTrial(program?.piDateAmicusBrieFedTrial)
            }
            if (program?.piAmicusBriefFedHabeas) {
                setPiAmicusBriefFedHabeas(program?.piAmicusBriefFedHabeas)
            }
            if (program?.piDateAmicusBriefFedHabeas) {
                setPiDateAmicusBriefFedHabeas(program?.piDateAmicusBriefFedHabeas)
            }
            if (program?.piAmicusBriefFedAppeals) {
                setPiAmicusBriefFedAppeals(program?.piAmicusBriefFedAppeals)
            }
            if (program?.piDateAmicusBriefFedAppeals) {
                setPiDateAmicusBriefFedAppeals(program?.piDateAmicusBriefFedAppeals)
            }
            if (program?.piPAAppearedCourt) {
                setPiPAAppearedCourt(program?.piPAAppearedCourt)
            }
            if (program?.piDatePAAppearedCourt) {
                setPiDatePAAppearedCourt(program?.piDatePAAppearedCourt)
            }
            if (program?.piPAAppearedCourtNotes) {
                setPiPAAppearedCourtNotes(program?.piPAAppearedCourtNotes)
            }
            if (program?.piPAMetWithGov) {
                setPiPAMetWithGov(program?.piPAMetWithGov)
            }
            if (program?.piDateAmicusBriefUSSupr) {
                setPiDateAmicusBriefUSSupr(program?.piDateAmicusBriefUSSupr)
            }
            if (program?.piDatePAMetWithGov) {
                setPiDatePAMetWithGov(program?.piDatePAMetWithGov)
            }
            if (program?.piPetitionToIACHR) {
                setPiPetitionToIACHR(program?.piPetitionToIACHR)
            }
            if (program?.piDatePetitionToIACHR) {
                setPiDatePetitionToIACHR(program?.piDatePetitionToIACHR)
            }
            if (program?.piIACHRPrecaution) {
                setPiIACHRPrecaution(program?.piIACHRPrecaution)
            }
            if (program?.piDateIACHRPrecaution) {
                setPiDateIACHRPrecaution(program?.piDateIACHRPrecaution)
            }
            if (program?.piIACHRMerits) {
                setPiIACHRMerits(program?.piIACHRMerits)
            }
            if (program?.piDateIACHRMerits) {
                setPiDateIACHRMerits(program?.piDateIACHRMerits)
            }
            if (program?.piAmicusBriefStateSupr) {
                setPiAmicusBriefStateSupr(program?.piAmicusBriefStateSupr)
            }
            if (program?.piDateAmicusBriefStateSupr) {
                setPiDateAmicusBriefStateSupr(program?.piDateAmicusBriefStateSupr)
            }
            if (program?.piAmicusBriefStatePostCon) {
                setPiAmicusBriefStatePostCon(program?.piAmicusBriefStatePostCon)
            }
            if (program?.piDateAmicusBriefStatePostCon) {
                setPiDateAmicusBriefStatePostCon(program?.piDateAmicusBriefStatePostCon)
            }
            if (program?.piAmicusBriefUSSupr) {
                setPiAmicusBriefUSSupr(program?.piAmicusBriefUSSupr)
            }
            if (program?.piPAMetWithParoleBd) {
                setPiPAMetWithParoleBd(program?.piPAMetWithParoleBd)
            }
            if (program?.piPARepresented) {
                setPiPARepresented(program?.piPARepresented)
            }
            if (program?.piProgRecruitedDefCouns) {
                setPiProgRecruitedDefCouns(program?.piProgRecruitedDefCouns)
            }
            if (program?.piProgRetainedDefCouns) {
                setPiProgRetainedDefCouns(program?.piProgRetainedDefCouns)
            }
            if (program?.piProgFundedExperts) {
                setPiProgFundedExperts(program?.piProgFundedExperts)
            }
            if (program?.piDatePAMetWithParoleBd) {
                setPiDatePAMetWithParoleBd(program?.piDatePAMetWithParoleBd)
            }
            if (program?.piPAMetWithPros) {
                setPiPAMetWithPros(program?.piPAMetWithPros)
            }
            if (program?.piDatePAMetWithPros) {
                setPiDatePAMetWithPros(program?.piDatePAMetWithPros)
            }

        }

        let legalData = await axiosInstance.get(`${baseURL}/v1/defendants/legal_meterial/${props?.defId}/${props?.caseId}`);
        if (legalData?.data?.data?.length > 0) {
            setLegalMeterial(legalData?.data?.data);
        }

        let trainingData = await axiosInstance.get(`${baseURL}/v1/defendants/program_training/${props?.defId}/${props?.caseId}`);
        if (trainingData?.data?.data?.length > 0) {
            setProgramTraining(trainingData?.data?.data)
        }


    }

    const onSubmit = async (payload: any) => {

        let payloadData = {
            program: {
                piDateFirstInvolvement: piDateFirstInvolvement ? piDateFirstInvolvement : null,
                piLtrToPros: piLtrToPros ? piLtrToPros : null,
                piMetWithDef: piMetWithDef ? piMetWithDef : null,
                piDateMetWithDef: piMetWithDefDate ? piMetWithDefDate : null,
                piDateMetWithDefApprox: piMetWithDefDateApprox ? piMetWithDefDateApprox : null,
                piMetWithDefCouns: piMetWithDefCouns ? piMetWithDefCouns : null,
                piMetWithDefCounsDate: piMetWithDefCounsDate ? piMetWithDefCounsDate : null,
                piMetWithDefCounseDateApprox: piMetWithDefCounseDateApprox ? piMetWithDefCounseDateApprox : null,
                piInvitedDefCounsToTraining: piInvitedDefCounsToTraining ? piInvitedDefCounsToTraining : null,
                piInvitedDefCounsToTrainingNotes: piInvitedDefCounsToTrainingNotes ? piInvitedDefCounsToTrainingNotes : null,
                piAmicusBriefStateTrial: piAmicusBriefStateTrial ? piAmicusBriefStateTrial : null,
                piDateAmicusBriefStateTrial: piDateAmicusBriefStateTrial ? piDateAmicusBriefStateTrial : null,
                piAmicusBrieFedTrial: piAmicusBrieFedTrial ? piAmicusBrieFedTrial : null,
                piDateAmicusBrieFedTrial: piDateAmicusBrieFedTrial ? piDateAmicusBrieFedTrial : null,
                piAmicusBriefFedHabeas: piAmicusBriefFedHabeas ? piAmicusBriefFedHabeas : null,
                piDateAmicusBriefFedHabeas: piDateAmicusBriefFedHabeas ? piDateAmicusBriefFedHabeas : null,
                piAmicusBriefFedAppeals: piAmicusBriefFedAppeals ? piAmicusBriefFedAppeals : null,
                piDateAmicusBriefFedAppeals: piDateAmicusBriefFedAppeals ? piDateAmicusBriefFedAppeals : null,
                piPAAppearedCourt: piPAAppearedCourt ? piPAAppearedCourt : null,
                piDatePAAppearedCourt: piDatePAAppearedCourt ? piDatePAAppearedCourt : null,
                piPAAppearedCourtNotes: piPAAppearedCourtNotes ? piPAAppearedCourtNotes : null,
                piPAMetWithGov: piPAMetWithGov ? piPAMetWithGov : null,
                piDatePAMetWithGov: piDatePAMetWithGov ? piDatePAMetWithGov : null,
                piPetitionToIACHR: piPetitionToIACHR ? piPetitionToIACHR : null,
                piDatePetitionToIACHR: piDatePetitionToIACHR ? piDatePetitionToIACHR : null,
                piIACHRPrecaution: piIACHRPrecaution ? piIACHRPrecaution : null,
                piDateIACHRPrecaution: piDateIACHRPrecaution ? piDateIACHRPrecaution : null,
                piIACHRMerits: piIACHRMerits ? piIACHRMerits : null,
                piDateIACHRMerits: piDateIACHRMerits ? piDateIACHRMerits : null,
                piAmicusBriefStateSupr: piAmicusBriefStateSupr ? piAmicusBriefStateSupr : null,
                piDateAmicusBriefStateSupr: piDateAmicusBriefStateSupr ? piDateAmicusBriefStateSupr : null,
                piAmicusBriefStatePostCon: piAmicusBriefStatePostCon ? piAmicusBriefStatePostCon : null,
                piDateAmicusBriefStatePostCon: piDateAmicusBriefStatePostCon ? piDateAmicusBriefStatePostCon : null,
                piAmicusBriefUSSupr: piAmicusBriefUSSupr ? piAmicusBriefUSSupr : null,
                piPARepresented: piPARepresented ? piPARepresented : null,
                piPAMetWithParoleBd: piPAMetWithParoleBd ? piPAMetWithParoleBd : null,
                piDatePAMetWithParoleBd: piDatePAMetWithParoleBd ? piDatePAMetWithParoleBd : null,
                piProgRecruitedDefCouns: piProgRecruitedDefCouns ? piProgRecruitedDefCouns : null,
                piProgRetainedDefCouns: piProgRetainedDefCouns ? piProgRetainedDefCouns : null,
                piProgFundedExperts: piProgFundedExperts ? piProgFundedExperts : null,
                piPAMetWithPros: piPAMetWithPros ? piPAMetWithPros : null,
                piDatePAMetWithPros: piDatePAMetWithPros ? piDatePAMetWithPros : null,
                piDateAmicusBriefUSSupr: piDateAmicusBriefUSSupr ? piDateAmicusBriefUSSupr : null
            },
            legal: legalMeterial,
            legalDelete: legalMeterialDelete,
            training: programTraining,
            trainingDelete: programTrainingDelete
        }

        try {
            if (programId) {
                const res = await axiosInstance.patch(`${baseURL}/v1/defendants/program/${props?.defId}/${props?.caseId}`, payloadData)
                if (res?.status === 500 || res?.status === 400) {
                    toast({
                        variant: "default",
                        description: "Program details updated failed",
                        style: {
                            background: "red",
                        },
                    })
                } else {
                    toast({
                        variant: "default",
                        description: "Program details updated successfully",
                        style: {
                            background: "#03C03C",
                        },
                    })
                }
                // let legalData = await axiosInstance.get(`${baseURL}/v1/defendants/legal_meterial/${props?.defId}/${props?.caseId}`);
                // if (legalData?.data?.data?.length > 0) {
                //     setLegalMeterial(legalData?.data?.data);
                // }

                // let trainingData = await axiosInstance.get(`${baseURL}/v1/defendants/program_training/${props?.defId}/${props?.caseId}`);
                // if( trainingData?.data?.data?.length > 0){
                //     setProgramTraining(trainingData?.data?.data)
                // }      

            } else {
                const res = await axiosInstance.post(`${baseURL}/v1/defendants/program/${props?.defId}/${props?.caseId}`, payloadData)
                if (res?.status === 500 || res?.status === 400) {
                    toast({
                        variant: "default",
                        description: "Case Program Created Failed",
                        style: {
                            background: "red",
                        },
                    })
                } else {
                    toast({
                        variant: "default",
                        description: "Case Program Created Successfully",
                        style: {
                            background: "#03C03C",
                        },
                    })
                }
            }
        }
        catch (error: any) { }
    }

    React.useEffect(() => {
        const fetchUserRoles = async () => {
            const session = await getSession();
            setUserRoles(session?.user?.roles || []);
        };

        fetchUserRoles();
        fetchData()
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
                        <div className="thin-scrollbar h-[calc(100vh-18.5rem)] overflow-y-auto  mx-1 p-3">

                            <div className="flex justify-start items-center">
                                <Label className='text-sm font-semibold'>Program&apos;s involvement</Label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
                                <div>
                                    <Label htmlFor="Date-of-conviction" className="text-[0.7rem] font-semibold text-gray-600">
                                        Date of Program’s first involvement
                                    </Label>
                                    <div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-8 w-full md:w-1/2 justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piDateFirstInvolvement && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piDateFirstInvolvement && moment(piDateFirstInvolvement).isValid() ? (
                                                        <>
                                                            <div className='flex'>                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {convertToUTCDate(piDateFirstInvolvement)}
                                                            </div>
                                                            <div className='flex'>
                                                                <Icons.close className="h-4 w-4" onClick={() => {
                                                                    setValue("data", { ...programData, piDateFirstInvolvement: null });
                                                                    setPiDateFirstInvolvement(null)
                                                                }} />
                                                            </div>                                                                    </>
                                                    ) : (
                                                        userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                                            <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                        </div>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent id="Date-of-conviction" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                <Calendar
                                                    defaultView="century"
                                                    onChange={(e: any) => {
                                                        let dateObj = new Date(e);
                                                        let day = dateObj.getDate()
                                                        let month = dateObj.getMonth() + 1;
                                                        let year = dateObj.getFullYear()
                                                        let dateStr = `${month}/${day}/${year}`;
                                                        setValue("data", { ...programData, piDateFirstInvolvement: dateStr });
                                                        setPiDateFirstInvolvement(dateStr)
                                                    }}
                                                    value={moment(piDateFirstInvolvement).isValid() ? convertToUTCDate(piDateFirstInvolvement) : null} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 my-2'>
                                <div>
                                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                                        htmlFor="defendant">
                                        Program attorney met with defendant?</Label>
                                    <Select
                                        value={piMetWithDef}
                                        onValueChange={(e) => {
                                            setValue("data", { ...programData, piMetWithDef: e });
                                            setPiMetWithDef(e)
                                        }}
                                    >
                                        <SelectTrigger
                                            id="defendant"
                                            disabled={userRoles.includes("VIEWER")}
                                            className="h-8 w-full md:w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piMetWithDef
                                                    ? piMetWithDef
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className='text-xs dark:bg-slate-900'>
                                            <SelectGroup>
                                                <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="visit-to-defendant" className="text-[0.7rem] font-semibold text-gray-600">
                                        Initial Date
                                    </Label>
                                    <div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-8 w-full md:w-[260px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piMetWithDefDate && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piMetWithDefDate && moment(piMetWithDefDate).isValid() ? (
                                                        <>
                                                            <div className="flex">
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {convertToUTCDate(piMetWithDefDate)}
                                                            </div>
                                                            <div className='flex'>
                                                                <Icons.close className="h-4 w-4" onClick={() => {
                                                                    setValue("data", { ...programData, piMetWithDefDate: null });
                                                                    setPiMetWithDefDate(null)
                                                                }} />
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
                                                        setValue("data", { ...programData, piMetWithDefDate: dateStr });
                                                        setPiMetWithDefDate(dateStr)
                                                    }}
                                                    value={piMetWithDefDate}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="flex items-center pt-5">
                                    <Checkbox
                                        checked={piMetWithDefDateApprox}
                                        onCheckedChange={(e: any) => {
                                            setValue("data", { ...programData, piMetWithDefDateApprox: e });
                                            setPiMetWithDefDateApprox(e)
                                        }}
                                        disabled={userRoles.includes("VIEWER")}
                                        className='border-slate-600 disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text'
                                    />
                                    <Label className="px-1 text-center text-xs">
                                        Approximate?
                                    </Label>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 my-2'>
                                <div>
                                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                                        htmlFor="defense-counsel">
                                        Program attorneys met with defense counsel?</Label>
                                    <Select
                                        value={piMetWithDefCouns}
                                        onValueChange={(e) => {
                                            setValue("data", { ...programData, piMetWithDefCouns: e });
                                            setPiMetWithDefCouns(e)
                                        }}
                                    >
                                        <SelectTrigger
                                            id="defense-counsel" disabled={userRoles.includes("VIEWER")}
                                            className="h-8 w-full md:w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piMetWithDefCouns
                                                    ? piMetWithDefCouns
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className='text-xs dark:bg-slate-900'>
                                            <SelectGroup>
                                                <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="visit-to-defendant" className="text-[0.7rem] font-semibold text-gray-600">
                                        Initial Date
                                    </Label>
                                    <div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-8 w-full md:w-[260px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piMetWithDefCounsDate && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piMetWithDefCounsDate && moment(piMetWithDefCounsDate).isValid() ? (
                                                        <><div className="flex">
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {convertToUTCDate(piMetWithDefCounsDate)}
                                                        </div>
                                                            <div className='flex'>
                                                                <Icons.close className="h-4 w-4" onClick={() => {
                                                                    setValue("data", { ...programData, piMetWithDefCounsDate: null });
                                                                    setPiMetWithDefCounsDate(null)
                                                                }} />
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
                                                        setValue("data", { ...programData, piMetWithDefCounsDate: dateStr });
                                                        setPiMetWithDefCounsDate(dateStr)
                                                    }}
                                                    value={piMetWithDefCounsDate}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="flex items-center pt-5">
                                    <Checkbox
                                        checked={piMetWithDefCounseDateApprox}
                                        onCheckedChange={(e: any) => {
                                            setValue("data", { ...programData, piMetWithDefCounseDateApprox: e });
                                            setPiMetWithDefCounseDateApprox(e)
                                        }}
                                        disabled={userRoles.includes("VIEWER")}
                                        className='border-slate-600 disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text'
                                    />
                                    <Label className="px-1 text-center text-xs">
                                        Approximate?
                                    </Label>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 my-2'>
                                <div>
                                    <Label className="text-[0.7rem] font-semibold text-gray-600"
                                        htmlFor="prosecutor">
                                        Program attorneys appeared in court?</Label>
                                    <Select
                                        value={piPAAppearedCourt}
                                        onValueChange={(e) => {
                                            setValue("data", { ...programData, piPAAppearedCourt: e });
                                            setPiPAAppearedCourt(e)
                                        }}
                                    >
                                        <SelectTrigger
                                            id="prosecutor" disabled={userRoles.includes("VIEWER")}
                                            className="h-8 w-full md:w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piPAAppearedCourt
                                                    ? piPAAppearedCourt
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className='text-xs dark:bg-slate-900'>
                                            <SelectGroup>
                                                <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="Date" className="text-[0.7rem] font-semibold text-gray-600">
                                        Initial Date
                                    </Label>
                                    <div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-8 w-full md:w-[260px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piDatePAAppearedCourt && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piDatePAAppearedCourt && moment(piDatePAAppearedCourt).isValid() ? (
                                                        <><div className="flex">
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {convertToUTCDate(piDatePAAppearedCourt)}
                                                        </div>
                                                            <div className='flex'>
                                                                <Icons.close className="h-4 w-4" onClick={() => {
                                                                    setValue("data", { ...programData, piDatePAAppearedCourt: null });
                                                                    setPiDatePAAppearedCourt(null)
                                                                }} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                                            <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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
                                                        setValue("data", { ...programData, piDatePAAppearedCourt: dateStr });
                                                        setPiDatePAAppearedCourt(dateStr)
                                                    }}
                                                    value={piDatePAAppearedCourt} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="">
                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="Consular-involvement">
                                        Notes</Label>
                                    <Textarea id="Consular-involvement"
                                        value={piPAAppearedCourtNotes}
                                        disabled={userRoles.includes("VIEWER")}
                                        onChange={(e) => {
                                            setValue("data", { ...programData, piPAAppearedCourtNotes: e.target.value });
                                            setPiPAAppearedCourtNotes(e.target.value)
                                        }}
                                        className="h-20 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none" placeholder={userRoles.includes("VIEWER") ? "-" : "Type here.."} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-2">
                                <div>
                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="prosecutors">Program attorneys met with prosecutors?
                                    </Label>
                                    <Select
                                        value={piPAMetWithPros}
                                        onValueChange={(e) => {
                                            setValue("data", { ...programData, piPAMetWithPros: e });
                                            setPiPAMetWithPros(e)
                                        }}

                                    >
                                        <SelectTrigger
                                            id="prosecutors"
                                            disabled={userRoles.includes("VIEWER")}
                                            className="h-8 wfull md:w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piPAMetWithPros
                                                    ? piPAMetWithPros
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className='text-xs dark:bg-slate-900'>
                                            <SelectGroup>
                                                <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='col-span-1 md:col-span-2'>
                                    <Label htmlFor="Date" className="text-[0.7rem] font-semibold text-gray-600">
                                        Date
                                    </Label>
                                    <div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-8 w-[260px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piDatePAMetWithPros && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piDatePAMetWithPros && moment(piDatePAMetWithPros).isValid() ? (
                                                        <><div className="flex">
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {convertToUTCDate(piDatePAMetWithPros)}
                                                        </div>
                                                            <div className='flex'>
                                                                <Icons.close className="h-4 w-4" onClick={() => {
                                                                    setValue("data", { ...programData, piDatePAMetWithPros: null });
                                                                    setPiDatePAMetWithPros(null)
                                                                }} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        userRoles.includes("VIEWER") ? "-" : <div className="flex">
                                                            <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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
                                                        setValue("data", { ...programData, piDatePAMetWithPros: dateStr });
                                                        setPiDatePAMetWithPros(dateStr)
                                                    }}
                                                    value={piDatePAMetWithPros}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 my-2'>
                                <div>
                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="Mexican-consular-official">
                                        Letter to prosecutor written by program attorney for signature by Mexican consular official?
                                    </Label>
                                    <Select
                                        value={piLtrToPros}
                                        onValueChange={(e) => {
                                            setValue("data", { ...programData, piLtrToPros: e });
                                            setPiLtrToPros(e)

                                        }}
                                    >
                                        <SelectTrigger
                                            id="Mexican-consular-official"
                                            disabled={userRoles.includes("VIEWER")}
                                            className="h-8 w-full md:w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piLtrToPros
                                                    ? piLtrToPros
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className='text-xs dark:bg-slate=900'>
                                            <SelectGroup>
                                                <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="legal-counsel">Program attorneys met with governor and/or governor’s legal counsel?
                                    </Label>
                                    <Select
                                        value={piPAMetWithGov}
                                        onValueChange={(e) => {
                                            setValue("data", { ...programData, piPAMetWithGov: e });
                                            setPiPAMetWithGov(e)

                                        }}
                                    >
                                        <SelectTrigger
                                            id="legal-counsel"
                                            disabled={userRoles.includes("VIEWER")}
                                            className="h-8 w-full md:w-[260px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piPAMetWithGov
                                                    ? piPAMetWithGov
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className='text-xs dark:bg-slate-900'>
                                            <SelectGroup>
                                                <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='pt-6'>
                                    <Label htmlFor="Date" className="text-[0.7rem] font-semibold text-gray-600">
                                        Date
                                    </Label>
                                    <div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-8 w-full md:w-[260px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piDatePAMetWithGov && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piDatePAMetWithGov && moment(piDatePAMetWithGov).isValid() ? (
                                                        <>
                                                            <div className="flex">
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {convertToUTCDate(piDatePAMetWithGov)}
                                                            </div>
                                                            <div className='flex'>
                                                                <Icons.close className="h-4 w-4" onClick={() => {
                                                                    setValue("data", { ...programData, piDatePAMetWithGov: null });
                                                                    setPiDatePAMetWithGov(null)
                                                                }} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                                            <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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
                                                        setValue("data", { ...programData, piDatePAMetWithGov: dateStr });
                                                        setPiDatePAMetWithGov(dateStr)
                                                    }}
                                                    value={piDatePAMetWithGov} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 my-2'>
                                <div>
                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="board-members">Program attorneys met with parole board members?
                                    </Label>
                                    <Select
                                        value={piPAMetWithParoleBd}
                                        onValueChange={(e) => {
                                            setValue("data", { ...programData, piPAMetWithParoleBd: e });
                                            setPiPAMetWithParoleBd(e)

                                        }}
                                    >
                                        <SelectTrigger
                                            id="board-members"
                                            disabled={userRoles.includes("VIEWER")}
                                            className="h-8 w-full md:w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piPAMetWithParoleBd
                                                    ? piPAMetWithParoleBd
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className='text-xs dark:bg-slate-900'>
                                            <SelectGroup>
                                                <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='cols-span-2'>
                                    <Label htmlFor="Date" className="text-[0.7rem] font-semibold text-gray-600">
                                        Date
                                    </Label>
                                    <div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-8 w-full md:w-[260px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piDatePAMetWithParoleBd && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piDatePAMetWithParoleBd && moment(piDatePAMetWithParoleBd).isValid() ? (
                                                        <>
                                                            <div className="flex">
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {convertToUTCDate(piDatePAMetWithParoleBd)}
                                                            </div>
                                                            <div className='flex'>
                                                                <Icons.close className="h-4 w-4" onClick={() => {
                                                                    setValue("data", { ...programData, piDatePAMetWithParoleBd: null });
                                                                    setPiDatePAMetWithParoleBd(null)
                                                                }} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                                            <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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
                                                        setValue("data", { ...programData, piDatePAMetWithParoleBd: dateStr });
                                                        setPiDatePAMetWithParoleBd(dateStr)
                                                    }}
                                                    value={piDatePAMetWithParoleBd} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 my-2'>
                                <div>
                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="represented-defendant">Program attorney represented defendant?
                                    </Label>
                                    <Select
                                        value={piPARepresented}
                                        onValueChange={(e) => {
                                            setValue("data", { ...programData, piPARepresented: e });
                                            setPiPARepresented(e)

                                        }}
                                    >
                                        <SelectTrigger
                                            id="represented-defendant"
                                            disabled={userRoles.includes("VIEWER")}
                                            className="h-8 w-full md:w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piPARepresented
                                                    ? piPARepresented
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className='text-xs dark:bg-slate-900'>
                                            <SelectGroup>
                                                <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='col-span-1 md:col-span-2'>
                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="recruited-council">Program recruited defense council?
                                    </Label>
                                    <Select
                                        value={piProgRecruitedDefCouns}
                                        onValueChange={(e) => {
                                            setValue("data", { ...programData, piProgRecruitedDefCouns: e });
                                            setPiProgRecruitedDefCouns(e)

                                        }}
                                    >
                                        <SelectTrigger
                                            id="recruited-council"
                                            disabled={userRoles.includes("VIEWER")}
                                            className="h-8 w-[260px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piProgRecruitedDefCouns
                                                    ? piProgRecruitedDefCouns
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className='text-xs dark:bg-slate-900'>
                                            <SelectGroup>
                                                <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 my-2'>
                                <div>
                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="retained-council">Program retained defense council?
                                    </Label>
                                    <Select
                                        value={piProgRetainedDefCouns}
                                        onValueChange={(e) => {
                                            setValue("data", { ...programData, piProgRetainedDefCouns: e });
                                            setPiProgRetainedDefCouns(e)

                                        }}
                                    >
                                        <SelectTrigger
                                            id="retained-council"
                                            disabled={userRoles.includes("VIEWER")}
                                            className="h-8 w-full md:w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piProgRetainedDefCouns
                                                    ? piProgRetainedDefCouns
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className='text-xs dark:bg-slate-900'>
                                            <SelectGroup>
                                                <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='col-span-1 md:col-span-2'>
                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="funds-investigators">Program provided funds for experts/investigators?
                                    </Label>
                                    <Select
                                        value={piProgFundedExperts}
                                        onValueChange={(e) => {
                                            setValue("data", { ...programData, piProgFundedExperts: e });
                                            setPiProgFundedExperts(e)

                                        }}
                                    >
                                        <SelectTrigger
                                            id="funds-investigators"
                                            disabled={userRoles.includes("VIEWER")}
                                            className="h-8 w-full md:w-[260px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piProgFundedExperts
                                                    ? piProgFundedExperts
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className='text-xs dark:bg-slate-900'>
                                            <SelectGroup>
                                                <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="border-y border-x-0 my-3" />
                            <div className="flex justify-start items-center my-2">
                                <Label className='text-sm font-semibold'>Trainings and Materials</Label>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-2 my-2'>
                                {/* <div>
                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="Mexican nationals">
                                        Program invited defense counsel to training on defense of Mexican nationals?
                                    </Label>
                                    <Select
                                        value={piInvitedDefCounsToTraining}
                                        onValueChange={(e) => {
                                            setValue("data", { ...programData, piInvitedDefCounsToTraining: e });
                                            setPiInvitedDefCounsToTraining(e)
                                        }}
                                    >
                                        <SelectTrigger
                                            id="Mexican nationals"
                                            disabled={userRoles.includes("VIEWER")}
                                            className="h-8 w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piInvitedDefCounsToTraining
                                                    ? piInvitedDefCounsToTraining
                                                    : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className='text-xs dark:bg-slate-900'>
                                            <SelectGroup>
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div> */}
                                {/* <div className="col-span-2">
                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="on-counsel-training">Notes on counsel training</Label>
                                    <Textarea id="on-counsel-training"
                                        onChange={(e) => {
                                            setValue("data", { ...programData, piInvitedDefCounsToTrainingNotes: e.target.value });
                                            setPiInvitedDefCounsToTrainingNotes(e.target.value)
                                        }}
                                        value={piInvitedDefCounsToTrainingNotes}
                                        disabled={userRoles.includes("VIEWER")}
                                        className="h-20 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none" placeholder={userRoles.includes("VIEWER") ? "-" : "Type here.."} />
                                </div> */}
                            </div>
                            <div className="flex justify-start items-center my-2">
                                <Label className='text-sm font-semibold'>Program Attorneys sent defense counsel legal material?</Label>
                                {!userRoles.includes("VIEWER") && (
                                    <Icons.add className="w-4 h-4 ml-auto mr-2 cursor-pointer" onClick={() => {
                                        let newData = JSON.parse(JSON.stringify([...legalMeterial, { lmItem: '', lmDateSent: null, lmNote: '', lmWhom: "" }]))
                                        setLegalMeterial(newData);
                                    }}
                                    />
                                )}
                            </div>
                            <div>
                                {legalMeterial && legalMeterial?.length > 0 && legalMeterial?.map((pleadings_ele: any, i: any) => {
                                    if (legalMeterial[i] && typeof legalMeterial[i] === "object") {
                                        return (
                                            <div key={i} className=' border border-dashed p-2 mb-2 '>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 ">
                                                    <div className='col-span-1 md:col-span-4'>
                                                        <div className='flex justify-start md:justify-end'>
                                                            {!userRoles.includes("VIEWER") && (
                                                                <Icons.close className="w-4 h-4 ml-5 cursor-pointer" onClick={() => {
                                                                    let oldData: any = JSON.parse(
                                                                        JSON.stringify(legalMeterial)
                                                                    )
                                                                    if (oldData[i]) {
                                                                        let deleteItem: any = JSON.parse(JSON.stringify(oldData[i]))
                                                                        setLegalMeterialDelete([...legalMeterialDelete, deleteItem]);
                                                                        delete oldData[i]
                                                                        setLegalMeterial(oldData)
                                                                    }
                                                                }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='col-span-1 ml-1'>

                                                        <Label className="text-[0.7rem] font-semibold text-gray-600"
                                                            htmlFor="Item-sent">Item sent</Label>
                                                        <Select
                                                            value={legalMeterial[i]['lmItem']}
                                                            onValueChange={(e) => {
                                                                let newData = [...legalMeterial];
                                                                newData[i]['lmItem'] = e;
                                                                setLegalMeterial(newData)
                                                            }}
                                                        >
                                                            <SelectTrigger
                                                                id="Item-sent"
                                                                disabled={userRoles.includes("VIEWER")}
                                                                className="h-8 w-full md:w-[220px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                                                <SelectValue placeholder="Select Option" className='text-xs'>
                                                                    {legalMeterial[i]['lmItem']
                                                                        ? legalMeterial[i]['lmItem']
                                                                        : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent className='text-xs dark:bg-slate-900'>
                                                                <SelectGroup>
                                                                    <SelectItem value="" className='text-xs' >Select option</SelectItem>
                                                                    <SelectItem value="Affidavit" className='text-xs' >Affidavit</SelectItem>
                                                                    <SelectItem value="Expert/investigator names" className='text-xs'>Expert/investigator names</SelectItem>
                                                                    <SelectItem value="Other assistance rendered" className='text-xs'>Other assistance rendered</SelectItem>
                                                                    <SelectItem value="Other legal materials" className='text-xs'>Other legal materials</SelectItem>
                                                                    <SelectItem value="MCLAP manual" className='text-xs'>MCLAP manual</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <div className='mx-0 md:mx-[70px]'>
                                                            <Label htmlFor="Date" className="text-[0.7rem] font-semibold text-gray-600">
                                                                Date
                                                            </Label>
                                                            <div>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "h-8 w-full md:w-[260px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                                !legalMeterial[i]['lmDateSent'] && "text-muted-foreground"
                                                                            )} disabled={userRoles.includes("VIEWER")}>
                                                                            {legalMeterial[i]['lmDateSent'] && moment(legalMeterial[i]['lmDateSent']).isValid() ? (
                                                                                <>
                                                                                    <div className="flex">
                                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                                        {convertToUTCDate(legalMeterial[i]['lmDateSent'])}
                                                                                    </div>
                                                                                    <div className='flex'>
                                                                                        <Icons.close className="h-4 w-4" onClick={() => {
                                                                                            let newData = [...legalMeterial];
                                                                                            newData[i]['lmDateSent'] = null;
                                                                                            setLegalMeterial(newData)
                                                                                        }} />
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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

                                                                                let newData = [...legalMeterial];
                                                                                newData[i]['lmDateSent'] = dateStr;
                                                                                setLegalMeterial(newData)
                                                                            }}
                                                                            value={legalMeterial[i]['lmDateSent']} />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-1 md:col-span-2 mx-0 md:mx-[150px]">
                                                        <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="To-whom">To whom</Label>
                                                        {/* <Textarea id="To-whom"
                                                            value={legalMeterial[i]['lmWhom']}
                                                            disabled={userRoles.includes("VIEWER")}
                                                            onChange={(e) => {
                                                                let newData = [...legalMeterial];
                                                                newData[i]['lmWhom'] = e.target.value;
                                                                setLegalMeterial(newData)
                                                            }}
                                                            className="h-20 text-xs w-[300px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none" placeholder={userRoles.includes("VIEWER") ? "-" : "Type here.."} /> */}
                                                        <Textarea id="To-whom"
                                                            value={legalMeterial[i]['lmNote']}
                                                            disabled={userRoles.includes("VIEWER")}
                                                            onChange={(e) => {
                                                                let newData = [...legalMeterial];
                                                                newData[i]['lmNote'] = e.target.value;
                                                                setLegalMeterial(newData)
                                                            }}
                                                            className="h-20 text-xs w-full md:w-[295px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none" placeholder={userRoles.includes("VIEWER") ? "-" : "Type here.."} />
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>

                            <div className="flex justify-start items-center my-2">
                                <Label className='text-sm font-semibold'>Program Training</Label>
                                {!userRoles.includes("VIEWER") && (
                                    <Icons.add className="w-4 h-4 ml-auto mr-2 cursor-pointer" onClick={() => {
                                        let newData = JSON.parse(JSON.stringify([...programTraining, { ptTypeTraining: "", ptDateTypeTraining: null, ptInvited: "", ptAttended: "" }]))
                                        setProgramTraining(newData);
                                    }}
                                    />
                                )}
                            </div>

                            <div>
                                {programTraining && programTraining?.length > 0 && programTraining?.map((training_ele: any, i: any) => {
                                    if (programTraining[i] && typeof programTraining[i] === "object") {
                                        return (
                                            <div key={i} className=' border border-dashed p-2 mb-2 '>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 ">
                                                    <div className='col-span-1 md:col-span-4'>
                                                        <div className='flex justify-end'>
                                                            {!userRoles.includes("VIEWER") && (
                                                                <Icons.close className="w-4 h-4 ml-5 cursor-pointer" onClick={() => {
                                                                    let oldData: any = JSON.parse(
                                                                        JSON.stringify(programTraining)
                                                                    )
                                                                    if (oldData[i]) {
                                                                        let deleteItem: any = JSON.parse(JSON.stringify(oldData[i]))
                                                                        setProgramTrainingDelete([...programTrainingDelete, deleteItem]);
                                                                        delete oldData[i]
                                                                        setProgramTraining(oldData)
                                                                    }
                                                                }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>



                                                    <div className='col-span-1 ml-1'>
                                                        <Label className="text-[0.7rem] font-semibold text-gray-600"
                                                            htmlFor="Training">Type of training</Label>
                                                        <Select
                                                            value={programTraining[i]['ptTypeTraining']}
                                                            onValueChange={(e) => {
                                                                let newData = [...programTraining];
                                                                newData[i]['ptTypeTraining'] = e;
                                                                setProgramTraining(newData)
                                                            }}
                                                        >
                                                            <SelectTrigger
                                                                id="Training"
                                                                disabled={userRoles.includes("VIEWER")}
                                                                className="h-8 w-full md:w-[220px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">

                                                                <SelectValue placeholder="Select Option" className='text-xs'>
                                                                    <div className={`${userRoles.includes("VIEWER") ? "max-w-[200px]" : "max-w-[160px]"} overflow-hidden text-ellipsis whitespace-nowrap`}>
                                                                        {programTraining[i]['ptTypeTraining']
                                                                            ? programTraining[i]['ptTypeTraining']
                                                                            : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                                                    </div>
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent className='text-xs dark:bg-slate-900'>
                                                                <SelectGroup>
                                                                    <SelectItem value="" className='text-xs' >Select option</SelectItem>
                                                                    <SelectItem value="Santa Clara DP College scholarship" className='text-xs' >Santa Clara DP College scholarship</SelectItem>
                                                                    <SelectItem value="Defense Attorney training" className='text-xs'>Defense Attorney training</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <div className='mx-0 md:mx-[70px]'>
                                                            <Label htmlFor="Date" className="text-[0.7rem] font-semibold text-gray-600">
                                                                Date
                                                            </Label>
                                                            <div>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "h-8 w-full md:w-[260px] justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                                !programTraining[i]['ptDateTypeTraining'] && "text-muted-foreground"
                                                                            )} disabled={userRoles.includes("VIEWER")}>
                                                                            {programTraining[i]['ptDateTypeTraining'] && moment(programTraining[i]['ptDateTypeTraining']).isValid() ? (
                                                                                <>
                                                                                    <div className="flex">
                                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                                        {convertToUTCDate(programTraining[i]['ptDateTypeTraining'])}
                                                                                    </div>
                                                                                    <div className='flex'>
                                                                                        <Icons.close className="h-4 w-4" onClick={() => {
                                                                                            let newData = [...programTraining];
                                                                                            newData[i]['ptDateTypeTraining'] = null;
                                                                                            setProgramTraining(newData)
                                                                                        }} />
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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

                                                                                let newData = [...programTraining];
                                                                                newData[i]['ptDateTypeTraining'] = dateStr;
                                                                                setProgramTraining(newData)
                                                                            }}
                                                                            value={programTraining[i]['ptDateTypeTraining']} />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mx-0 md:mx-[150px]">
                                                        <Label className="text-[0.7rem] font-semibold text-gray-600 whitespace-nowrap" htmlFor="invited">Who was invited?</Label>
                                                        <Textarea id="invited"
                                                            value={programTraining[i]['ptInvited']}
                                                            disabled={userRoles.includes("VIEWER")}
                                                            onChange={(e) => {
                                                                let newData = [...programTraining];
                                                                newData[i]['ptInvited'] = e.target.value;
                                                                setProgramTraining(newData)
                                                            }}
                                                            className="h-20 text-xs w-full md:w-[295px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none" placeholder={userRoles.includes("VIEWER") ? "-" : "Type here.."} />
                                                    </div>
                                                </div>
                                                <div className="w-full">
                                                    <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="attended">Who attended?</Label>
                                                    <Textarea id="attended"
                                                        onChange={(e) => {
                                                            let newData = [...programTraining];
                                                            newData[i]['ptAttended'] = e.target.value
                                                            setProgramTraining(newData)
                                                        }}
                                                        value={programTraining[i]['ptAttended']}
                                                        disabled={userRoles.includes("VIEWER")}
                                                        className="h-20 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none" placeholder={userRoles.includes("VIEWER") ? "-" : "Type here.."} />
                                                </div>

                                            </div>
                                        )
                                    }
                                })}

                            </div>

                            <div className="border-y border-x-0 my-3">
                                <div className="flex justify-start items-center my-2">
                                    <Label className='text-sm font-semibold'>Amicus Brief filed in</Label>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <div>
                                            <Label className="text-[0.7rem] font-semibold text-gray-600"
                                                htmlFor="State-trial-court">
                                                State Trial court?</Label>
                                            <Select
                                                value={piAmicusBriefStateTrial}
                                                onValueChange={(e) => {
                                                    setValue("data", { ...programData, piAmicusBriefStateTrial: e });
                                                    setPiAmicusBriefStateTrial(e)

                                                }}
                                            >
                                                <SelectTrigger
                                                    id="State-trial-court"
                                                    disabled={userRoles.includes("VIEWER")}
                                                    className="h-8 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                                    <SelectValue placeholder="Unknown" className='text-xs'>
                                                        {piAmicusBriefStateTrial
                                                            ? piAmicusBriefStateTrial
                                                            : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className='text-xs dark:bg-slate-900'>
                                                    <SelectGroup>
                                                        <SelectItem value="" className="text-xs">Select Option</SelectItem>
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
                                                htmlFor="State-supreme-court">
                                                State Supreme court?</Label>
                                            <Select
                                                value={piAmicusBriefStateSupr}
                                                onValueChange={(e) => {
                                                    setValue("data", { ...programData, piAmicusBriefStateSupr: e });
                                                    setPiAmicusBriefStateSupr(e)

                                                }}

                                            >
                                                <SelectTrigger
                                                    id="State-supreme-court"
                                                    disabled={userRoles.includes("VIEWER")}
                                                    className="h-8 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                                    <SelectValue placeholder="Unknown" className='text-xs'>
                                                        {piAmicusBriefStateSupr
                                                            ? piAmicusBriefStateSupr
                                                            : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className='text-xs dark:bg-slate-900'>
                                                    <SelectGroup>
                                                        <SelectItem value="" className="text-xs">Select Option</SelectItem>
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
                                                htmlFor="State-post-Conv">
                                                State Post-Conv. court?</Label>
                                            <Select
                                                value={piAmicusBriefStatePostCon}
                                                onValueChange={(e) => {
                                                    setValue("data", { ...programData, piAmicusBriefStatePostCon: e });
                                                    setPiAmicusBriefStatePostCon(e)

                                                }}

                                            >
                                                <SelectTrigger
                                                    id="State-post-Conv"
                                                    disabled={userRoles.includes("VIEWER")}
                                                    className="h-8 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                                    <SelectValue placeholder="Unknown" className='text-xs'>
                                                        {piAmicusBriefStatePostCon
                                                            ? piAmicusBriefStatePostCon
                                                            : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className='text-xs dark:bg-slate-900'>
                                                    <SelectGroup>
                                                        <SelectItem value="" className="text-xs">Select Option</SelectItem>
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
                                            <Label htmlFor="Date" className="text-[0.7rem] font-semibold text-gray-600">
                                                Date
                                            </Label>
                                            <div>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "h-8 w-full justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBriefStateTrial && "text-muted-foreground"
                                                            )} disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBriefStateTrial && moment(piDateAmicusBriefStateTrial).isValid() ? (
                                                                <><div className="flex">
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(piDateAmicusBriefStateTrial)}
                                                                </div>
                                                                    <div className='flex'>
                                                                        <Icons.close className="h-4 w-4" onClick={() => {
                                                                            setValue("data", { ...programData, piDateAmicusBriefStateTrial: null });
                                                                            setPiDateAmicusBriefStateTrial(null)

                                                                        }} />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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
                                                                setValue("data", { ...programData, piDateAmicusBriefStateTrial: dateStr });
                                                                setPiDateAmicusBriefStateTrial(dateStr)

                                                            }}
                                                            value={piDateAmicusBriefStateTrial} />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
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
                                                                "h-8 w-full justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBriefStateSupr && "text-muted-foreground"
                                                            )}
                                                            disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBriefStateSupr && moment(piDateAmicusBriefStateSupr).isValid() ? (
                                                                <>
                                                                    <div className="flex">
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {convertToUTCDate(piDateAmicusBriefStateSupr)}
                                                                    </div>
                                                                    <div className='flex'>
                                                                        <Icons.close className="h-4 w-4" onClick={() => {
                                                                            setPiDateAmicusBriefStateSupr(null)
                                                                            setValue("data", { ...programData, piDateAmicusBriefStateSupr: null });
                                                                        }} />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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
                                                                setPiDateAmicusBriefStateSupr(dateStr)
                                                                setValue("data", { ...programData, piDateAmicusBriefStateSupr: dateStr });
                                                            }}
                                                            value={piDateAmicusBriefStateSupr} />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
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
                                                                "h-8 w-full justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBriefStatePostCon && "text-muted-foreground"
                                                            )}
                                                            disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBriefStatePostCon && moment(piDateAmicusBriefStatePostCon).isValid() ? (
                                                                <>
                                                                    <div className="flex">
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {convertToUTCDate(piDateAmicusBriefStatePostCon)}
                                                                    </div>
                                                                    <div className='flex'>
                                                                        <Icons.close className="h-4 w-4" onClick={() => {
                                                                            setPiDateAmicusBriefStatePostCon(null)
                                                                            setValue("data", { ...programData, piDateAmicusBriefStatePostCon: null });
                                                                        }} />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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
                                                                setPiDateAmicusBriefStatePostCon(dateStr)
                                                                setValue("data", { ...programData, piDateAmicusBriefStatePostCon: dateStr });
                                                            }}
                                                            value={piDateAmicusBriefStatePostCon} />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <Label className="text-[0.7rem] font-semibold text-gray-600"
                                                htmlFor="Federal-trial-court">
                                                Federal Trial court?</Label>
                                            <Select
                                                value={piAmicusBrieFedTrial}
                                                onValueChange={(e) => {
                                                    setValue("data", { ...programData, piAmicusBrieFedTrial: e });
                                                    setPiAmicusBrieFedTrial(e)

                                                }}
                                            >
                                                <SelectTrigger
                                                    id="Federal-trial-court"
                                                    disabled={userRoles.includes("VIEWER")}
                                                    className="h-8 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                                    <SelectValue placeholder="Unknown" className='text-xs'>
                                                        {piAmicusBrieFedTrial
                                                            ? piAmicusBrieFedTrial
                                                            : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className='text-xs dark:bg-slate-900'>
                                                    <SelectGroup>
                                                        <SelectItem value="" className="text-xs">Select Option</SelectItem>
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
                                                htmlFor="Federal-habeas-court">
                                                Federal Habeas court?</Label>
                                            <Select
                                                value={piAmicusBriefFedHabeas}
                                                onValueChange={(e) => {
                                                    setValue("data", { ...programData, piAmicusBriefFedHabeas: e });
                                                    setPiAmicusBriefFedHabeas(e)

                                                }}
                                            >
                                                <SelectTrigger
                                                    id="Federal-habeas-court"
                                                    disabled={userRoles.includes("VIEWER")}
                                                    className="h-8 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                                    <SelectValue placeholder="Unknown" className='text-xs'>
                                                        {piAmicusBriefFedHabeas
                                                            ? piAmicusBriefFedHabeas
                                                            : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className='text-xs dark:bg-slate-900'>
                                                    <SelectGroup>
                                                        <SelectItem value="" className="text-xs">Select Option</SelectItem>
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
                                                htmlFor="Federal-appeals-court">
                                                Federal Appeals court?</Label>
                                            <Select
                                                value={piAmicusBriefFedAppeals}
                                                onValueChange={(e) => {
                                                    setValue("data", { ...programData, piAmicusBriefFedAppeals: e });
                                                    setPiAmicusBriefFedAppeals(e)
                                                }}
                                            >
                                                <SelectTrigger
                                                    id="Federal-appeals-court"
                                                    disabled={userRoles.includes("VIEWER")}
                                                    className="h-8 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                                    <SelectValue placeholder="Unknown" className='text-xs'>
                                                        {piAmicusBriefFedAppeals
                                                            ? piAmicusBriefFedAppeals
                                                            : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className='text-xs dar:bg-slate-900'>
                                                    <SelectGroup>
                                                        <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                        <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                        <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                        <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                        <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className='mb-3'>
                                            <Label className="text-[0.7rem] font-semibold text-gray-600"
                                                htmlFor="US-upreme-court">
                                                U.S. Supreme court?</Label>
                                            <Select
                                                value={piAmicusBriefUSSupr}
                                                onValueChange={(e) => {
                                                    setValue("data", { ...programData, piAmicusBriefUSSupr: e });
                                                    setPiAmicusBriefUSSupr(e)
                                                }}
                                            >
                                                <SelectTrigger
                                                    id="US-upreme-court"
                                                    disabled={userRoles.includes("VIEWER")}
                                                    className="h-8 w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                                    <SelectValue placeholder="Unknown" className='text-xs'>
                                                        {piAmicusBriefUSSupr
                                                            ? piAmicusBriefUSSupr
                                                            : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className='text-xs dark:bg-slate-900'>
                                                    <SelectGroup>
                                                        <SelectItem value="" className="text-xs">Select Option</SelectItem>
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
                                            <Label htmlFor="Date" className="text-[0.7rem] font-semibold text-gray-600">
                                                Date
                                            </Label>
                                            <div>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "h-8 w-full justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBrieFedTrial && "text-muted-foreground"
                                                            )}
                                                            disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBrieFedTrial && moment(piDateAmicusBrieFedTrial).isValid() ? (
                                                                <>
                                                                    <div className="flex">
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {convertToUTCDate(piDateAmicusBrieFedTrial)}
                                                                    </div>
                                                                    <div className='flex'>
                                                                        <Icons.close className="h-4 w-4" onClick={() => {
                                                                            setValue("data", { ...programData, piDateAmicusBrieFedTrial: null });
                                                                            setPiDateAmicusBrieFedTrial(null)
                                                                        }} />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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
                                                                setValue("data", { ...programData, piDateAmicusBrieFedTrial: dateStr });
                                                                setPiDateAmicusBrieFedTrial(dateStr)
                                                            }}
                                                            value={piDateAmicusBrieFedTrial} />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
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
                                                                "h-8 w-full justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBriefFedHabeas && "text-muted-foreground"
                                                            )}
                                                            disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBriefFedHabeas && moment(piDateAmicusBriefFedHabeas).isValid() ? (
                                                                <>
                                                                    <div className="flex">
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {convertToUTCDate(piDateAmicusBriefFedHabeas)}
                                                                    </div>
                                                                    <div className='flex'>
                                                                        <Icons.close className="h-4 w-4" onClick={() => {
                                                                            setValue("data", { ...programData, piDateAmicusBriefFedHabeas: null });
                                                                            setPiDateAmicusBriefFedHabeas(null)
                                                                        }} />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : <div className="flex">
                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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
                                                                setValue("data", { ...programData, piDateAmicusBriefFedHabeas: dateStr });
                                                                setPiDateAmicusBriefFedHabeas(dateStr)

                                                            }}
                                                            value={piDateAmicusBriefFedHabeas} />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
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
                                                                "h-8 w-full justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBriefFedAppeals && "text-muted-foreground"
                                                            )}
                                                            disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBriefFedAppeals && moment(piDateAmicusBriefFedAppeals).isValid() ? (
                                                                <>
                                                                    <div className="flex">
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {convertToUTCDate(piDateAmicusBriefFedAppeals)}
                                                                    </div>
                                                                    <div className='flex'>
                                                                        <Icons.close className="h-4 w-4" onClick={() => {
                                                                            setValue("data", { ...programData, piDateAmicusBriefFedAppeals: null });
                                                                            setPiDateAmicusBriefFedAppeals(null)
                                                                        }} />
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
                                                    <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                        <Calendar
                                                            defaultView="century"
                                                            onChange={(e: any) => {
                                                                let dateObj = new Date(e);
                                                                let day = dateObj.getDate()
                                                                let month = dateObj.getMonth() + 1;
                                                                let year = dateObj.getFullYear()
                                                                let dateStr = `${month}/${day}/${year}`;
                                                                setValue("data", { ...programData, piDateAmicusBriefFedAppeals: dateStr });
                                                                setPiDateAmicusBriefFedAppeals(dateStr)

                                                            }}
                                                            value={piDateAmicusBriefFedAppeals} />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
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
                                                                "h-8 w-full justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBriefUSSupr && "text-muted-foreground"
                                                            )}
                                                            disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBriefUSSupr && moment(piDateAmicusBriefUSSupr).isValid() ? (
                                                                <><div className="flex">
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(piDateAmicusBriefUSSupr)}
                                                                </div>
                                                                    <div className='flex'>
                                                                        <Icons.close className="h-4 w-4" onClick={() => {
                                                                            setValue("data", { ...programData, piDateAmicusBriefUSSupr: null });
                                                                            setPiDateAmicusBriefUSSupr(null)
                                                                        }} />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" :
                                                                    <div className="flex">
                                                                        <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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
                                                                setValue("data", { ...programData, piDateAmicusBriefUSSupr: dateStr });
                                                                setPiDateAmicusBriefUSSupr(dateStr)
                                                            }}
                                                            value={piDateAmicusBriefUSSupr} />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-start items-center my-2">
                                <Label className='text-sm font-semibold'>IACHR</Label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div>
                                        <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="IACHR">Program attorneys prepared petition to IACHR?
                                        </Label>
                                        <Select
                                            value={piPetitionToIACHR}
                                            onValueChange={(e) => {
                                                setValue("data", { ...programData, piPetitionToIACHR: e });
                                                setPiPetitionToIACHR(e)

                                            }}

                                        >
                                            <SelectTrigger
                                                id="IACHR"
                                                disabled={userRoles.includes("VIEWER")}
                                                className="h-8 w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                                <SelectValue placeholder="Unknown" className='text-xs'>
                                                    {piPetitionToIACHR
                                                        ? piPetitionToIACHR
                                                        : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className='text-xs dark:bg-slate-900'>
                                                <SelectGroup>
                                                    <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                    <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                    <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                    <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                    <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="precautionary-measures">IACHR issue precautionary measures?
                                        </Label>
                                        <Select
                                            value={piIACHRPrecaution}
                                            onValueChange={(e) => {
                                                setValue("data", { ...programData, piIACHRPrecaution: e });
                                                setPiIACHRPrecaution(e)

                                            }}

                                        >
                                            <SelectTrigger
                                                id="precautionary-measures"
                                                disabled={userRoles.includes("VIEWER")}
                                                className="h-8 w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                                <SelectValue placeholder="Unknown" className='text-xs'>
                                                    {piIACHRPrecaution
                                                        ? piIACHRPrecaution
                                                        : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className='text-xs dark:bg-slate-900'>
                                                <SelectGroup>
                                                    <SelectItem value="" className="text-xs">Select Option</SelectItem>
                                                    <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                    <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                    <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                    <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="based-on-merits">IACHR issue decision based on merits?
                                        </Label>
                                        <Select
                                            value={piIACHRMerits}
                                            onValueChange={(e) => {
                                                setValue("data", { ...programData, piIACHRMerits: e });
                                                setPiIACHRMerits(e)
                                            }}
                                        >
                                            <SelectTrigger
                                                id="based-on-merits"
                                                disabled={userRoles.includes("VIEWER")}
                                                className="h-8 w-1/2 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                                <SelectValue placeholder="Unknown" className='text-xs'>
                                                    {piIACHRMerits
                                                        ? piIACHRMerits
                                                        : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className='text-xs dark:bg-slate-900'>
                                                <SelectGroup>
                                                    <SelectItem value="" className="text-xs">Select Option</SelectItem>
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
                                        <Label htmlFor="Date" className="text-[0.7rem] font-semibold text-gray-600">
                                            Date
                                        </Label>
                                        <div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "h-8 w-1/2 justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                            !piDatePetitionToIACHR && "text-muted-foreground"
                                                        )} disabled={userRoles.includes("VIEWER")}>
                                                        {piDatePetitionToIACHR && moment(piDatePetitionToIACHR).isValid() ? (
                                                            <>
                                                                <div className="flex">
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(piDatePetitionToIACHR)}
                                                                </div>
                                                                <div className='flex'>
                                                                    <Icons.close className="h-4 w-4" onClick={() => {
                                                                        setValue("data", { ...programData, piDatePetitionToIACHR: null });
                                                                        setPiDatePetitionToIACHR(null)
                                                                    }} />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            userRoles.includes("VIEWER") ? "-" : <div className='flex'>
                                                                <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
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
                                                            setValue("data", { ...programData, piDatePetitionToIACHR: dateStr });
                                                            setPiDatePetitionToIACHR(dateStr)
                                                        }}
                                                        value={piDatePetitionToIACHR} />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
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
                                                            "h-8 w-1/2 justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                            !piDateIACHRPrecaution && "text-muted-foreground"
                                                        )} disabled={userRoles.includes("VIEWER")}>
                                                        {piDateIACHRPrecaution && moment(piDateIACHRPrecaution).isValid() ? (
                                                            <>
                                                                <div className="flex">
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(piDateIACHRPrecaution)}
                                                                </div>
                                                                <div className='flex'>
                                                                    <Icons.close className="h-4 w-4"
                                                                        onClick={() => {
                                                                            setValue("data", { ...programData, piDateIACHRPrecaution: null });
                                                                            setPiDateIACHRPrecaution(null)
                                                                        }} />
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
                                                <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                    <Calendar
                                                        defaultView="century"
                                                        onChange={(e: any) => {
                                                            let dateObj = new Date(e);
                                                            let day = dateObj.getDate()
                                                            let month = dateObj.getMonth() + 1;
                                                            let year = dateObj.getFullYear()
                                                            let dateStr = `${month}/${day}/${year}`;
                                                            setValue("data", { ...programData, piDateIACHRPrecaution: dateStr });
                                                            setPiDateIACHRPrecaution(dateStr)
                                                        }}
                                                        value={piDateIACHRPrecaution} />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
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
                                                            "h-8 w-1/2 justify-between text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                            !piDateIACHRMerits && "text-muted-foreground"
                                                        )} disabled={userRoles.includes("VIEWER")}>
                                                        {piDateIACHRMerits && moment(piDateIACHRMerits).isValid() ? (
                                                            <>
                                                                <div className="flex">
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(piDateIACHRMerits)}
                                                                </div>
                                                                <div className='flex'>
                                                                    <Icons.close className="h-4 w-4"
                                                                        onClick={() => {
                                                                            setValue("data", { ...programData, piDateIACHRMerits: null })
                                                                            setPiDateIACHRMerits(null)
                                                                        }} />
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
                                                <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                    <Calendar
                                                        defaultView="century"
                                                        onChange={(e: any) => {
                                                            let dateObj = new Date(e);
                                                            let day = dateObj.getDate()
                                                            let month = dateObj.getMonth() + 1;
                                                            let year = dateObj.getFullYear()
                                                            let dateStr = `${month}/${day}/${year}`;
                                                            setValue("data", { ...programData, piDateIACHRMerits: dateStr })
                                                            setPiDateIACHRMerits(dateStr)
                                                        }}
                                                        value={piDateIACHRMerits} />
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
                            <DialogClose className="text-black-700 text-xs" hidden={userRoles.includes("VIEWER")}>Discard</DialogClose>
                            {props.hidetext !== "View" && (
                                <Button type="submit" variant="outline" hidden={userRoles.includes("VIEWER")} className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs">
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
