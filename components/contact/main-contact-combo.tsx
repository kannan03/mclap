"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "../ui/input"
import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"


interface FilterDataType {
    id: string,
    codeType: string,
    conFirst: string,
    conLast:string,
    conMiddle:string,
    conType : any,
    conOrg : any,
}
interface Props{
    getFilterId :(val: any) => void;
    comboboxDisable:boolean;
}

export function ContactListCombobox({getFilterId,comboboxDisable}:Props) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [frameworks, setFrameworks] = React.useState<FilterDataType[]>([])

    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

    const filterConact = async (value: any) => {        
        let Url = `${baseURL}/v1/contacts?filter=${value}&link_existing_contact=true`;
        const response = await axiosInstance.get(Url)
        let listData = response?.data?.data?.rows;
        setFrameworks(listData)
    }

    React.useEffect( ()=>{
        setFrameworks([])
        getFilterId("")
    }, [])
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={comboboxDisable}
                    className="h-8 w-[250px] justify-between mr-1 whitespace-nowrap font-normal text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom">       
                    {value
                        ? value
                        : "Link existing contact"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[480px] p-0">
                <Command className="dark:bg-slate-900 text-xs">
                    <Input
                        type="text"
                        placeholder="Search existing contact"
                        id="combobox"
                        className="text-xs h-8"
                        onChange={(e) => {
                            if (e.target.value.length >= 3) {
                                filterConact(e.target.value)
                            }
                        }} />
                    <CommandEmpty>No contact found.</CommandEmpty>
                    <CommandGroup className="h-[120px] text-xs thin-scrollbar overflow-y-scroll text-xs dark:bg-slate-900">
                        {frameworks && frameworks?.length > 0 && frameworks?.map((framework) => (
                            <CommandItem
                                key={framework?.id}
                                value={framework?.id}
                                onSelect={(currentValue) => {
                                    setValue(`${framework?.conLast},${framework?.conFirst}`)
                                    getFilterId(framework?.id)
                                    setOpen(false)
                                }}
                                className="text-xs"
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === framework?.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {framework?.conLast},{framework?.conFirst} {framework?.conType ? ` - ${framework?.conType}` : ''} {framework?.conOrg ? ` - ${framework?.conOrg}` : ''} 
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
