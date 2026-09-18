import { CreditCard } from "lucide-react";

export default function CardsPage() {
    return (
        <div className="p-5 sm:p-8">
            <header className="mb-8">
                <p className="text-sm text-slate-500">Banking</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight">Cards</h1>
                <p className="mt-2 text-sm text-slate-500">Manage your physical and virtual cards.</p>
            </header>

            <section className="rounded-2xl border border-white/10 bg-white/3 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                    <CreditCard size={22} />
                </div>
                <h2 className="mt-5 text-lg font-semibold">Cards are coming soon</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Card management will be available here once your card is issued.
                </p>
            </section>
        </div>
    );
}