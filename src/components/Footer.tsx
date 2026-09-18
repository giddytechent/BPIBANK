import Image from "next/image";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-slate-900 text-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
                <div className="flex items-center gap-2">
                    <Image
                        src="/BPI1.png"
                        alt="BPI logo"
                        width="50"
                        height="50"
                        className="border rounded-xl"
                    />

                    <span>BPI BANK</span>
                </div>

                <p>
                    Bank of the Philipines islands
                </p>
            </div>
        </footer>
    )
}
