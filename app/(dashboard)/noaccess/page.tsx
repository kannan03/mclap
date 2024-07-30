import { Icons } from "@/components/icons"

export default function NoAccess() {
  return(
    <div className="mt-6 flex items-center justify-center">
      <Icons.warning className="h-6 w-4 xl:w-8" />
      <h1>You do not have access for this page</h1>
    </div>

  )
}
