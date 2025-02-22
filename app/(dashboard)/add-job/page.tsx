import CreateJobForm from "@/components/CreateJobForm"
import React from "react"
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query"

function AddJobPage() {
  const queryClient = new QueryClient()
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateJobForm />
    </HydrationBoundary>
  )
}

export default AddJobPage
