const {PrismaClient} = require("@prisma/client")
const data = require("../assets/mock-data.json")
const prisma = new PrismaClient()

async function main() {
  const clerkId = "user_2oHTnwL6x3tThvUT6zDDAG79nww"

  const jobs = data.map((job) => {
    return {
      ...job,
      clerkId,
    }
  })

  //   console.log(jobs)

  for (const job of jobs) {
    await prisma.job.create({
      data: job,
    })
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
