import { PrismaClient } from '@prisma/client'
import { parseArgs } from 'node:util'
import { seedDev } from './seed-dev';



const prisma = new PrismaClient()

async function main() {

  seedDev();

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
