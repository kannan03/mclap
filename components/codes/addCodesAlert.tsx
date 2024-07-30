"use client"

import React, { ForwardedRef, forwardRef, useImperativeHandle } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import { Plus, X } from "lucide-react"
import { Controller, Form, useForm } from "react-hook-form"
import * as z from "zod"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"

import {
    codeAuthSchema,
    updateOrganizationAuthSchema,
    updateOrganizationInfoAuthSchema,
} from "@/lib/validations/codes"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
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

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"
import { ComboboxDemo } from "./typeCombobox"
import { Icons } from "../icons"

type FormData = z.infer<typeof codeAuthSchema>

interface OrganizationType {
    id: number
    orgTypeName: string
}

interface StateType {
    id: number
    stateName: string
    stateCode: string
}

const AddCodesAlert = forwardRef((props: any, ref:ForwardedRef<unknown>) => {
    const [selectedOrganizationType, setSelectedOrganizationType] = React.useState<OrganizationType | null>(null)
    const [organizationTypeData, setOrganizationTypeData] = React.useState<OrganizationType[]>([])
    const [fieldError, setFieldError] = React.useState<string | null>(null)
    const [stateData, setStateData] = React.useState<StateType[]>([])
    const [selectCodeType, setselectCodeType] = React.useState<String | null>(null)
    const [isOpen, setIsOpen] = React.useState(false)
    const [action, setAction] = React.useState('')
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

    useImperativeHandle(ref, () => {
        return {
          click : () => setIsOpen(true)
        }
      })

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        control,
        reset,
        getValues,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(codeAuthSchema),
    })



    const onSubmit = async (payload: any) => {
        const { emailConfirmed, accessFailedCount, ...updatePayload } = payload
        const { active, ...rest } = updatePayload
        if (props.rowdata) {

            // CODES UPDATE
            let updateId = props.rowdata.id
            const res = await axiosInstance.patch(
                `${baseURL}/v1/codes/${updateId}`,
                updatePayload
            )
            if (res.status == 200) {
                toast({
                    variant: "default",
                    description: "Codes Updated Successfully",
                    style: {
                        background: "#03C03C",
                    },
                })
                setFieldError(null)
                reset()
                props.refreshGrid()
                setIsOpen(false)
            } else {
                toast({
                    variant: "destructive",
                    description: `Codes Updating Failed: ${res.data.message || "Unknown error"}`,
                })
            }
        } else {
            try {
                const res = await axiosInstance.post(
                    baseURL + "/v1/codes/",
                    payload)
                if (res.status == 201) {
                    toast({
                        variant: "default",
                        description: "Code Created Successfully",
                        style: {
                            background: "#03C03C",
                        },
                    })
                    reset()
                    props.refreshGrid()
                    setIsOpen(false)
                } else {
                    toast({
                        variant: "destructive",
                        description: `Code Creation Failed: ${res.data.message || "Unknown error"
                            }`,
                    })
                }
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    description: `Error creating Codes: ${error.message || "Unknown error"
                        }`,
                })
                setIsOpen(false)
            }
        }
    }

    React.useEffect(() => {
        const organizationTypeDataLS = sessionStorage.getItem("Orgstype")
        const stateLs = sessionStorage.getItem("stateValueData")

        if (organizationTypeDataLS && stateLs) {
            try {
                const parsedData = JSON.parse(organizationTypeDataLS)
                setOrganizationTypeData(parsedData)
                const statePares = JSON.parse(stateLs)
                setStateData(statePares)
            } catch (error) {
                console.error("Error parsing data from sessionStorage:", error)
            }
        }
        setSelectedOrganizationType(null)
        reset()
    }, [isOpen, reset])

    function handleChangeOfSelectedValue(option: { codeType: String | null }) {
        // setselectCodeType(option?.stateCode)
        setValue("codeType", String(option?.codeType), { shouldValidate: true })
    }
    const [newType, setNewType] = React.useState('')
    const handleCreateOptions = async (val: any) => {
        setNewType(val)
    }
    // to handle edit scenario
    React.useEffect(() => {
        CodesTypeData()
        if (props.rowdata) {
            reset()

            setselectCodeType(props.rowdata?.codeType)
            setValue("codeType", props.rowdata?.codeType)


        }
    }, [isOpen, organizationTypeData, props.rowdata, reset, setValue])



    // try
    const [frameworks, setFramework] = React.useState<StateType[] | null>([]);
    // const typeLs: any = sessionStorage.getItem('CodeTypeData')
    // const typePares = JSON.parse(typeLs)
    const CodesTypeData = async () => {
        const response = await axiosInstance.get(
            baseURL + "/v1/codes/codeType"
        )
        const typeData = response?.data?.data
        setFramework(typeData)
    }
    return (
        <Dialog open={isOpen} onOpenChange={(openValue) => {
            if (props?.text == "Add") {
                if (openValue) {
                    setIsOpen(openValue);
                } else {
                    const values = getValues();
                    let formAllValues = Object.values(values);
                    let findFormValue = formAllValues?.find((map_val) => {
                        return map_val !== '';
                    });
                    if (findFormValue) {
                        let ConfirmCloseForm = confirm("The data filled in the form will be lost. Do you want to close the form ?");
                        if (ConfirmCloseForm) {
                            setIsOpen(openValue);
                        }
                    } else {
                        setIsOpen(openValue);
                    }
                }
            } else {
                setIsOpen(openValue);
            }
        }}>
            <TooltipProvider>
            {props.text === "Add" && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                disabled={props.disable}
                                className="flex items-center rounded-lg bg-transparent h-8 px-1.5 md:px-3.5 py-1 xl:py-1.5 text-xs"
                            >
                                {props.icon} <span className="hidden md:block">{props.text}</span>
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side='top'
                        className="bg-zinc-950 dark:bg-zinc-50">
                            <p className="text-xs text-slate-50 dark:text-slate-950">Create new codes </p>
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
                  ? 'flex h-8 items-center rounded-l-lg border-r rounded-r-none bg-transparent px-3.5 py-1 text-xs xl:py-1.5'
                  : props.hidetext === "View"
                  ? 'flex h-8 items-center rounded-none bg-transparent px-3.5 py-1 text-xs xl:py-1.5'
                  : 'flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5'
              }                        >
                            {props.icon} <span className="hidden md:block">{props.text}</span>
                        </Button>
                    </DialogTrigger>
                )}
            </TooltipProvider>

            <div>
                <DialogContent className="fixed z-50 grid max-h-full w-full max-w-xl overflow-hidden dark:bg-slate-900 p-0 pt-2"
                    onInteractOutside={(e) => {
                        if (props?.text == "Add") {
                            const values = getValues();
                            let formAllValues = Object.values(values);
                            let findFormValue = formAllValues?.find((map_val) => {
                                return map_val !== '';
                            });
                            if (findFormValue) {
                                e.preventDefault();
                                let ConfirmCloseForm = confirm("The data filled in the form will be lost. Do you want to close the form ?");
                                if (ConfirmCloseForm) {
                                    setIsOpen(false);
                                }
                            }
                        }
                    }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader className="border-b border-inherit ">
                            <div className="flex justify-between ">
                                <DialogTitle className="p-2 text-l ml-2 font-bold text-black-700">
                                    {props.text} Codes
                                </DialogTitle>
                                <DialogClose />
                            </div>
                            {/* <hr color="green" style={{ height: "5px" }} className="bg-green-600 text-2xl font-bold" /> */}
                            {/* <br /> */}

                        </DialogHeader>
                        <div className="max-h-[calc(100vh-21rem)] thin-scrollbar max-w-full overflow-y-auto px-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex-row p-2">
                                    <div >
                                        <Label className="text-[0.7rem] font-semibold text-gray-600" htmlFor="orgType">Type<span className="text-red-500"> *</span></Label>
                                    </div>
                                    <div className="">
                                        <ComboboxDemo
                                            handleChange={handleChangeOfSelectedValue}
                                            editValue={props.rowdata?.codeType}
                                            onCreate={(value) => {
                                                handleCreateOptions(value);
                                            }}
                                            disabled={props.hidetext === "View"}
                                        />
                                        <Input
                                            type="hidden"
                                            value={selectCodeType ? String(selectCodeType) : ""}
                                            {...register("codeType", { required: true })}
                                        />
                                        {errors.codeType?.message && (
                                            <small className="text-red-500">
                                                {errors.codeType.message}
                                            </small>
                                        )}
                                    </div>
                                </div>
                                <div className="p-2">
                                    <Label className="text-[0.7rem] font-semibold text-gray-600">Code
                                        <span className="text-red-500"> *</span></Label>
                                    <Input
                                        type="text"
                                        className="w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                                        disabled={props.hidetext === "View"}
                                        placeholder={props.hidetext === "View" ? "-" : "Code"}
                                        defaultValue={props?.rowdata?.codeCode}
                                        {...register("codeCode")}
                                    />
                                    {errors.codeCode?.message && (
                                        <small className="text-red-500">
                                            {errors.codeCode.message}
                                        </small>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 p-2 ">

                                <Label className="text-[0.7rem] font-semibold text-gray-600">
                                    Code Description
                                    <span className="text-red-500"> *</span>
                                </Label>
                                <Textarea
                                    className="w-full text-xs h-[120px] disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none"
                                    disabled={props.hidetext === "View"}
                                    placeholder={props.hidetext === "View" ? "-" : "Type here..."}
                                    defaultValue={props?.rowdata?.codeDesc}
                                    {...register("codeDesc")}
                                />
                                {errors.codeDesc?.message && (
                                    <small className="text-red-500">
                                        {errors.codeDesc.message}
                                    </small>
                                )}

                            </div>


                            </div>
                            {props.hidetext !== "View" && (
                            <div className="border-t  my-3 mb-1 flex justify-end p-2">
                                <DialogFooter className="gap-2 mr-7 flex-row">
                                    <DialogClose  hidden={props.hidetext === "View"} className="text-black-600 text-xs ">
                                        Discard
                                    </DialogClose>
                                    <Button
                                        type="submit" variant="outline"
                                        className="flex items-center rounded-lg bg-transparent h-8 px-5 py-1 xl:py-1.5 text-xs"

                                    >
                                     <Icons.save className="w-4 h-4 mr-0.5" /> Save
                                    </Button>
                                </DialogFooter>
                            </div>
                             )}

                    </form>
                </DialogContent>
            </div>
        </Dialog>
    )
})
AddCodesAlert.displayName = 'AddCodesAlert'
export default AddCodesAlert;
