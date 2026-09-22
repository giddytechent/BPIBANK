import { CreditCard } from "lucide-react";

export default function CardsPage() {
    return (
        <div className="mx-auto max-w-7xl p-5 sm:p-8 lg:px-10">
            <header className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-(--brand-red)">Banking</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">Cards</h1>
                <p className="mt-2 text-sm text-stone-500">Manage your physical and virtual cards.</p>
            </header>

            <section className="rounded-md border border-stone-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-red-50 text-(--brand-red)">
                    <CreditCard size={22} />
                </div>
                <h2 className="mt-5 text-lg font-semibold">Cards are coming soon</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                    Card management will be available here once your card is issued.
                </p>
            </section>
        </div>
    );
}