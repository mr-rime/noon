import { useMemo, useEffect, useRef } from "react";
import { debounce } from "../utils/debounce";

export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  wait = 300
): (...args: Parameters<T>) => void {
  const callbackRef = useRef<T>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...args: any[]) => {
      callbackRef.current(...args as Parameters<T>);
    };

    return debounce(func, wait);
  }, [wait]);

  return debouncedCallback;
}
