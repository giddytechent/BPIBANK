"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Building2, Check, LockKeyhole, Send, ShieldCheck, WalletCards } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc"
import { queryClient } from "@/trpc/query-client"

export function TransferForm() {
    const trpc = useTRPC()

    const [senderAccountId, setSenderAccounId] = useState("")
    const [bankName, setBankName] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [pin, setPin] = useState("")
    const [message, setMessage] = useState("")

    const accountsQuery = useQuery(
        trpc.account.getMyAccounts.queryOptions()
    )
    const recipientQuery = useQuery(
        trpc.account.lookupRecipient.queryOptions(
            {
                accountRouter: accountNumber,
            },
            {
                enabled: /^\d{10}$/.test(accountNumber),
            }
        )
    )
    const transferMutation = useMutation(
        trpc.account.transfer.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: trpc.account.getMyAccounts.queryKey()
                })
                await queryClient.invalidateQueries({
                    queryKey: trpc.account.getMyTransactions.queryKey()
                })

                setMessage("Transfer completed successfully.")
                setAmount("")
                setDescription("")
                setPin("")
            }
        })
    )
    useEffect(() => {
        setMessage("")
    }, [accountNumber])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage("")

        if (!senderAccountId) {
            setMessage("Select a sender account.")
            return
        }

        const transferAmount = Number(amount)

        if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
            setMessage("Enter a valid amount.")
            return
        }

        const amountInCents = Math.round(transferAmount * 100)

        try {
            await transferMutation.mutateAsync({
                senderAccountId,
                recipientBankName: bankName,
                recipientAccountNumber: accountNumber,
                amount: amountInCents,
                transactionPin: pin,
                description: description || undefined,
            })
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Transfer failed.")
        }
    }

    if (accountsQuery.isLoading) {
        return <p>Loading accounts...</p>
    }

    if (accountsQuery.isError) {
        return <p className="text-red-400">Failed to load your accounts.</p>
    }

        const selectedAccount = accountsQuery.data?.find((account) => account.id === senderAccountId)
        const formattedAmount = Number(amount) > 0
            ? Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : "0.00"
            const formattedTotal = Number(amount) > 0
                ? (Number(amount) + 10).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : "10.00"

        return (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
                <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/4 p-5 shadow-2xl shadow-black/10 sm:p-8">
                    <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                            <Send size={20} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-white">Transfer details</h2>
                            <p className="mt-1 text-xs text-slate-500">Complete the details below to continue</p>
                        </div>
                    </div>

                    <div className="space-y-7">
                        <TransferSection number="01" title="Choose a source">
                            <label htmlFor="sender-account" className="sr-only">From account</label>
                            <div className="relative">
                                <WalletCards className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <select id="sender-account" value={senderAccountId} onChange={(e) => setSenderAccounId(e.target.value)} className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-950 py-4 pl-12 pr-4 text-sm text-white outline-none transition focus:border-blue-400">
                                    <option value="">Select the account to send from</option>
                                    {accountsQuery.data?.map((account) => (
                                        <option key={account.id} value={account.id}>{account.type} · {account.accountNumber}</option>
                                    ))}
                                </select>
                            </div>
                        </TransferSection>

                        <TransferSection number="02" title="Find the recipient">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="relative">
                                    <Building2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input aria-label="Recipient bank" type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Recipient bank" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 pl-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400" />
                                </div>
                                <div className="relative">
                                    <input aria-label="Recipient account number" type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))} maxLength={10} inputMode="numeric" placeholder="10-digit account" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400" />
                                    {recipientQuery.isFetching && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-blue-300">Finding...</span>}
                                </div>
                            </div>

                            {recipientQuery.data && (
                                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/6 p-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"><Check size={17} /></div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white">{recipientQuery.data.name ?? "Verified recipient"}</p>
                                        <p className="mt-1 text-xs text-emerald-300/70">{recipientQuery.data.accountNumber} · Account verified</p>
                                    </div>
                                </div>
                            )}
                            {recipientQuery.isError && <p className="mt-2 text-xs text-amber-300">Account not found. You can still submit this as an external transfer.</p>}
                        </TransferSection>

                        <TransferSection number="03" title="Set the amount">
                            <div className="relative">
                                <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg text-slate-500">$</span>
                                <input aria-label="Amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full rounded-2xl border border-white/10 bg-slate-950 py-5 pl-10 pr-5 text-2xl font-semibold tracking-tight text-white outline-none transition placeholder:text-slate-700 focus:border-blue-400" />
                            </div>
                            <input aria-label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a note (optional)" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400" />
                        </TransferSection>

                        <TransferSection number="04" title="Authorize payment">
                            <div className="relative">
                                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input aria-label="Transaction PIN" type="password" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} placeholder="Enter your 6-digit transaction PIN" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 pl-12 text-sm tracking-[0.2em] text-white outline-none transition placeholder:tracking-normal placeholder:text-slate-600 focus:border-blue-400" />
                            </div>
                        </TransferSection>
                    </div>

                    {message && <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-300">{message}</div>}

                    <button type="submit" disabled={transferMutation.isPending} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50">
                        {transferMutation.isPending ? "Processing transfer..." : "Review and transfer"}
                        {!transferMutation.isPending && <ArrowRight size={17} />}
                    </button>
                </form>

                <aside className="flex flex-col rounded-3xl border border-blue-400/15 bg-blue-500/[0.07] p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Transfer summary</p>
                        <ShieldCheck size={19} className="text-blue-300" />
                    </div>
                    <div className="mt-10">
                        <p className="text-sm text-slate-400">You are sending</p>
                        <p className="mt-2 text-4xl font-semibold tracking-tight text-white">${formattedAmount}</p>
                    </div>
                    <div className="my-8 h-px bg-white/10" />
                    <div className="space-y-5 text-sm">
                        <SummaryRow label="From" value={selectedAccount ? `${selectedAccount.type} · ${selectedAccount.accountNumber}` : "Select an account"} />
                        <SummaryRow label="To" value={recipientQuery.data?.name ?? "Recipient not verified"} />
                        <SummaryRow label="Bank" value={bankName || "Not specified"} />
                        <SummaryRow label="Fee" value="$10.00" />
                        <SummaryRow label="Total" value={`$${formattedTotal}`} />
                    </div>
                    <div className="mt-auto flex items-start gap-3 border-t border-white/10 pt-6 text-xs leading-5 text-slate-400">
                        <LockKeyhole size={15} className="mt-0.5 shrink-0 text-emerald-300" />
                        Transfers are protected with your transaction PIN and encrypted end to end.
                    </div>
                </aside>
            </div>
    )
}


    function TransferSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
        return <section><div className="mb-3 flex items-center gap-3"><span className="text-xs font-semibold text-blue-400">{number}</span><h3 className="text-sm font-medium text-slate-200">{title}</h3></div>{children}</section>
    }

    function SummaryRow({ label, value }: { label: string; value: string }) {
        return <div className="flex items-start justify-between gap-4"><span className="text-slate-500">{label}</span><span className="max-w-[12ch] text-right text-slate-200">{value}</span></div>
    }