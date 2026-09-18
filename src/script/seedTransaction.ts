import { prisma } from "@/lib/prisma";

async function main() {
    const user = await prisma.user.findFirst({
        include: {
            accounts: true
        }
    })
    if (!user) {
        throw new Error(
            "No user found. Register a user first"
        )
    }

    const account = user.accounts.find(
        (account) => account.type === "CHECKING"
    )
    if (!account) {
        throw new Error(
            "No checking acount found for this user."
        )
    }

    console.log(
        `Using account: ${account.accountNumber}`
    )
    await prisma.transaction.createMany({
        data: [
            {
                type: "DEPOSIT",
                status: "COMPLETED",
                amount: 50000000,
                currency: "USD",
                description: "initial deposit",
                receiverUserId: user.id,
                receiverAccountId: account.id
            },
            {
                type: "DEPOSIT",
                status: "COMPLETED",
                amount: 2500000,
                currency: "USD",
                description: "Salary payment",
                receiverUserId: user.id,
                receiverAccountId: account.id
            },
            {
                type: "WITHDRAWAL",
                status: "COMPLETED",
                amount: 4500000,
                currency: "USD",
                description: "Salary payment",
                senderUserId: user.id,
                senderAccountId: account.id
            }
        ]
    })

    console.log("Transaction created!")
}

main().catch((error) => {
    console.error("Failed tocreate transactions:", error)
    process.exit(1)
})
    .finally(async () => {
        await prisma.$disconnect()
    })
