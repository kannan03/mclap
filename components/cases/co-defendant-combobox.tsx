"use client"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons";
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
import { useSearchParams } from "next/navigation"
import Link from "next/link"
interface Props {
    handleChange: (val: any) => void;
    EditData?: any,
    viewMode: boolean,
    disabled?: boolean,
    placholderName: string
}
CoDefendantCombobox.defaultProps = {
    disabled: false,
};
export function CoDefendantCombobox({ handleChange, EditData, viewMode, disabled
    , placholderName }: Props) {
    const [open, setOpen] = React.useState(false)
    const [selectedValues, setSelectedValues] = React.useState<string[]>([])
    const searchParams = useSearchParams();
    const [listData, setListData] = React.useState<any[]>([])
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
    React.useMemo(() => {
        handleChange(selectedValues)
    }, [open, selectedValues])
    const handleSelect = (currentValue: string) => {
        setSelectedValues((prevValues: any) => {
            if (prevValues.includes(currentValue)) {
                // handleChange([...prevValues, currentValue])
                return prevValues.filter((value: any) => value !== currentValue)
            } else {
                // handleChange([...prevValues, currentValue])
                return [...prevValues, currentValue]
            }
        })
    }
    const handleRemove = (valueToRemove: any) => {
        setSelectedValues((prevValues) =>
            prevValues.filter((value) => value !== valueToRemove)
        )
        handleChange(selectedValues)
    }
    const filterConact = async (value: any) => {
        let Url = `${baseURL}/v1/defendants/search?filter=${value}&page=1&limit=20`;
        const response = await axiosInstance.get(Url)
        let listData = response?.data?.data ? response?.data?.data : []
        setListData(listData)
    }
    React.useEffect(() => {
        if (EditData?.length > 0) {
            setSelectedValues(EditData)
        }
    }, [EditData])
    return (
        <Popover open={open} onOpenChange={setOpen}>
                  <div className="flex flex-wrap">
            {selectedValues.length > 0 &&
                selectedValues.map((value : any, i) => {
                    let Id = String(value).split(" - ")[0];

                    if( typeof value === "string"){
                        return (
                            <Badge variant="outline"  className="pl-3 mb-1 pr-0 mr-2 h-6 rounded-md">
                            <span className="pr-2 border-r text-[0.65rem] font-normal">
                            {!viewMode ? (
                                <Link target="_blank" href={`/defendants?defendantId=${Id}`}>{value}</Link>) : <span>{value}</span>}</span>
                                {!viewMode ? <Icons.close className={'w-4 h-3'}
                                    onClick={() => {
                                        handleRemove(value)
                                    }} /> : <></>}    
                            </Badge>
                    )}
                    })
            }
                   </div>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-8 justify-between text-xs disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom"
                    disabled={disabled}
                >
                    {placholderName}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[280px] p-0">
                <Command className="dark:bg-slate-900">
                    <Input
                        type="text"
                        placeholder="Search existing Defendant"
                        id="combobox"
                        className="text-xs h-8"
                        onChange={(e) => {
                            if (e.target.value.length >= 3) {
                                filterConact(e.target.value)
                            }
                        }} />
                    <CommandEmpty>No Defendant found.</CommandEmpty>
                    <CommandGroup className="h-[150px] text-xs thin-scrollbar overflow-y-scroll text-xs dark:bg-slate-900">
                        {listData?.sort()?.map((map_ele: any) => {
                        if(  typeof map_ele === "object"){
                            let names = `${map_ele?.id} - ${map_ele?.defLast ? map_ele.defLast : ''}${map_ele?.defLast ? ', ' : ''}${map_ele?.defFirst ? map_ele.defFirst : ''}`
                            return(
                            <CommandItem
                                className="text-xs"
                                key={map_ele.value}
                                value={map_ele.value}
                                onSelect={() => {
                                    handleSelect(names)
                                }
                                }
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedValues.includes(names) ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {names}
                            </CommandItem>
                        )}
                      })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}