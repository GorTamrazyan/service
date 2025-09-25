import GuestBrowsingWrapper from "./components/GuestBrowsingWrapper";
import ProductsPage from "./client/dashboard/products/page";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
    return (
        <GuestBrowsingWrapper>
            <Header />
            <div style={{ marginTop: '80px' }}>
                <ProductsPage />
            </div>
            <Footer />
        </GuestBrowsingWrapper>
    );
}
