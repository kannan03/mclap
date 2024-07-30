"use client"

import React, { ForwardedRef, forwardRef, useImperativeHandle } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import { Form, useForm } from "react-hook-form"
import * as z from "zod"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { keyDownLengthValidation, keyDownOnlyLetters } from "@/lib/utils"
import { prisonSchema } from "@/lib/validations/lookup/prison"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Icons } from "../icons"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"
import { AddressSelect } from "../utils/states-cities-combobox"

type FormData = z.infer<typeof prisonSchema>
// Import statements
const AddPrisonAlert = forwardRef((props: any, ref: ForwardedRef<unknown>) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(prisonSchema),
  })
  const [isOpen, setIsOpen] = React.useState(false)
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

  useImperativeHandle(ref, () => {
    return {
      click: () => setIsOpen(true),
    }
  })

  const onSubmit = async (payload: any) => {
    if (props.rowdata) {
      try {
        const prisonID = props?.rowdata?.id
        const res = await axiosInstance.patch(
          `${baseURL}/v1/prisons/${prisonID}`,
          payload
        )
        if (res?.status === 500) {
          toast({
            variant: "default",
            description: "Prison Updated Failed",
            style: {
              background: "red",
            },
          })
        } else {
          toast({
            variant: "default",
            description: "Prison Updated Successfully",
            style: {
              background: "#03C03C",
            },
          })
        }
        props.refreshGrid()
        reset()
        setIsOpen(false)
      } catch (error: any) {
        console.log(error.message)
        setIsOpen(false)
      }
    } else {
      try {
        payload.prisonCountry =
          payload.prisonCountry == "" ? "USA" : payload.prisonCountry
        const res = await axiosInstance.post(baseURL + "/v1/prisons", payload)
        if (res?.status === 500) {
          toast({
            variant: "default",
            description: "Prison Created Failed",
            style: {
              background: "red",
            },
          })
        } else {
          toast({
            variant: "default",
            description: "Prison Created Successfully",
            style: {
              background: "#03C03C",
            },
          })
        }
        props.refreshGrid()
        reset()
        setIsOpen(false)
      } catch (error: any) {
        setIsOpen(false)
      }
    }
  }
  const [country, setCountry] = React.useState(
    props?.rowdata ? props?.rowdata?.prisonCountry : "USA"
  )
  const [state, setState] = React.useState("")
  const [city, setCity] = React.useState("")
  const setStateValue = (value: any) => {
    setState(value)
    setValue("prisonState", String(value), { shouldValidate: true })
    setCity("")
  }
  const setCityValue = (value: any) => {
    setCity(value)
    setValue("prisonCity", String(value), { shouldValidate: true })
  }
  React.useEffect(() => {
    reset()
    setCountry("")
    setCity("")
    setState("")
    setValue("prisonCountry", "")
    setValue("prisonCity", "")
    setValue("prisonState", "")
    if (props?.rowdata) {
      if (props?.rowdata.prisonState) {
        setState(props?.rowdata.prisonState)
        setValue("prisonState", props?.rowdata.prisonState)
      }
      if (props?.rowdata.prisonCity) {
        setCity(props?.rowdata.prisonCity)
        setValue("prisonCity", props?.rowdata.prisonCity)
      }
      if (props?.rowdata?.prisonCountry) {
        setCountry(props?.rowdata?.prisonCountry)
        setValue("prisonCountry", props?.rowdata?.prisonCountry)
      }
    }
  }, [isOpen, props?.rowdata, setValue])
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(openValue) => {
        if (props?.text == "Add") {
          if (openValue) {
            setIsOpen(openValue)
          } else {
            const values = getValues()
            let formAllValues = Object.values(values)
            let findFormValue = formAllValues?.find((map_val) => {
              return map_val !== ""
            })
            if (findFormValue) {
              let ConfirmCloseForm = confirm(
                "The data filled in the form will be lost. Do you want to close the form ?"
              )
              if (ConfirmCloseForm) {
                setIsOpen(openValue)
              }
            } else {
              setIsOpen(openValue)
            }
          }
        } else {
          setIsOpen(openValue)
        }
      }}
    >
      <TooltipProvider>
        {props.text === "Add" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={props.disable}
                  className="flex h-8 items-center rounded-lg bg-transparent px-1.5 md:px-3.5 py-1 text-xs xl:py-1.5"
                >
                  {props.icon} <span className="hidden md:block">{props.text}</span>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-zinc-950 dark:bg-zinc-50">
              <p className="text-xs text-slate-50 dark:text-slate-950">
                Create new prison
              </p>
            </TooltipContent>
          </Tooltip>
        )}
        {(props.hidetext === "Edit" ||
          props.hidetext === "View" ||
          props.text === "Edit") && (
          <DialogTrigger asChild>
            <Button
              variant={props.text === "Edit" ? "outline" : "ghost"}
              disabled={props.disable}
              className={
                props.hidetext === "Edit"
                  ? "flex h-8 items-center rounded-l-lg rounded-r-none border-r bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                  : props.hidetext === "View"
                  ? "flex h-8 items-center rounded-none bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
                  : "flex h-8 items-center rounded-lg bg-transparent px-3.5 py-1 text-xs xl:py-1.5"
              }
            >
              {props.icon} {props.text}
            </Button>
          </DialogTrigger>
        )}
      </TooltipProvider>
      <div>
        <DialogContent
          className="fixed z-50 grid  max-h-full max-w-xl overflow-hidden p-0 pt-2 dark:bg-slate-900 xl:w-full"
          onInteractOutside={(e) => {
            if (props?.text == "Add") {
              const values = getValues()
              let formAllValues = Object.values(values)
              let findFormValue = formAllValues?.find((map_val) => {
                return map_val !== ""
              })
              if (findFormValue) {
                e.preventDefault()
                let ConfirmCloseForm = confirm(
                  "The data filled in the form will be lost. Do you want to close the form ?"
                )
                if (ConfirmCloseForm) {
                  setIsOpen(false)
                }
              }
            }
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="border-b border-inherit ">
              <div className="flex justify-between">
                <DialogTitle className="text-black-700 text-l ml-2 p-2 font-bold">
                  {props.text || props.hidetext} Prison
                </DialogTitle>
                <DialogClose />
              </div>
            </DialogHeader>
            <div className="thin-scrollbar h-[calc(100vh-20rem)] max-w-full overflow-y-auto px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-2">
                <div>
                  <Label className="text-[0.7rem] font-semibold text-gray-600">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    maxLength={30}
                    placeholder={props.hidetext === "View" ? "-" : "Name"}
                    disabled={props.hidetext === "View"}
                    defaultValue={props?.rowdata?.prisonName}
                    className="w-60 text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                    {...register("prisonName")}
                  />
                  {errors.prisonName?.message && (
                    <small className="text-red-500">
                      {errors.prisonName.message}
                    </small>
                  )}
                </div>
                <div>
                  <Label className="text-[0.7rem] font-semibold text-gray-600">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={country}
                    onValueChange={(value: any) => {
                      setCountry(value)
                      setValue("prisonCountry", String(value), {
                        shouldValidate: true,
                      })
                      setState("")
                      setCity("")
                    }}
                  >
                    <SelectTrigger
                      className="w-60 md:w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom"
                      disabled={props.hidetext === "View"}
                    >
                      <SelectValue placeholder={props.hidetext === "View" ? "-" : "Select Country"} />
                    </SelectTrigger>
                    <SelectContent
                      defaultValue={""}
                      className="dark:bg-slate-900"
                    >
                      <SelectItem value="" className="text-xs">
                        Select Country
                      </SelectItem>
                      <SelectItem value="USA" className="text-xs">
                        USA
                      </SelectItem>
                      <SelectItem value="Mexico" className="text-xs">
                        Mexico
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="hidden"
                    value={country ? country : ""}
                    {...register("prisonCountry", { required: true })}
                  />
                  {errors?.prisonCountry?.message && (
                    <small className="text-red-500">
                      {errors.prisonCountry.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-2">
                <div>
                  <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      State <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  {/* <Input
                      type="text"
                      maxLength={30}
                      onKeyDown={(event) => keyDownOnlyLetters(event, 2)}
                      defaultValue={props?.rowdata?.conState}
                      {...register("conState")}
                    /> */}
                  <div>
                    <AddressSelect
                      category={
                        country == "Mexico"
                          ? "mexicoStatesAndCities"
                          : "usStatesAndCities"
                      }
                      country={country}
                      placeholdername={props.hidetext === "View" ? "-" : "Select state"}
                      defultselect={state}
                      selectedValue={setStateValue}
                      wPage={180}
                      disabled={!country || props.hidetext === "View"}
                      className={props.hidetext === "View" ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:cursor-text disabled:py-0 select-custom" : "w-60 md:w-[180px]"}
                    />
                    <Input
                      type="hidden"
                      value={country ? country : ""}
                      {...register("prisonState", { required: true })}
                    />
                    {errors?.prisonState?.message && (
                      <small className="text-red-500">
                        {errors.prisonState.message}
                      </small>
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      City <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  {/* <Input
                      type="text"
                      maxLength={30}
                      defaultValue={props?.rowdata?.conCity}
                      {...register("conCity")}
                    /> */}
                  <div>
                    <AddressSelect
                      category={"city"}
                      country={country}
                      state={state}
                      defultselect={city}
                      placeholdername={props.hidetext === "View" ? "-" : "Select city"}
                      selectedValue={setCityValue}
                      wPage={180}
                      disabled={!state || props.hidetext === "View"}
                      className={props.hidetext === "View" ? "disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:cursor-text disabled:py-0 select-custom" : "w-60 md:w-[180px]"}
                      />
                    <Input
                      type="hidden"
                      value={country ? country : ""}
                      {...register("prisonCity", { required: true })}
                    />
                    {errors?.prisonCity?.message && (
                      <small className="text-red-500">
                        {errors?.prisonCity.message}
                      </small>
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    <Label className="text-[0.7rem] font-semibold text-gray-600">
                      Zip Code<span className="text-red-500">*</span>
                    </Label>
                    <div>
                      <Input
                        type="text"
                        title="five numbers required"
                        maxLength={5}
                        placeholder={props.hidetext === "View" ? "-" : "Zip code"}
                        disabled={props.hidetext === "View"}
                        defaultValue={props?.rowdata?.prisonZip}
                        className="w-60 md:w-[175px] text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text"
                        {...register("prisonZip")}
                        onKeyDown={(event) => keyDownLengthValidation(event, 5)}
                      />
                      {errors?.prisonZip?.message && (
                        <small className="text-red-500">
                          {errors?.prisonZip.message}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 p-2 ">
                <div className="">
                  <Label className="text-[0.7rem] font-semibold text-gray-600">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    className="w-full text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text disabled:resize-none"
                    placeholder={props.hidetext === "View" ? "-" : "Address"}
                    disabled={props.hidetext === "View"}
                    defaultValue={props?.rowdata?.prisonAddress}
                    {...register("prisonAddress")}
                  />
                  {errors.prisonAddress?.message && (
                    <small className="text-red-500">
                      {errors.prisonAddress.message}
                    </small>
                  )}
                </div>
              </div>
            </div>
            {props.hidetext !== "View" && (
              <div className="flex justify-end border-t p-2">
                <DialogFooter className="mr-7 gap-2 flex-row">
                  <DialogClose
                    className="text-black-700 text-xs"
                    hidden={props.hidetext === "View"}
                  >
                    Discard
                  </DialogClose>
                  <Button
                    type="submit"
                    variant="outline"
                    className="flex h-8 items-center rounded-lg bg-transparent px-5 py-1 text-xs xl:py-1.5"
                  >
                    <Icons.save className="mr-0.5 h-4 w-4" /> Save
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
AddPrisonAlert.displayName = 'AddPrisonAlert'
export default AddPrisonAlert;
