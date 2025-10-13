import type React from 'react'

// Table types
export type Column<T> = {
    key: keyof T
    header: string
    render?: (row: T) => React.ReactNode
    sortable?: boolean
}

export type TableProps<T> = {
    data: T[]
    columns: Column<T>[]
    pageSize?: number
    currentPage?: number
    totalItems?: number
    onPageChange?: (page: number) => void
    onRowClick?: (row: T) => void
}

// Modal Dialog types
export type ModalDialogProps = {
    onClose: () => void
    header?: React.ReactNode
    content?: React.ReactNode
    footer?: React.ReactNode
    className?: string
    headerClassName?: string
    contentClassName?: string
    footerClassName?: string
    closeButtonClassName?: string
}

// Button types
export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    className?: string
    children?: React.ReactNode | React.ReactElement
}

// Dropzone types
export type DropzoneProps = {
    onFilesDrop?: (files: File[]) => void
    multiple?: boolean
    accept?: string
    className?: string
}

// Checkbox types
export type CheckboxProps = {
    label?: string
    name?: string
    checked: boolean
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    onCheckedChange?: (checked: boolean | undefined) => void
    description?: string
    className?: string
    disabled?: boolean
    id?: string
}

// Input types
export type ButtonDirectionType = 'left' | 'right'
export type IconDirectionType = 'left' | 'right'
export type InputRef = React.Ref<HTMLInputElement>

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'buttonContent'> & {
    className?: string
    button?: boolean | { content: React.ReactNode }
    buttonDirection?: ButtonDirectionType
    input?: { className?: string }
    iconDirection?: IconDirectionType
    icon?: React.ReactElement | React.ReactNode
    labelContent?: string
    ref?: InputRef
}

// Breadcrumb types
export type BreadcrumbItem = {
    label: string
    href?: string
}

export type BreadcrumbProps = {
    items?: BreadcrumbItem[]
    onClick?: () => void
    separator?: React.ReactNode
    className?: string
}

// Select types
export interface SelectOption {
    value: string
    label: string
}

export type SelectProps = {
    options: SelectOption[]
    defaultValue?: string
    onChange?: (value: string) => void
    className?: string
    children?: React.ReactNode
    labelContent?: string
}

// Image Slider types
export type DotsThemeType = 'theme1' | 'theme2' | 'theme3'

export interface ImageSliderProps {
    images: string[]
    mobileImages?: string[]
    height?: number | string
    autoPlay?: boolean
    autoPlayInterval?: number
    showControls?: boolean
    lazyImage?: boolean
    showDots?: boolean
    scaleOnHover?: boolean
    showProductControls?: boolean
    showProductDots?: boolean
    dotsTheme?: DotsThemeType
    disableDragDesktop?: boolean
    disableDragMobile?: boolean
    rounded?: boolean
}

// Radio types
export type RadioProps = {
    label: string
    name: string
    value: string
    checked: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    description?: string
    className?: string
    disabled?: boolean
}

// Expandable Area types
export interface ExpandableAreaProps {
    children: React.ReactNode
    initiallyExpanded?: boolean
}
