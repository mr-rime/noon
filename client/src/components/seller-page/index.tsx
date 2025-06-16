import { SellerPicture } from "./components/seller-picture";
import { SellerThumbnail } from "./components/seller-thumbnail";

export function SellerPage() {
    return (
        <main className="site-container">
            <section>
                <SellerThumbnail />
                <SellerPicture />
            </section>
            <section>
                
            </section>
        </main>
    )
}
