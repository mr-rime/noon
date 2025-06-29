import { useRef } from "react";

export function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

	function debouncedFn(...args: Parameters<T>) {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			callback(...args);
		}, delay);
	}

	return debouncedFn;
}
