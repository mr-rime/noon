import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export type StatProps = {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: React.ElementType;
    color: "success" | "primary" | "warning" | "destructive";
};

const colorMap: Record<StatProps["color"], string> = {
    success: "#21c45d",
    primary: "#2563eb",
    warning: "#f59e0b",
    destructive: "#ef4444",
};

export function Stat({ title, value, change, trend, icon: Icon, color }: StatProps) {
    const iconBg = colorMap[color] + "1a"; // correct transparent background
    const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;

    return (
        <div className="w-full rounded-[10px] border border-[#e4e4e7] bg-white p-5 transition-shadow duration-200 hover:shadow-md">
            <div className="flex w-full items-center justify-between">
                <span className="font-bold text-[20px]">{title}</span>
                <div className="rounded-xl p-[8px]" style={{ backgroundColor: iconBg }}>
                    <Icon size={20} color={colorMap[color]} />
                </div>
            </div>
            <div className="mt-5 flex flex-col items-start justify-center text-black">
                <span className="font-bold text-[20px]">{value}</span>
                <div className="flex items-center gap-1">
                    <Badge className="flex items-center gap-1">
                        <TrendIcon size={17} color="white" />
                        <span className="font-bold text-[12px] text-white">{change}</span>
                    </Badge>
                    <span className="text-[#5a7396]">from yesterday</span>
                </div>
            </div>
        </div>
    );
}
