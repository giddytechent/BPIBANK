import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}