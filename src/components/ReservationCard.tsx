import React from 'react';
import { Building2, CalendarDays, CheckCircle, UserCircle } from 'lucide-react'; // 導入 Lucide 圖標

const formatDate = (input: string) => {
    const date = new Date(input)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const time = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${time}`
};

// 定義 ReservationCard 接收的 props 型別
type Reservation = {
    building: string
    floor: string
    room_number: string
    status: string
    inspector: string
    createdAt: string
};

export default function ReservationCard({ reservation }: { reservation: Reservation }) {
    return (
        <div className='flex flex-col gap-3 w-[300px] border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white'>
            <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-500" /> {/* 替換為 Lucide 圖標 */}
                <p className="font-bold text-lg text-gray-800">{reservation.building} - {reservation.room_number}</p>
            </div>
            <div className="flex flex-col text-sm gap-2 text-gray-600">
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" /> {/* 替換為 Lucide 圖標 */}
                    <p>預約時間：{formatDate(reservation.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-500" /> {/* 替換為 Lucide 圖標 */}
                    <p>檢查結果：<span className={reservation.status ? 'text-green-600 font-medium' : 'text-orange-500'}>{reservation.status || '尚未檢查'}</span></p>
                </div>
                <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-gray-500" /> {/* 替換為 Lucide 圖標 */}
                    <p>檢查人員：{reservation.inspector || '尚未指定'}</p>
                </div>
            </div>
        </div>
    );
}