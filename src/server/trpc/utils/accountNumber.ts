import type { PrismaClient } from "@/generated/prisma/client";

export async function generateAccountNumber(prisma: PrismaClient){
    while (true) {
        const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString()

        const existing = await prisma.account.findUnique({
            where: {
                accountNumber
            }
        })
        if(!existing) {
            return accountNumber
        }
    }
}