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

interface ComboDataType {
  id: number,
  codeType: string,
  codeCode: string
}

interface Props {
  ListData: ComboDataType[],
  handleChange: (val: any) => void;
  EditData?: any,
  viewMode: boolean,
  disabled?: boolean,
  placholderName:string

}

CrimeTypeCombobox.defaultProps = {
  disabled: false,
};

export function CrimeTypeCombobox({ ListData, handleChange, EditData, viewMode, disabled
,placholderName}: Props) {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>([])

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

  React.useEffect(() => {
    if (EditData?.length > 0) {
      setSelectedValues(EditData)
    }
  }, [EditData])
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-wrap">
      {selectedValues.length > 0 &&
        selectedValues.map((value, i) => (
            <Badge key={value} variant="outline"  className="pl-3 mb-1 pr-0 mr-2 h-6 whitespace-nowrap rounded-md">
              <span className="pr-2 border-r text-[0.65rem] font-normal"> {ListData.find((map_ele: any) => map_ele.codeCode === value)?.codeCode} </span>
              {!viewMode ? <Icons.close className={'ml-1 mr-1 h-3 w-3 cursor-pointer'}
                onClick={() => {
                  handleRemove(value)
                }} /> : <></>}
            </Badge>
        ))
      }
       </div>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-8 justify-between text-xs disabled:border-0 disabled:px-0 disabled:cursor-text disabled:opacity-100 disabled:py-0 select-custom"
          disabled={disabled}
        >
          {placholderName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[350px] p-0">
        <Command className="dark:bg-slate-900">
          <CommandInput placeholder="Search Crime Type" className="h-8 text-xs" />
          <CommandEmpty>No CrimeType found.</CommandEmpty>
          <CommandGroup className="h-[150px] text-xs thin-scrollbar overflow-y-scroll text-xs dark:bg-slate-900">
            {ListData?.sort()?.map((map_ele: any) => (
              map_ele.codeCode ? (
              <CommandItem
                className="text-xs"
                key={map_ele.value}
                value={map_ele.value}
                onSelect={() => {
                  handleSelect(map_ele.codeCode)
                }
                }
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValues.includes(map_ele?.codeCode) ? "opacity-100" : "opacity-0"
                  )}
                />
                {map_ele.codeCode}
              </CommandItem>
              ) : null
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
