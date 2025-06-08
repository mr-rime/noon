import React from 'react';
import { cn } from '../../utils/cn';

interface SeparatorProps {
    className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ className }) => {
    return (
        <div className={cn(` bg-[#EAECF0] w-full h-[1px]`, className)} />
    );
};

