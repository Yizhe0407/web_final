"use client"
import React from 'react'
import { api } from '@/lib/api'
import ReservationCard from './ReservationCard'
import { useReservationStore, Reservation } from '@/store/reservationStore'
import toast from 'react-hot-toast'

type FilterType = 'all' | 'pending' | 'qualified' | 'unqualified';

interface ReservationListProps {
    filter: FilterType;
}

export default function ReservationList({ filter }: ReservationListProps) {
    const {
        reservations,
        isLoading,
        refreshReservations
    } = useReservationStore()

    React.useEffect(() => {
        refreshReservations()
    }, [refreshReservations])

    // 每當過濾器改變時重新獲取數據
    React.useEffect(() => {
        console.log('Filter changed to:', filter);
    }, [filter]);

    // 過濾預約數據的函數
    const getFilteredReservations = () => {
        console.log('All reservation data:', reservations);
        console.log('Current filter:', filter);

        if (filter === 'all') {
            return reservations;
        }

        const filtered = reservations.filter((reservation: Reservation) => {
            const status = reservation.status || '';
            console.log('Checking reservation:', {
                id: reservation.id,
                building: reservation.building,
                room: reservation.room,
                status: status,
                statusType: typeof status,
                isEmpty: !status,
                trimmedStatus: status.trim(),
                filter: filter
            });

            switch (filter) {
                case 'pending':
                    // 等待檢查：狀態為空、null、undefined、"尚未檢查" 或 "等待檢查"
                    const isPending = !status ||
                        status === '' ||
                        status.trim() === '' ||
                        status === '尚未檢查' ||
                        status === '等待檢查' ||
                        status.includes('尚未檢查') ||
                        status.includes('等待檢查');
                    console.log('Is pending?', isPending);
                    return isPending;
                case 'qualified':
                    // 檢查合格：確保狀態是"合格"而不是"不合格"
                    const isQualified = status &&
                        (status === '合格' ||
                            status.trim() === '合格' ||
                            (status.includes('合格') && !status.includes('不合格')));
                    console.log('Is qualified?', isQualified);
                    return isQualified;
                case 'unqualified':
                    // 檢查不合格：確保狀態是"不合格"
                    const isUnqualified = status &&
                        (status === '不合格' ||
                            status.trim() === '不合格' ||
                            status.includes('不合格'));
                    console.log('Is unqualified?', isUnqualified);
                    return isUnqualified;
                default:
                    return true;
            }
        });

        console.log('Filtered results:', filtered);
        return filtered;
    };

    const filteredReservations = getFilteredReservations();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">載入中...</p>
            </div>
        );
    }

    return filteredReservations.length > 0 ? (
        <div className="flex flex-col gap-4">
            {filteredReservations.map((reservation: Reservation, index: number) => (
                <ReservationCard
                    key={reservation.id || index}
                    reservation={reservation}
                    onStatusUpdate={refreshReservations}
                />
            ))}
        </div>
    ) : (
        <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">
                {filter === 'all'
                    ? '目前沒有任何預約'
                    : `目前沒有符合「${filter === 'pending' ? '等待檢查' :
                        filter === 'qualified' ? '檢查合格' :
                            filter === 'unqualified' ? '檢查不合格' : ''
                    }」條件的預約`
                }
            </p>
        </div>
    )
}
