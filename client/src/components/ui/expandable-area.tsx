import React, { useRef, useState } from 'react';
import { animateElement } from '../../utils/animateElement';

interface ExpandableAreaProps {
    children: React.ReactNode;
    initiallyExpanded?: boolean;
}

const ExpandableArea: React.FC<ExpandableAreaProps> = ({ children, initiallyExpanded = false }) => {
    const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
    const contentRef = useRef<HTMLDivElement>(null);

    const toggleExpansion = () => {
        const el = contentRef.current;
        if (!el) return;

        const measuredHeight = el.scrollHeight;

        if (isExpanded) {
            setIsExpanded(false);
            animateElement(el, [
                { height: `${measuredHeight}px`, opacity: 1 },
                { height: '0px', opacity: 0 }
            ], {}).onfinish = () => {
                el.style.height = '0px';
            };
        } else {
            el.style.height = 'auto';
            const fullHeight = el.scrollHeight;
            el.style.height = '0px';
            setIsExpanded(true);

            requestAnimationFrame(() => {
                animateElement(el, [
                    { height: '0px', opacity: 0 },
                    { height: `${fullHeight}px`, opacity: 1 }
                ], {}).onfinish = () => {
                    el.style.height = 'auto';
                };

            });

        }
    };

    return (
        <div className='bg-white  rounded-[3px]'>
            <div
                ref={contentRef}
                style={{
                    overflow: 'hidden',
                    height: initiallyExpanded ? 'auto' : '0px',
                    opacity: initiallyExpanded ? 1 : 0,
                }}
                className='p-5'
            >
                {children}
            </div>
            <button onClick={toggleExpansion} className="mb-2 px-4 py-2 bg-transparent cursor-pointer text-[#7e859b] rounded w-full text-center">
                {isExpanded ? "Hide full tracking" : "Show full tracking"}
            </button>
        </div>
    );
};

export default ExpandableArea;
