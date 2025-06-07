import React from 'react';
import { cn } from '../../utils/cn';

interface SeparatorProps {
    className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ className }) => {
    return (
        <hr className={cn(`border-t border-[#EAECF0]`, className)} />
    );
};

