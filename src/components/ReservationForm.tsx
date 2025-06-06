'use client'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import SelectObject from './SelectObject'
import { api } from '@/lib/api'
import { useReservationStore } from '@/store/reservationStore'
import toast from 'react-hot-toast'
import { CalendarPlus, Send } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type FormValues = {
    building: string
    floor: string
    room: string
}

export default function ReservationForm() {
    const { control, handleSubmit, watch, resetField, reset } = useForm<FormValues>()
    const [open, setOpen] = useState(false) // 控制 Dialog 開關
    const [isSubmitting, setIsSubmitting] = useState(false)
    const refreshReservations = useReservationStore((state) => state.refreshReservations)

    const building = watch("building")
    const floor = watch("floor")

    const buildingData: Record<string, Record<string, string[]>> = {
        "A1": {
            "1": ["101", "102"],
            "2": ["201", "202"],
        },
        "A2": {
            "1": ["103", "104"],
            "3": ["301", "302"],
        },
        "A3": {
            "2": ["203", "204"],
            "3": ["303", "304"],
        },
    }

    const floorOptions = building ? Object.keys(buildingData[building]) : []
    const roomOptions = building && floor ? buildingData[building][floor] || [] : []

    const onSubmit = async (data: FormValues) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        console.log("✅ 表單送出：", data);

        try {
            await api.reserve.add(data);
            console.log("✅ 預約成功");
            toast.success('預約成功！');

            // Reset form and close dialog
            reset();
            setOpen(false);

            // Refresh reservations list
            await refreshReservations();
        } catch (error) {
            console.error("❌ 預約失敗", error);
            toast.error('預約失敗，請稍後再試');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-[280px] font-bold mt-2 flex items-center gap-2">
                    <CalendarPlus className="h-5 w-5" />
                    預約房間檢查
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[90%] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold mb-4">選擇房間</DialogTitle>
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>

                        <Controller
                            name="building"
                            control={control}
                            rules={{ required: '請選擇棟別' }} // 添加驗證規則
                            render={({ field, fieldState }) => (
                                <div>
                                    <SelectObject
                                        type="棟別"
                                        options={Object.keys(buildingData)}
                                        value={field.value}
                                        onChange={(val) => {
                                            field.onChange(val)
                                            resetField("floor", { defaultValue: '' }) // 重置時清空值
                                            resetField("room", { defaultValue: '' })
                                        }}
                                        placeholder="請選擇棟別" // 添加 placeholder
                                    />
                                    {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                                </div>
                            )}
                        />

                        <Controller
                            name="floor"
                            control={control}
                            rules={{ required: '請選擇樓層' }} // 添加驗證規則
                            render={({ field, fieldState }) => (
                                <div>
                                    <SelectObject
                                        type="樓層"
                                        options={floorOptions}
                                        value={field.value}
                                        onChange={(val) => {
                                            field.onChange(val)
                                            resetField("room", { defaultValue: '' })
                                        }}
                                        disabled={!building} // 如果未選擇 building 則禁用
                                        placeholder="請選擇樓層" // 添加 placeholder
                                    />
                                    {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                                </div>
                            )}
                        />

                        <Controller
                            name="room"
                            control={control}
                            rules={{ required: '請選擇房號' }} // 添加驗證規則
                            render={({ field, fieldState }) => (
                                <div>
                                    <SelectObject
                                        type="房號"
                                        options={roomOptions}
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={!floor} // 如果未選擇 floor 則禁用
                                        placeholder="請選擇房號" // 添加 placeholder
                                    />
                                    {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                                </div>
                            )}
                        />

                        <Button type="submit" className="w-full mt-2 flex items-center gap-2" disabled={isSubmitting}>
                            <Send className="h-4 w-4" />
                            {isSubmitting ? '送出中...' : '送出預約'}
                        </Button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}