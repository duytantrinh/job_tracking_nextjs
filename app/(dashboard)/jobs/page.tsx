import JobsList from "@/components/JobsList"
import SearchForm from "@/components/SearchForm"
import {getAllJobsAction} from "@/utils/actions"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query"
import React from "react"

async function JobsPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["jobs", "", "all", 1],
    queryFn: () => getAllJobsAction({}),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchForm />
      <JobsList />
    </HydrationBoundary>
  )
}

export default JobsPage
