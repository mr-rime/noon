
export interface LoginModalProps {
    onClose: () => void
}

export interface FormSwitchProps {
    inputRef: React.RefObject<HTMLInputElement | null>
    onClose: () => void
}

export interface LoginFormContentProps {
    isLogin: boolean
    isPending: boolean
    inputRef: React.RefObject<HTMLInputElement | null>
    onClose: () => void
}

export interface SignupFormContentProps {
    isLogin: boolean
    isPending: boolean
    inputRef: React.RefObject<HTMLInputElement | null>
    onClose: () => void
}


export type FormDirection = 'left' | 'right'
