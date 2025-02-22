"use client"

import {Input} from "./ui/input"
import {usePathname, useRouter, useSearchParams} from "next/navigation"
import {Button} from "./ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {JobStatus} from "@/utils/types"

function SearchForm() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // name trong get phải trùng với tên được set trong URLSearchParams() bên dưới
  const search = searchParams.get("search") || ""
  const jobStatus = searchParams.get("jobStatus") || "all"

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const search = formData.get("search") as string
    const jobStatus = formData.get("jobStatus") as string

    // console.log(search, jobStatus)

    // (Gán search và jobStatus từ form lên url)
    let params = new URLSearchParams()
    params.set("search", search)
    params.set("jobStatus", jobStatus)

    //( navigate lại same page nhưng url có thề điểu kiện search)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form
      className="bg-muted mb-16 p-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-lg"
      onSubmit={handleSubmit}
    >
      <Input
        type="text"
        placeholder="search jobs..."
        name="search"
        defaultValue={search}
      />
      <Select name="jobStatus" defaultValue={jobStatus}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {/* // trong type JobStatus không có all, nên phải thêm all vào truoc khi map */}
          {["all", ...Object.values(JobStatus)].map((jobStatus) => {
            return (
              <SelectItem key={jobStatus} value={jobStatus}>
                {jobStatus}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      <Button type="submit" className="self-end">
        Search
      </Button>
    </form>
  )
}

export default SearchForm
