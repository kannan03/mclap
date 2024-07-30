import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "../ui/button"

interface Props {
  selectedRows: any[]
  action?: any
}

export function CustomActionToast({ selectedRows, action, ...props }: Props) {
  return (
    <div className="fixed top-0 z-[50] left-1/2 flex max-h-screen w-full flex-col-reverse transform -translate-x-1/2 p-9 mb-10 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      <div className="relative flex w-full items-center justify-between space-x-1 overflow-hidden rounded-md border bg-background  pr-6 text-foreground shadow-lg">
        <div className="grid gap-1">
          {selectedRows?.length > 0 && selectedRows?.length <= 1 && (
            <div className="text-sm opacity-90 pl-4">1 row selected</div>
          )}
          {selectedRows?.length > 1 && (
            <div className="text-sm opacity-90 pl-4">
              {selectedRows?.length} rows selected
            </div>
          )}
        </div>
        <div className="space-x-2">
          {/* {selectedRows?.length > 0 && selectedRows?.length <= 1 && (
            <Button variant="outline" className="h-9">
              Edit
            </Button>
          )}
          <Button variant="outline" className="h-9">
            Delete
          </Button> */}
          {action}
        </div>
      </div>
    </div>
  )
}
