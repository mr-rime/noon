import React, { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

type BreadcrumbItem = {
    label: string;
    href?: string;
};

type BreadcrumbProps = {
    items?: BreadcrumbItem[];
    onClick?: () => void;
    separator?: React.ReactNode;
    className?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items,
    onClick,
    separator = <ChevronRight className="w-4 h-4 text-gray-400" />,
    className = "",
}) => {
    const location = useLocation();

    const dynamicItems = useMemo(() => {
        const segments = location.pathname.split("/").filter(Boolean);

        return segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/");
            const label =
                segment.charAt(0).toUpperCase() + segment.slice(1).replace(/[-_]/g, " ");
            return { label, href };
        });
    }, [location]);

    const finalItems = items ?? dynamicItems;

    return (
        <nav aria-label="Breadcrumb" className={className}>
            <ol className="flex items-center space-x-1 text-sm text-gray-600">
                {finalItems.map((item, index) => {
                    const isLast = index === finalItems.length - 1;
                    return (
                        <li onClick={onClick} key={index} className="flex items-center">
                            {!isLast ? (
                                <Link to={item.href!} className="hover:underline text-blue-600">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-gray-800">{item.label}</span>
                            )}
                            {!isLast && <span className="mx-2">{separator}</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
