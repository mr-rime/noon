import { useState, useRef, useEffect } from "react";
import { animateElement } from "../../utils/animateElement";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    defaultValue?: string;
    onChange?: (value: string) => void;
    className?: string
}

export function Select({ options, defaultValue, onChange, className }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value);
    const selectRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === selectedValue);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        onChange?.(value);
        setIsOpen(false);
    };

    useEffect(() => {
        if (!optionsRef.current) return;

        if (isOpen) {
            animateElement(optionsRef.current, [
                { opacity: 0, transform: 'translateY(-10px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 200 });
        } else if (optionsRef.current) {
            const animation = animateElement(optionsRef.current, [
                { opacity: 1, transform: 'translateY(0)' },
                { opacity: 0, transform: 'translateY(-10px)' }
            ], { duration: 200 });

            animation.onfinish = () => {
                if (optionsRef.current) {
                    optionsRef.current.style.display = 'none';
                }
            };
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && optionsRef.current) {
            optionsRef.current.style.display = 'block';
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={selectRef}>
            <div
                className={cn("bg-white p-[8px] cursor-pointer border border-[#e2e5f1] capitalize rounded-[8px] flex justify-between items-center", className)}
                onClick={toggleDropdown}
            >
                <span>{selectedOption?.label || 'Select an option'}</span>
                <ChevronDown size={17} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <div
                ref={optionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e5f1] rounded-[8px] shadow-lg z-10 overflow-hidden opacity-0"
                style={{ display: isOpen ? 'block' : 'none' }}
            >
                {options.map((option) => (
                    <div
                        key={option.value}
                        className={`p-[8px] hover:bg-gray-100 cursor-pointer  ${selectedValue === option.value ? 'bg-blue-50 text-blue-600' : ''
                            }`}
                        onClick={() => handleSelect(option.value)}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
}