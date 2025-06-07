import React, { useState } from 'react';
import { Building2, CalendarDays, CheckCircle, UserCircle, Check, X } from 'lucide-react'; // 導入 Lucide 圖標
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

const formatDate = (input: string) => {
    const date = new Date(input)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const time = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${time}`
};

// 定義 ReservationCard 接收的 props 型別
type Reservation = {
    id?: string;
    building: string;
    floor: string;
    room: string;
    status: string;
    inspector: string;
    createdAt: string;
};

export default function ReservationCard({
    reservation,
    onStatusUpdate
}: {
    reservation: Reservation;
    onStatusUpdate?: () => Promise<void>;
}) {
    const { isLoggedIn } = useAuthStore();
    const [isUpdating, setIsUpdating] = useState(false);

    // 調試：檢查reservation物件的所有屬性
    console.log('ReservationCard received:', reservation)
    console.log('Available fields:', Object.keys(reservation))

    // 嘗試不同的欄位名稱
    const roomNumber = reservation.room || '未知房間'
    const buildingName = reservation.building || '未知建築'

    const handleStatusUpdate = async (status: string) => {
        if (!reservation.id) {
            console.error('Reservation ID is missing');
            return;
        }

        setIsUpdating(true);
        try {
            // 獲取當前登入用戶資訊作為inspector
            const userInfo = await api.auth.me();
            const inspector = userInfo?.username || '未知檢查員';

            console.log(reservation.id, status, inspector);

            await api.reserve.updateStatus(reservation.id, status, inspector);

            // 呼叫父組件的回調函數來重新載入資料
            if (onStatusUpdate) {
                await onStatusUpdate();
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('更新狀態失敗，請稍後再試');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className='flex flex-col gap-3 w-[300px] border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white'>
            <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-500" /> {/* 替換為 Lucide 圖標 */}
                <p className="font-bold text-lg text-gray-800">{buildingName} - {roomNumber}</p>
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

            {/* 登入後才顯示的操作按鈕 */}
            {isLoggedIn && reservation.id && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <Button
                        onClick={() => handleStatusUpdate('合格')}
                        disabled={isUpdating}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm"
                    >
                        <Check className="h-4 w-4 mr-1" />
                        {isUpdating ? '處理中...' : '合格'}
                    </Button>
                    <Button
                        onClick={() => handleStatusUpdate('不合格')}
                        disabled={isUpdating}
                        size="sm"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-sm"
                    >
                        <X className="h-4 w-4 mr-1" />
                        {isUpdating ? '處理中...' : '不合格'}
                    </Button>
                </div>
            )}
        </div>
    );
}
