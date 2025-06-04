"use client"
import React from 'react'
import { api } from '@/lib/api'
import ReservationCard from './ReservationCard'
import toast from 'react-hot-toast'

type Reservation = {
    building: string
    floor: string
    room_number: string
    status: string
    inspector: string
    createdAt: string
}

export default function ReservationList() {
    const [reservationData, setReservationData] = React.useState<Reservation[]>([])

    const fetchInfo = async () => {
        try {
            const data = await api.reserve.all()
            console.log('Fetched data:', data)
            setReservationData(data.reserves || [])
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('無法獲取預約資料')
            setReservationData([])
        } finally {

        }
    }

    React.useEffect(() => {
        fetchInfo()
    }, [])

    return reservationData.length > 0 ? (
        <div className="flex flex-col gap-4">
            {reservationData.map((reservation, index) => (
                <ReservationCard key={index} reservation={reservation} />
            ))}
        </div>
    ) : (
        <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">目前沒有任何預約</p>
        </div>
    )
}