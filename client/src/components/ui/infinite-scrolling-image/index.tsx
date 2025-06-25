import type React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

interface InfiniteScrollingImageProps {
	imageUrl: string;
	speed?: number;
	className?: string;
	imageClassName?: string;
	direction?: "left" | "right";
}

export const InfiniteScrollingImage: React.FC<InfiniteScrollingImageProps> = memo(
	({ imageUrl, speed = 1, className = "", imageClassName = "", direction = "left" }) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const imageRef1 = useRef<HTMLImageElement>(null);
		const imageRef2 = useRef<HTMLImageElement>(null);
		const [imageWidth, setImageWidth] = useState(0);
		const requestRef = useRef<number>(null);
		const positionRef = useRef<number>(0);

		const updateImageWidth = useCallback(() => {
			if (imageRef1.current) {
				setImageWidth(imageRef1.current.offsetWidth);
			}
		}, []);

		const animate = useCallback(() => {
			if (!imageWidth) return;

			positionRef.current += direction === "left" ? -speed : speed;

			if (Math.abs(positionRef.current) >= imageWidth) {
				positionRef.current = 0;
			}

			if (imageRef1.current && imageRef2.current) {
				const transform1 = `translateX(${positionRef.current}px)`;
				const transform2 = `translateX(${positionRef.current + (direction === "left" ? imageWidth : -imageWidth)}px)`;

				imageRef1.current.style.transform = transform1;
				imageRef2.current.style.transform = transform2;
			}

			requestRef.current = requestAnimationFrame(animate);
		}, [imageWidth, speed, direction]);

		useEffect(() => {
			const handleLoad = () => {
				updateImageWidth();
				requestRef.current = requestAnimationFrame(animate);
			};

			const img = new Image();
			img.src = imageUrl;
			img.onload = handleLoad;

			return () => {
				if (requestRef.current) {
					cancelAnimationFrame(requestRef.current);
				}
			};
		}, [imageUrl, animate, updateImageWidth]);

		useEffect(() => {
			const handleResize = () => {
				updateImageWidth();
			};

			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
		}, [updateImageWidth]);

		return (
			<div ref={containerRef} className={`relative w-full h-[200px] overflow-hidden ${className}`}>
				<img
					ref={imageRef1}
					src={imageUrl}
					alt="Scrolling background"
					className={`absolute top-0 left-0 h-full w-auto ${imageClassName}`}
					style={{ willChange: "transform" }}
					onLoad={updateImageWidth}
				/>
				<img
					ref={imageRef2}
					src={imageUrl}
					alt="Scrolling background duplicate"
					className={`absolute top-0 left-0 h-full w-auto ${imageClassName}`}
					style={{ willChange: "transform" }}
				/>
			</div>
		);
	},
);
