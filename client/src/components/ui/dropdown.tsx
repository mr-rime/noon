import React, { useState, useRef, useEffect, useCallback, memo, Children, cloneElement } from "react";
import { animateElement } from "../../utils/animateElement";
import { cn } from "../../utils/cn";

interface DropdownProps {
    children: React.ReactNode;
    trigger: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
    className?: string;
    dropdownClassName?: string;
    position?: "bottom" | "top";
    align?: "left" | "right" | "center";
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    closeOnSelect?: boolean;
}

export const Dropdown = memo(function Dropdown({
    children,
    trigger,
    className,
    dropdownClassName,
    position = "bottom",
    align = "left",
    isOpen: controlledOpen,
    onOpenChange,
    closeOnSelect = true,
}: DropdownProps) {
    const [isInternalOpen, setIsInternalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const isOpen = controlledOpen !== undefined ? controlledOpen : isInternalOpen;

    const toggleDropdown = useCallback(() => {
        const newState = !isOpen;
        if (controlledOpen === undefined) {
            setIsInternalOpen(newState);
        }
        onOpenChange?.(newState);
    }, [isOpen, controlledOpen, onOpenChange]);

    const closeDropdown = useCallback(() => {
        if (controlledOpen === undefined) {
            setIsInternalOpen(false);
        }
        onOpenChange?.(false);
    }, [controlledOpen, onOpenChange]);

    useEffect(() => {
        if (!contentRef.current) return;

        const animationConfig = {
            duration: 200,
            fill: "forwards" as const,
        };

        if (isOpen) {
            contentRef.current.style.display = "block";
            animateElement(
                contentRef.current,
                [
                    { opacity: 0, transform: position === "bottom" ? "translateY(-10px)" : "translateY(10px)" },
                    { opacity: 1, transform: "translateY(0)" },
                ],
                animationConfig
            );
        } else {
            const animation = animateElement(
                contentRef.current,
                [
                    { opacity: 1, transform: "translateY(0)" },
                    { opacity: 0, transform: position === "bottom" ? "translateY(-10px)" : "translateY(10px)" },
                ],
                animationConfig
            );

            animation.onfinish = () => {
                if (contentRef.current) {
                    contentRef.current.style.display = "none";
                }
            };
        }
    }, [isOpen, position]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, closeDropdown]);

    const alignmentClasses = useCallback(() => {
        switch (align) {
            case "right":
                return "right-0";
            case "center":
                return "left-1/2 transform -translate-x-1/2";
            default:
                return "left-0";
        }
    }, [align]);

    const dropdownContent = useCallback(
        () => (
            <div
                ref={contentRef}
                className={cn(
                    "absolute z-10 mt-1 bg-white border border-[#e2e5f1] rounded-[8px] shadow-lg overflow-hidden opacity-0",
                    position === "top" ? "bottom-full mb-1" : "top-full",
                    alignmentClasses(),
                    dropdownClassName
                )}
                style={{ display: isOpen ? "block" : "none" }}
            >
                {closeOnSelect
                    ? Children.map(children, (child) => {
                        if (React.isValidElement(child)) {
                            type ChildProps = { onClick?: (e: React.MouseEvent) => void };
                            const typedChild = child as React.ReactElement<ChildProps>;
                            return cloneElement(typedChild, {
                                onClick: (e: React.MouseEvent) => {
                                    typedChild.props.onClick?.(e);
                                    if (!e.defaultPrevented) {
                                        closeDropdown();
                                    }
                                },
                            });
                        }
                        return child;
                    })
                    : children}
            </div>
        ),
        [children, closeDropdown, closeOnSelect, dropdownClassName, isOpen, position, alignmentClasses]
    );

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <div onClick={toggleDropdown} className="cursor-pointer">
                {typeof trigger === "function" ? trigger(isOpen) : trigger}
            </div>
            {dropdownContent()}
        </div>
    );
});