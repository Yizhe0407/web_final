// store/reservationStore.ts
import { create } from 'zustand';
import { api } from '@/lib/api';

export type Reservation = {
    id?: string;
    building: string;
    floor: string;
    room: string;
    status: string;
    inspector: string;
    createdAt: string;
};

interface ReservationState {
    reservations: Reservation[];
    isLoading: boolean;
    setReservations: (reservations: Reservation[]) => void;
    addReservation: (reservation: Reservation) => void;
    updateReservation: (id: string, updates: Partial<Reservation>) => void;
    setLoading: (loading: boolean) => void;
    refreshReservations: () => Promise<void>;
}

export const useReservationStore = create<ReservationState>((set, get) => ({
    reservations: [],
    isLoading: false,
    setReservations: (reservations: Reservation[]) => set({ reservations }),
    addReservation: (reservation: Reservation) =>
        set((state) => ({
            reservations: [...state.reservations, reservation]
        })),
    updateReservation: (id: string, updates: Partial<Reservation>) =>
        set((state) => ({
            reservations: state.reservations.map((reservation) =>
                reservation.id === id ? { ...reservation, ...updates } : reservation
            ),
        })),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    refreshReservations: async () => {
        const { setLoading, setReservations } = get();
        setLoading(true);
        try {
            const data = await api.reserve.all();
            setReservations(data.reserves || []);
        } catch (error) {
            console.error('Error refreshing reservations:', error);
            setReservations([]);
        } finally {
            setLoading(false);
        }
    },
}));
