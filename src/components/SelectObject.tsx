import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// 支援 value/onChange 為可選
type Props = {
    type: string
    options?: string[]
    value?: string
    onChange?: (val: string) => void
    disabled?: boolean
    // 這裡的 placeholder 是 SelectValue 的 placeholder
    // 不是 Select 的 placeholder
    placeholder?: string
}

export default function SelectObject({ type, options = [], value, onChange }: Props) {
    return (
        <div className="flex justify-center gap-4 items-center m-2">
            <h2 className="font-bold">{type}</h2>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-28">
                    <SelectValue placeholder={`請選${type}`} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options.map(option => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
