import { animateElement } from "@/utils/animateElement";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DatePickerProps {
	value: Date | null;
	onChange: (date: Date) => void;
	labelContent?: string;
}

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export function DatePicker({ value, onChange, labelContent }: DatePickerProps) {
	const today = new Date();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(value ?? today);
	const [viewDate, setViewDate] = useState<Date>(value ?? today);
	const pickerRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const animationRef = useRef<Animation | null>(null);

	const closeWithAnimation = () => {
		if (pickerRef.current) {
			const animation = animateElement(
				pickerRef.current,
				[
					{ opacity: 1, transform: "scale(1)" },
					{ opacity: 0, transform: "scale(0.95)" },
				],
				{ duration: 200 },
			);
			animationRef.current = animation;
			animation.onfinish = () => setIsOpen(false);
		} else {
			setIsOpen(false);
		}
	};

	const toggleOpen = () => {
		if (isOpen) {
			closeWithAnimation();
		} else {
			setIsOpen(true);
		}
	};

	useEffect(() => {
		if (isOpen && pickerRef.current) {
			animateElement(
				pickerRef.current,
				[
					{ opacity: 0, transform: "scale(0.95)" },
					{ opacity: 1, transform: "scale(1)" },
				],
				{},
			);
		}
	}, [isOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				pickerRef.current &&
				!pickerRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				closeWithAnimation();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const handleDateClick = (day: number) => {
		const newDate = new Date(viewDate);
		newDate.setDate(day);
		setSelectedDate(newDate);
		setViewDate(newDate);
		onChange(newDate);
		closeWithAnimation();
	};

	const changeMonth = (offset: number) => {
		setViewDate((prev) => {
			const newDate = new Date(prev);
			newDate.setMonth(prev.getMonth() + offset);
			return newDate;
		});
	};

	const changeYear = (offset: number) => {
		setViewDate((prev) => {
			const newDate = new Date(prev);
			newDate.setFullYear(prev.getFullYear() + offset);
			return newDate;
		});
	};

	const renderDays = () => {
		const year = viewDate.getFullYear();
		const month = viewDate.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const daysInPrevMonth = new Date(year, month, 0).getDate();

		const days = [];

		// Previous month's overflow
		for (let i = firstDay - 1; i >= 0; i--) {
			days.push(
				<div key={`prev-${i}`} className="w-8 h-8 text-gray-400 flex items-center justify-center">
					{daysInPrevMonth - i}
				</div>,
			);
		}

		// Current month days
		for (let i = 1; i <= daysInMonth; i++) {
			const currentDate = new Date(year, month, i);

			const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === i;

			const isSelected =
				selectedDate &&
				selectedDate.getFullYear() === year &&
				selectedDate.getMonth() === month &&
				selectedDate.getDate() === i;

			const isActive = isSelected || (!selectedDate && isToday);

			days.push(
				<button
					key={i}
					onClick={() => handleDateClick(i)}
					className={`w-8 h-8 flex items-center justify-center rounded cursor-pointer 
                        ${isActive ? "bg-black text-white" : "hover:bg-gray-200"}
                        ${isToday && !isSelected ? "ring-2 ring-blue-500" : ""}`}
				>
					{i}
				</button>,
			);
		}

		return days;
	};

	return (
		<div className="relative flex flex-col text-left">
			{labelContent && <label className="text-[16px]">{labelContent}</label>}
			<button
				ref={buttonRef}
				onClick={toggleOpen}
				className="px-4 py-2 border border-[#E2E5F1] rounded-[8px] bg-white cursor-pointer"
			>
				{selectedDate ? selectedDate.toDateString() : "Select a date"}
			</button>

			{isOpen && (
				<div
					ref={pickerRef}
					className="absolute top-16 mt-2 p-4 w-72 bg-white border border-[#E2E5F1] rounded shadow z-10"
				>
					<div className="flex items-center justify-between mb-2">
						<button onClick={() => changeYear(-1)} className="text-sm px-2 cursor-pointer">
							<ChevronLeft size={16} />
						</button>
						<button onClick={() => changeMonth(-1)} className="text-sm px-2 cursor-pointer">
							<ChevronLeft size={16} />
						</button>
						<span className="font-semibold">
							{months[viewDate.getMonth()]} {viewDate.getFullYear()}
						</span>
						<button onClick={() => changeMonth(1)} className="text-sm px-2 cursor-pointer">
							<ChevronRight size={16} />
						</button>
						<button onClick={() => changeYear(1)} className="text-sm px-2 cursor-pointer">
							<ChevronRight size={16} />
						</button>
					</div>

					<div className="grid grid-cols-7 text-sm text-gray-500 mb-2">
						{"Su Mo Tu We Th Fr Sa".split(" ").map((d) => (
							<div key={d} className="w-8 h-8 flex items-center justify-center">
								{d}
							</div>
						))}
					</div>

					<div className="grid grid-cols-7 gap-1">{renderDays()}</div>
				</div>
			)}
		</div>
	);
}
