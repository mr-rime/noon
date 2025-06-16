import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animateElement } from '../../../utils/animateElement';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

type ModalDialogProps = {
    onClose: () => void;
    header?: ReactNode;
    content?: ReactNode;
    footer?: ReactNode;
};

export function ModalDialog({ onClose, header, content, footer }: ModalDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        if (isClosing) return;
        setIsClosing(true);

        if (dialogRef.current && overlayRef.current) {
            const animations = [
                animateElement(overlayRef.current, [{ opacity: 0.5 }, { opacity: 0 }], { duration: 150 }),
                animateElement(dialogRef.current, [
                    { opacity: 1, transform: 'scale(1)' },
                    { opacity: 0, transform: 'scale(0.95)' }
                ], { duration: 200 })
            ];
            Promise.all(animations.map(a => a.finished)).then(() => {
                onClose();
            });
        } else {
            onClose();
        }
    };

    useEffect(() => {
        if (overlayRef.current) {
            animateElement(overlayRef.current, [{ opacity: 0 }, { opacity: 0.5 }], { duration: 150 });
        }

        if (dialogRef.current) {
            animateElement(dialogRef.current, [
                { opacity: 0, transform: 'scale(0.95)' },
                { opacity: 1, transform: 'scale(1)' }
            ], { duration: 200 });
        }
    }, [])

    useEffect(() => {
        const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();

        const focusTrap = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusableElements?.length) return;

                const elements = Array.from(focusableElements);
                const first = elements[0];
                const last = elements[elements.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '0px';
        document.addEventListener('keydown', focusTrap);
        return () => {
            document.removeEventListener('keydown', focusTrap);
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, []);

    if (typeof window === "undefined") return null;

    return createPortal(
        <>
            <div
                ref={overlayRef}
                className="fixed top-0 left-0 w-full h-full bg-black opacity-0 z-[9998]"
                style={{ transition: "opacity 150ms ease-out" }}
                onClick={handleClose}
                aria-hidden="true"
                tabIndex={-1}
            />
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 flex items-center justify-center opacity-0 z-[9999]"
                style={{
                    transform: "scale(0.95)",
                    transition: "opacity 200ms ease-out, transform 200ms cubic-bezier(0.16, 1, 0.3, 1)"
                }}
            >
                <div className="relative bg-white rounded-lg w-[400px] overflow-hidden outline-none">
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 cursor-pointer"
                        aria-label="Close dialog"
                    >
                        <X />
                    </button>

                    {header && <div>{header}</div>}
                    <div className="p-4 space-y-4">
                        {content && <div>{content}</div>}
                        {footer && <div>{footer}</div>}
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
