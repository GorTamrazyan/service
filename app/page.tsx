import GuestBrowsingWrapper from "./client/components/GuestBrowsingWrapper";
import ProductsPage from "./client/dashboard/products/page";
import Header from "./client/components/Header";
import Footer from "./client/components/Footer";

export default function Home() {
    return (
        <GuestBrowsingWrapper>
            <Header />
            <div style={{ marginTop: "80px" }}>
                <ProductsPage />
            </div>
            <Footer />
        </GuestBrowsingWrapper>
    );
}
