// Login Modal types
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

// Form direction type
export type FormDirection = 'left' | 'right'
