import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
    );
}
