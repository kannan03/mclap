'use client'

import { Icons } from "@/components/icons"
import {
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Label } from "@radix-ui/react-label"
import * as React from 'react'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { convertToUTCDate } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar as CalendarIcon } from "lucide-react"
import moment from "moment"
import { getSession } from "next-auth/react"
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useContext } from 'react';
import { CaseFilterContext } from "@/context/caseFilterContext"

const CaseProgramSchema = z.object({
    data: z.any(),
});
type FormData = z.infer<typeof CaseProgramSchema>

export default function FilterProgramDialog(props: any) {

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
    const appliedCaseFilters = useContext<any>(CaseFilterContext);
    const [date, setDate] = React.useState<any>(null)
    const [legalMeterial, setLegalMeterial] = React.useState<any>([{
        lmItem: ""
    }]);
    const [legalMeterialDelete, setLegalMeterialDelete] = React.useState<any>([]);

    const [programTraining, setProgramTraining] = React.useState<any>([{ptTypeTraining : ""}])
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


    const onSubmit = async (e: any) => {
        try {
            e.preventDefault();
            let payloadData = {
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
                piDateAmicusBriefUSSupr: piDateAmicusBriefUSSupr ? piDateAmicusBriefUSSupr : null,
                lmItem: legalMeterial?.length > 0 ? legalMeterial?.map((map_ele: any) => map_ele.lmItem) : [],
                ptTypeTraining: programTraining?.length > 0 ? programTraining?.map((map_ele: any) => map_ele.ptTypeTraining) : [],
            }
            props?.closeFilter(payloadData);

        } catch (err) {

        }

    }

    const fetchData = async () => {
        try {
            if (appliedCaseFilters) {
                setProgramData(appliedCaseFilters);
                let program = appliedCaseFilters;
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
                if (appliedCaseFilters?.lmItem) {
                    setLegalMeterial(appliedCaseFilters?.lmItem);
                }
                if (appliedCaseFilters?.ptTypeTraining) {
                    setProgramTraining(appliedCaseFilters?.ptTypeTraining);
                }

            }

        } catch (err) {

        }
    }

    React.useEffect(() => {
        const fetchUserRoles = async () => {
            setIsLoading(false)
            const session = await getSession()
            // setUserRoles(session?.user?.roles || [])
        }
        fetchUserRoles()
        fetchData()
    }, [])

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
                                                        "h-8 w-full md:w-1/2 justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piDateFirstInvolvement && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piDateFirstInvolvement && moment(piDateFirstInvolvement).isValid() ? (
                                                        <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {convertToUTCDate(piDateFirstInvolvement)}
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
                                                        "h-8 w-full md:w-[260px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piMetWithDefDate && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piMetWithDefDate && moment(piMetWithDefDate).isValid() ? (
                                                        <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {convertToUTCDate(piMetWithDefDate)}
                                                        </>
                                                    ) : (
                                                        userRoles.includes("VIEWER") ? "-" : <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent id="visit-to-defendant" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                <Calendar
                                                    defaultView="century"
                                                    onChange={(e: any) => {
                                                        let dateObj = new Date(e)
                                                        let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                        "h-8 w-full md:w-[260px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piMetWithDefCounsDate && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piMetWithDefCounsDate && moment(piMetWithDefCounsDate).isValid() ? (
                                                        <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {convertToUTCDate(piMetWithDefCounsDate)}
                                                        </>
                                                    ) : (
                                                        userRoles.includes("VIEWER") ? "-" : <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent id="visit-to-defendant" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                <Calendar
                                                    defaultView="century"
                                                    onChange={(e: any) => {
                                                        let dateObj = new Date(e);
                                                        let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                        "h-8 w-full md:w-[260px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piDatePAAppearedCourt && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piDatePAAppearedCourt && moment(piDatePAAppearedCourt).isValid() ? (
                                                        <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {convertToUTCDate(piDatePAAppearedCourt)}
                                                        </>
                                                    ) : (
                                                        userRoles.includes("VIEWER") ? "-" : <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                <Calendar
                                                    defaultView="century"
                                                    onChange={(e: any) => {
                                                        let dateObj = new Date(e);
                                                        let dateStr = moment(dateObj).format("YYYY-MM-DD");
                                                        setValue("data", { ...programData, piDatePAAppearedCourt: dateStr });
                                                        setPiDatePAAppearedCourt(dateStr)
                                                    }}
                                                    value={piDatePAAppearedCourt} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
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
                                            className="h-8 w-full md:w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piPAMetWithPros
                                                    ? piPAMetWithPros
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
                                </div>
                                <div className='col-span-2'>
                                    <Label htmlFor="Date" className="text-[0.7rem] font-semibold text-gray-600">
                                        Date
                                    </Label>
                                    <div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-8 w-full md:w-[260px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piDatePAMetWithPros && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piDatePAMetWithPros && moment(piDatePAMetWithPros).isValid() ? (
                                                        <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {convertToUTCDate(piDatePAMetWithPros)}
                                                        </>
                                                    ) : (
                                                        userRoles.includes("VIEWER") ? "-" : <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                <Calendar
                                                    defaultView="century"
                                                    onChange={(e: any) => {
                                                        let dateObj = new Date(e);
                                                        let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                        "h-8 w-full md:w-[260px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piDatePAMetWithGov && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piDatePAMetWithGov && moment(piDatePAMetWithGov).isValid() ? (
                                                        <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {convertToUTCDate(piDatePAMetWithGov)}
                                                        </>
                                                    ) : (
                                                        userRoles.includes("VIEWER") ? "-" : <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                <Calendar
                                                    defaultView="century"
                                                    onChange={(e: any) => {
                                                        let dateObj = new Date(e)
                                                        let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                        "h-8 w-full md:w-[260px] justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                        !piDatePAMetWithParoleBd && "text-muted-foreground"
                                                    )} disabled={userRoles.includes("VIEWER")}>
                                                    {piDatePAMetWithParoleBd && moment(piDatePAMetWithParoleBd).isValid() ? (
                                                        <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {convertToUTCDate(piDatePAMetWithParoleBd)}
                                                        </>
                                                    ) : (
                                                        userRoles.includes("VIEWER") ? "-" : <>
                                                            <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                <Calendar
                                                    defaultView="century"
                                                    onChange={(e: any) => {
                                                        let dateObj = new Date(e);
                                                        let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='col-span-2'>
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
                                            className="h-8 w-full md:w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piProgRecruitedDefCouns
                                                    ? piProgRecruitedDefCouns
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
                                                <SelectItem value="NA" className='text-xs'>NA</SelectItem>
                                                <SelectItem value="Yes" className='text-xs'>Yes</SelectItem>
                                                <SelectItem value="No" className='text-xs'>No</SelectItem>
                                                <SelectItem value="Unknown" className='text-xs'>Unknown</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='col-span-2'>
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
                                            className="h-8 w-full md:w-[230px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                            <SelectValue placeholder="Unknown" className='text-xs'>
                                                {piProgFundedExperts
                                                    ? piProgFundedExperts
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
                                </div>
                            </div>
                            <div className="border-y border-x-0 my-3" />
                            <div className="flex justify-start items-center my-2">
                                <Label className='text-sm font-semibold'>Trainings and Materials</Label>
                            </div>
                            <div className='grid grid-cols-3 gap-2 my-2'>
                                {/* <div>
                <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="Mexican nationals">
                    Program invited defense counsel to training on defense of Mexican nationals?
                </Label>
                <Select
                value={piInvitedDefCounsToTraining}
                onValueChange={(e)=>{
                    setValue("data",{ ...programData, piInvitedDefCounsToTraining : e});
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
                            </div>
                            <div className="flex justify-start items-center my-2">
                                <Label className='text-sm font-semibold'>Program Attorneys sent defense counsel legal material?</Label>
                                {!userRoles.includes("VIEWER") && (
                                    <Icons.add className="w-4 h-4 ml-auto mr-2 cursor-pointer" onClick={() => {
                                        let newData = JSON.parse(JSON.stringify([...legalMeterial, { lmItem: '', lmDateSent: null, lmNote: '', lmWhom: "", lmTypeTraining: "", lmInvited: "" }]))
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
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
                                                    <div className='col-span-4'>
                                                        <div className='flex justify-end'>
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
                                                                className="h-8 w-[250px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
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

                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>

                            <div className="flex justify-start items-center my-2">
                                {!userRoles.includes("VIEWER") && (
                                    <Icons.add className="w-4 h-4 ml-auto mr-2 cursor-pointer" onClick={() => {
                                        let newData = JSON.parse(JSON.stringify([...programTraining, { ptTypeTraining : "" }]))
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
                                                <div className="grid grid-cols-4 gap-2 ">
                                                    <div className='col-span-4'>
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

                                                </div>
                                                <div className='flex flex-row gap-2'>
                                                    <div className='ml-1.5'>
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
                                                                className="h-8 w-[250px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">
                                                                <SelectValue placeholder="Select Option" className='text-xs'>
                                                                    {programTraining[i]['ptTypeTraining']
                                                                        ? programTraining[i]['ptTypeTraining']
                                                                        : (userRoles.includes("VIEWER") ? "-" : "Select Type")}
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
                                                                "h-8 w-full justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBriefStateTrial && "text-muted-foreground"
                                                            )} disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBriefStateTrial && moment(piDateAmicusBriefStateTrial).isValid() ? (
                                                                <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(piDateAmicusBriefStateTrial)}
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                                </>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                        <Calendar
                                                            defaultView="century"
                                                            onChange={(e: any) => {
                                                                let dateObj = new Date(e)
                                                                let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                                "h-8 w-full justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBriefStateSupr && "text-muted-foreground"
                                                            )}
                                                            disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBriefStateSupr && moment(piDateAmicusBriefStateSupr).isValid() ? (
                                                                <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(piDateAmicusBriefStateSupr)}
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                                </>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                        <Calendar
                                                            defaultView="century"
                                                            onChange={(e: any) => {
                                                                let dateObj = new Date(e);
                                                                let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                                "h-8 w-full justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBriefStatePostCon && "text-muted-foreground"
                                                            )}
                                                            disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBriefStatePostCon && moment(piDateAmicusBriefStatePostCon).isValid() ? (
                                                                <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(piDateAmicusBriefStatePostCon)}
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                                </>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                        <Calendar
                                                            defaultView="century"
                                                            onChange={(e: any) => {
                                                                let dateObj = new Date(e)
                                                                let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                                "h-8 w-full justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBrieFedTrial && "text-muted-foreground"
                                                            )}
                                                            disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBrieFedTrial && moment(piDateAmicusBrieFedTrial).isValid() ? (
                                                                <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(piDateAmicusBrieFedTrial)}
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                                </>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                        <Calendar
                                                            defaultView="century"
                                                            onChange={(e: any) => {
                                                                let dateObj = new Date(e);
                                                                let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                                "h-8 w-full justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBriefFedHabeas && "text-muted-foreground"
                                                            )}
                                                            disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBriefFedHabeas && moment(piDateAmicusBriefFedHabeas).isValid() ? (
                                                                <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(piDateAmicusBriefFedHabeas)}
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                                </>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                        <Calendar
                                                            defaultView="century"
                                                            onChange={(e: any) => {
                                                                let dateObj = new Date(e)
                                                                let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                                "h-8 w-full justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBriefFedAppeals && "text-muted-foreground"
                                                            )}
                                                            disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBriefFedAppeals && moment(piDateAmicusBriefFedAppeals).isValid() ? (
                                                                <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(piDateAmicusBriefFedAppeals)}
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                                </>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                        <Calendar
                                                            defaultView="century"
                                                            onChange={(e: any) => {
                                                                let dateObj = new Date(e)
                                                                let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                                "h-8 w-full justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                                !piDateAmicusBriefUSSupr && "text-muted-foreground"
                                                            )}
                                                            disabled={userRoles.includes("VIEWER")}>
                                                            {piDateAmicusBriefUSSupr && moment(piDateAmicusBriefUSSupr).isValid() ? (
                                                                <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {convertToUTCDate(piDateAmicusBriefUSSupr)}
                                                                </>
                                                            ) : (
                                                                userRoles.includes("VIEWER") ? "-" : <>
                                                                    <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                                </>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                        <Calendar
                                                            defaultView="century"
                                                            onChange={(e: any) => {
                                                                let dateObj = new Date(e)
                                                                let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                            "h-8 w-1/2 justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                            !piDatePetitionToIACHR && "text-muted-foreground"
                                                        )} disabled={userRoles.includes("VIEWER")}>
                                                        {piDatePetitionToIACHR && moment(piDatePetitionToIACHR).isValid() ? (
                                                            <>
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {convertToUTCDate(piDatePetitionToIACHR)}
                                                            </>
                                                        ) : (
                                                            userRoles.includes("VIEWER") ? "-" : <>
                                                                <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                    <Calendar
                                                        defaultView="century"
                                                        onChange={(e: any) => {
                                                            let dateObj = new Date(e);
                                                            let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                            "h-8 w-1/2 justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                            !piDateIACHRPrecaution && "text-muted-foreground"
                                                        )} disabled={userRoles.includes("VIEWER")}>
                                                        {piDateIACHRPrecaution && moment(piDateIACHRPrecaution).isValid() ? (
                                                            <>
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {convertToUTCDate(piDateIACHRPrecaution)}
                                                            </>
                                                        ) : (
                                                            userRoles.includes("VIEWER") ? "-" : <>
                                                                <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                    <Calendar
                                                        defaultView="century"
                                                        onChange={(e: any) => {
                                                            let dateObj = new Date(e)
                                                            let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                                                            "h-8 w-1/2 justify-start text-left text-xs font-normal disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text",
                                                            !piDateIACHRMerits && "text-muted-foreground"
                                                        )} disabled={userRoles.includes("VIEWER")}>
                                                        {piDateIACHRMerits && moment(piDateIACHRMerits).isValid() ? (
                                                            <>
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {convertToUTCDate(piDateIACHRMerits)}
                                                            </>
                                                        ) : (
                                                            userRoles.includes("VIEWER") ? "-" : <>
                                                                <CalendarIcon className="mr-2 h-4 w-4" /><span>Pick a date</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent id="Date" className="text-xs text-black thin-scrollbar m-1 w-[230px] max-h-50 overflow-y-auto p-0">
                                                    <Calendar
                                                        defaultView="century"
                                                        onChange={(e: any) => {
                                                            let dateObj = new Date(e)
                                                            let dateStr = moment(dateObj).format("YYYY-MM-DD");
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
                            <DialogClose className="text-black-700 text-xs" >Discard</DialogClose>
                            {props.hidetext !== "View" && (
                                <Button type="submit" variant="outline" hidden={userRoles.includes("VIEWER")} className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs">
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
