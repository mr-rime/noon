import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

type BreadcrumbProps = {
    items: BreadcrumbItem[];
    separator?: React.ReactNode;
    className?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items,
    separator = <ChevronRight className="w-4 h-4 text-gray-400" />,
    className = "",
}) => {
    return (
        <nav aria-label="Breadcrumb" className={className}>
            <ol className="flex items-center space-x-1 text-sm text-gray-600">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={index} className="flex items-center">
                            {!isLast ? (
                                <Link
                                    to={item.href}
                                    className="hover:underline text-blue-600"
                                >
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
