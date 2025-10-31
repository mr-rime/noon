
export function formatNumber(num: number): string {
    if (num < 1000) {
        return num.toString()
    }

    if (num < 1000000) {
        const thousands = num / 1000
        return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`
    }

    if (num < 1000000000) {
        const millions = num / 1000000
        return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
    }

    const billions = num / 1000000000
    return billions % 1 === 0 ? `${billions}B` : `${billions.toFixed(1)}B`
}
