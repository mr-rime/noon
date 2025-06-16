import { useMemo, useRef } from 'react';
import { ModalDialog } from '../ui/modal-dialog/modal-dialog';
import { FormSwitch } from './components/form-switch';
import { InfiniteScrollingImage } from '../ui/infinite-scrolling-image';

export function LoginModal({ onClose }: { onClose: () => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const memoizedFormSwitch = useMemo(() => <FormSwitch inputRef={inputRef} onClose={onClose} />, [])
    return (
        <ModalDialog onClose={onClose} header={
            <>
                <InfiniteScrollingImage imageUrl='/media/imgs/random-items.png' />
                <h2
                    id="login-dialog-title"
                    className="text-xl font-bold mb-4 text-center"
                >
                    Hala! Let's get started
                </h2>
            </>
        }
            content={memoizedFormSwitch}
        />
    )
}


