"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"

import {Button} from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import {
  JobMode,
  JobStatus,
  createAndEditJobSchema,
  CreateAndEditJobType,
} from "@/utils/types"

import {CustomFormField, CustomFormSelect} from "@/components/FormComponents"

import {useMutation, useQueryClient} from "@tanstack/react-query"
import {createJobAction} from "@/utils/actions"
import {useToast} from "@/components/ui/use-toast"
import {useRouter} from "next/navigation"

function CreateJobForm() {
  //( 1. react-hook-form(RHF): Define your form.)
  const form = useForm<CreateAndEditJobType>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: "",
      company: "",
      location: "",
      status: JobStatus.Pending,
      mode: JobMode.FullTime,
    },
  })

  const queryClient = useQueryClient()
  const {toast} = useToast()
  const router = useRouter()
  const {mutate, isPending} = useMutation({
    mutationFn: (values: CreateAndEditJobType) => createJobAction(values),
    onSuccess: (data) => {
      if (!data) {
        toast({description: "there was an errror"})
        return
      }
      toast({description: "job created"})

      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      })

      queryClient.invalidateQueries({
        queryKey: ["stats"],
      })

      queryClient.invalidateQueries({
        queryKey: ["charts"],
      })

      router.push("/jobs")

      // reset input data
      form.reset()
    },
  })

  //( 2.mutate handle data)
  function onSubmit(values: CreateAndEditJobType) {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">add job</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          {/* position field */}
          <CustomFormField name="position" control={form.control} />

          {/* company field */}
          <CustomFormField name="company" control={form.control} />

          {/* location field */}
          <CustomFormField name="location" control={form.control} />

          {/* jobstatus field */}
          <CustomFormSelect
            name="status"
            control={form.control}
            items={Object.values(JobStatus)}
            labelText="job status"
          />

          {/* jobmode field */}
          <CustomFormSelect
            name="mode"
            control={form.control}
            items={Object.values(JobMode)}
            labelText="job mode"
          />

          <Button type="submit" className="self-end" disabled={isPending}>
            {isPending ? "loading" : "Create job"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
export default CreateJobForm
