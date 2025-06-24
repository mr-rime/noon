import { Link } from "@tanstack/react-router";
import { ProdcutPrice } from "./components/prodcut-price";
import { ProductBadge } from "./components/product-badge";
import { ProductImage } from "./components/product-image";
import { ProductTitle } from "./components/product-title";
import type { ProductType } from "@/types";
import { useState, useRef } from "react";

export function Product({ id, name, images, currency, price }: ProductType) {
    const [isDragging, setIsDragging] = useState(false);
    const linkRef = useRef<HTMLAnchorElement>(null);

    const handleMouseDown = () => {
        setIsDragging(false);
    };

    const handleMouseMove = () => {
        setIsDragging(true);
    };

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    return (
        <article className="w-full select-none max-w-[230px] h-[467px] rounded-[12px] border border-[#DDDDDD] p-2 overflow-x-hidden bg-white">
            <Link
                to="/p/$productId"
                params={{ productId: id }}
                className="w-full h-full"
                ref={linkRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
            >
                <ProductImage images={images?.map((img) => img.image_url)} />
                <ProductTitle name={name} />
                <ProdcutPrice price={price} currency={currency} />
                <ProductBadge />
            </Link>
        </article>
    )
}