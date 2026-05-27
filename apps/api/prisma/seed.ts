import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // TODO: replace with real quotes array
  console.log('Seed not yet implemented — add quotes to this file')
}

main().finally(() => prisma.$disconnect())
