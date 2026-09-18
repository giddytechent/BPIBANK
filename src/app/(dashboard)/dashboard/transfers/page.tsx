import { TransferForm } from "@/components/dashboard/transferForm";

export default function TransferPage() {
    return (
        <main className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-6xl">
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
                            Payments / New transfer
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            Send money
                        </h1>
                        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                            Move money securely to a BPI account or another bank.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Secure transfer
                    </div>
                </div>

                <TransferForm />
            </div>
        </main>
    )
}