export const HomeSkeletonCard = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col space-y-4">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 max-w-full items-center justify-between py-4">
            <div className="h-6 w-11/12 rounded-md bg-gray-300 ">
              <div className="h-6 w-9/12 rounded-md bg-gray-300 "></div>
            </div>
            <div className="ml-auto mr-5 h-6 w-6"></div>
          </div>
        </header>
        <div className="container grid max-w-full flex-1 gap-4 md:grid-cols-[200px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex">
            <div className="mb-2 h-6 w-9/12 rounded-md bg-gray-300"></div>
            <div className="mb-2 h-6 w-9/12 rounded-md bg-gray-300"></div>
            <div className="mb-2 h-6 w-9/12 rounded-md bg-gray-300"></div>
            <div className="mb-2 h-6 w-9/12 rounded-md bg-gray-300"></div>
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
            <div className="flex w-full flex-1 flex-col px-5">
              <div className="mt-12 w-1/2 animate-pulse flex-row items-center justify-center space-x-1 rounded-xl border p-6 ">
                <div className="flex flex-col space-y-2">
                  <div className="h-6 w-11/12 rounded-md bg-gray-300 "></div>
                  <div className="h-6 w-10/12 rounded-md bg-gray-300 "></div>
                  <div className="h-6 w-9/12 rounded-md bg-gray-300 "></div>
                  <div className="h-6 w-9/12 rounded-md bg-gray-300 "></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
