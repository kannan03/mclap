"use client"
import React from 'react'
import { useRouter, useSearchParams,redirect,usePathname  } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"

export default function DefendantSearchDialog() {
    const router = useRouter()
    const path = usePathname();

    const [isOpen, setIsOpen] = React.useState<any>(false);
    const [listData, setListData] = React.useState<any[]>([])
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

    const filterConact = async (value: any) => {
        let Url = `${baseURL}/v1/defendants/search?filter=${value}&page=1&limit=20`;
        const response = await axiosInstance.get(Url)
        let listData = response?.data?.data ? response?.data?.data : []
        setListData(listData)
    }
    const handleSelect = (value: any) => {
        if(path == '/defendants'){
            window.location.href = `defendants?defendantId=${value}`
        }else{
            router.push(`/defendants?defendantId=${value}`)
        }
       }

    React.useEffect(() => {
        if (!isOpen) {
            setListData([])
        }
    }, [isOpen])
    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger>
                    <div className="relative mt-2">
                        <Input className="bg-white-400 pl-7 text-xs" placeholder="Search Defendant" />
                        <Icons.search className="absolute top-0 ml-2.5  h-8 w-4 text-muted-foreground" />
                    </div></DialogTrigger>
                <DialogContent className='rounded-lg border shadow-md dark:bg-slate-900 py-2 p-1.5 w-[400px] h-64'>
                    <Command className='dark:bg-slate-900 py-1'>
                        <DialogHeader className="border-b border-inherit">
                            <div className="flex items-center px-3 ">
                                <Icons.search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                <Input
                                    type="text"
                                    placeholder="Search Defendant"
                                    id="combobox"
                                    className="flex h-8 w-full rounded-md border-none bg-transparent py-3 text-xs outline-none placeholder:bg-transparent placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            filterConact(e.target.value)

                                        }
                                    }} />
                            </div>
                        </DialogHeader>
                        <CommandGroup className="thin-scrollbar h-[250px] overflow-y-auto text-xs">
                            {listData?.sort()?.map((map_ele: any) => {
                                if (typeof map_ele === "object") {
                                    let names = `${map_ele?.id} - ${map_ele?.defLast ? map_ele.defLast : ''}${map_ele?.defFirst ? ', ' + map_ele.defFirst : ''}${map_ele?.defMiddle ? ' ' + map_ele.defMiddle : ''}`;
                                    return (
                                        <CommandItem
                                            className="text-xs"
                                            key={map_ele.value}
                                            value={map_ele.value}
                                            onSelect={() => {
                                                handleSelect(map_ele?.id)
                                                setIsOpen(false)
                                                setListData([])
                                            }}>
                                            {names}
                                        </CommandItem>
                                    )
                                }
                            })}
                        </CommandGroup>
                    </Command>

                </DialogContent>
            </Dialog>

        </div>
    )
}
