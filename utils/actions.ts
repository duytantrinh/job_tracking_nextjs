"use server"

import prisma from "./db"
import {auth} from "@clerk/nextjs"
import {JobType, CreateAndEditJobType, createAndEditJobSchema} from "./types"
import {redirect} from "next/navigation"
import {Prisma} from "@prisma/client"
import dayjs from "dayjs"

function authenticateAndRedirect(): string {
  const {userId} = auth()

  // console.log("userId", userId)

  if (!userId) {
    redirect("/")
  }
  return userId
}

// {async function => type là 1 Promise}
export async function createJobAction(
  values: CreateAndEditJobType
): Promise<JobType | null> {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  const userId = authenticateAndRedirect()
  try {
    createAndEditJobSchema.parse(values)
    const job: JobType = await prisma.job.create({
      data: {
        ...values,

        clerkId: userId,
      },
    })
    return job
  } catch (error) {
    console.error(error)
    return null
  }
}

type GetAllJobsActionTypes = {
  search?: string
  jobStatus?: string
  page?: number
  limit?: number
}
export async function getAllJobsAction({
  search,
  jobStatus,
  page = 1,
  limit = 2,
}: GetAllJobsActionTypes): Promise<{
  jobs: JobType[]
  count: number
  page: number
  totalPages: number
}> {
  const userId = authenticateAndRedirect()

  try {
    let whereClause: Prisma.JobWhereInput = {
      clerkId: userId,
    }

    if (search) {
      whereClause = {
        ...whereClause, // ...whereClause =  clerkId: userId,
        // (https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting)
        OR: [
          {
            position: {
              contains: search,
            },
          },
          {
            company: {
              contains: search,
            },
          },
        ],
      }
    }

    if (jobStatus && jobStatus !== "all") {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      }
    }

    const skip = (page - 1) * limit
    // page = 1 => no skip job
    // page = 2 => skip = 10 first job
    // page = 3 => skip = 20 first job

    const jobs: JobType[] = await prisma.job.findMany({
      where: whereClause,
      // for pagination
      take: limit,
      skip,

      orderBy: {
        createdAt: "desc",
      },
    })

    // find how many job return with whereClause
    const count: number = await prisma.job.count({
      where: whereClause,
    })

    const totalPages = Math.ceil(count / limit)

    // console.log(jobs)

    return {jobs, count, page, totalPages}
  } catch (error) {
    console.error(error)
    return {jobs: [], count: 0, page: 1, totalPages: 0}
  }
}

export async function deleteJobAction(id: string): Promise<JobType | null> {
  const userId = authenticateAndRedirect()

  try {
    const job: JobType = await prisma.job.delete({
      where: {
        id,

        clerkId: userId,
      },
    })
    return job
  } catch (error) {
    return null
  }
}

export async function getSingleJobAction(id: string): Promise<JobType | null> {
  let job: JobType | null = null
  const userId = authenticateAndRedirect()

  try {
    job = await prisma.job.findUnique({
      where: {
        id,

        clerkId: userId,
      },
    })
  } catch (error) {
    job = null
  }
  if (!job) {
    redirect("/jobs")
  }
  return job
}

export async function updateJobAction(
  id: string,
  values: CreateAndEditJobType
): Promise<JobType | null> {
  const userId = authenticateAndRedirect()

  try {
    const job: JobType = await prisma.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: {
        ...values,
      },
    })
    return job
  } catch (error) {
    return null
  }
}

//===========  Stats
export async function getStatsAction(): Promise<{
  pending: number
  interview: number
  declined: number
}> {
  const userId = authenticateAndRedirect()
  // just to show Skeleton
  // await new Promise((resolve) => setTimeout(resolve, 5000))
  try {
    const stats = await prisma.job.groupBy({
      // groupby
      by: ["status"],
      // count status theo groupby
      _count: {
        status: true,
      },
      where: {
        clerkId: userId, // replace userId with the actual clerkId
      },
    })

    // console.log(stats) //  { _count: { status: 32 }, status: 'declined' },

    const statsObject = stats.reduce((acc, cur) => {
      const {
        status,
        _count: {status: count},
      } = cur

      // console.log(status, count, acc)

      acc[status] = count

      return acc
    }, {} as Record<string, number>)

    // set up default incase no jobs
    const defaultStats = {
      pending: 0,
      declined: 0,
      interview: 0,
      ...statsObject,
    }
    return defaultStats
  } catch (error) {
    redirect("/jobs")
  }
}

// ========= show stats to Charts
export async function getChartsDataAction(): Promise<
  Array<{date: string; count: number}>
> {
  const userId = authenticateAndRedirect()
  const yearAgo = dayjs().subtract(12, "month").toDate()

  // console.log(yearAgo) // 2024-08-22T17:05:57.527Z

  try {
    const jobs = await prisma.job.findMany({
      where: {
        clerkId: userId,
        createdAt: {
          gte: yearAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    let applicationsPerMonth = jobs.reduce((acc, job) => {
      // get month year from createdAt
      const date = dayjs(job.createdAt).format("MMM YY")

      const existingEntry = acc.find((entry) => entry.date === date)

      if (existingEntry) {
        existingEntry.count += 1
      } else {
        acc.push({date, count: 1})
      }

      return acc
    }, [] as Array<{date: string; count: number}>)

    console.log(applicationsPerMonth)

    return applicationsPerMonth
  } catch (error) {
    redirect("/jobs")
  }
}
