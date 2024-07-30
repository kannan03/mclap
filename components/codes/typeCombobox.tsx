"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronsUpDown } from "lucide-react"
import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
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

interface StateType {
  codeType: string,
}

interface Props {
  handleChange: (p: { codeType: string | null }) => void;
  editValue: string
  onCreate?: (value: string) => void;
  disabled?: boolean

}

ComboboxDemo.defaultProps = {
  disabled: false,
};


export function ComboboxDemo({ handleChange, editValue, onCreate, disabled }: Props) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [query, setQuery] = React.useState<string>('');
  const [frameworks, setFramework] = React.useState<StateType[] | null>([]);

  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

  const typedata = async() => {
    // const typeLs: any = sessionStorage.getItem('CodeTypeData')
    // const typePares = JSON.parse(typeLs)

    const response = await axiosInstance.get(
      baseURL + "/v1/codes/codeType"
    )
    const stateValue = response?.data?.data
    console.log(stateValue)
    // setFramework(typePares)
    setFramework([{id:'' , codeType:'Select Type'}, ...stateValue])

    if (editValue) {
      const typeValue = stateValue?.find((option: any) => option.codeType == editValue)?.codeType
      setValue(typeValue);
    }
  }
  React.useEffect(() => {
    typedata()
  }, [query]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={"w-full h-8 text-xs mt-0 justify-between disabled:border-0 disabled:px-0 disabled:opacity-100 disabled:py-0 disabled:cursor-text select-custom" + (value == '' ? 'text-xs text-gray-500' : '')}
          disabled={disabled}
        >
          <span className={ "text-xs" }>
           {value ? value : "Select Type"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command className="dark:bg-slate-900">
          <CommandInput
            placeholder="Search type"
            className="h-8 text-xs"
            value={query}
            onValueChange={(value: string) => { setQuery(value) }}
          />

          <CommandEmpty
            onClick={() => {
              if (onCreate) {
                setValue(query)
                handleChange({ codeType: query })
                onCreate(query);
                setQuery('');

              }
            }}
            className='flex cursor-pointer text-xs items-center justify-center gap-1 italic'
          >
            <p className="pr-2">Create: </p>
            <p className='block max-w-48 truncate font-normal text-primary'>
              {query}
            </p>
          </CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-36 w-52 rounded-md border text-gray-500">
              {frameworks?.map((framework, index) => (
                <CommandItem
                  key={index}
                  value={framework.codeType}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : framework.codeType)
                    handleChange(framework)
                    setOpen(false)
                  }}
                  className="text-xs"
                >
                  {framework.codeType}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === framework.codeType ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
