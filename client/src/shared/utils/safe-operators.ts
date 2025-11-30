


export function safeMap<T, R>(
    arr: T[] | null | undefined,
    mapper: (item: T, index: number) => R,
    fallback: R[] = []
): R[] {
    if (!arr || !Array.isArray(arr)) {
        return fallback
    }
    try {
        return arr.map(mapper)
    } catch (error) {
        console.error('Error in safeMap:', error)
        return fallback
    }
}


export function safeFilter<T>(
    arr: T[] | null | undefined,
    predicate: (item: T, index: number) => boolean,
    fallback: T[] = []
): T[] {
    if (!arr || !Array.isArray(arr)) {
        return fallback
    }
    try {
        return arr.filter(predicate)
    } catch (error) {
        console.error('Error in safeFilter:', error)
        return fallback
    }
}


export function safeReduce<T, R>(
    arr: T[] | null | undefined,
    reducer: (acc: R, item: T, index: number) => R,
    initialValue: R
): R {
    if (!arr || !Array.isArray(arr)) {
        return initialValue
    }
    try {
        return arr.reduce(reducer, initialValue)
    } catch (error) {
        console.error('Error in safeReduce:', error)
        return initialValue
    }
}


export function safeGet<T>(
    obj: any,
    path: string,
    defaultValue: T
): T {
    if (!obj) return defaultValue

    try {
        const keys = path.split('.')
        let value = obj
        for (const key of keys) {
            if (value === null || value === undefined) {
                return defaultValue
            }
            value = value[key]
        }
        return (value ?? defaultValue) as T
    } catch {
        return defaultValue
    }
}


export function safeCall<T>(
    fn: () => T,
    fallback: T
): T {
    try {
        return fn()
    } catch {
        return fallback
    }
}


export function safeGetIndex<T>(
    arr: T[] | null | undefined,
    index: number,
    fallback: T | null = null
): T | null {
    if (!arr || !Array.isArray(arr)) {
        return fallback
    }
    if (index < 0 || index >= arr.length) {
        return fallback
    }
    return arr[index] ?? fallback
}


export function safeLength(arr: any[] | null | undefined): number {
    if (!arr || !Array.isArray(arr)) {
        return 0
    }
    return arr.length
}


export function isEmpty(arr: any[] | null | undefined): boolean {
    return safeLength(arr) === 0
}


export function hasItems(arr: any[] | null | undefined): boolean {
    return safeLength(arr) > 0
}
