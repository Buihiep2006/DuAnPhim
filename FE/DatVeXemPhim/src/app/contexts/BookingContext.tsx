import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingState, CartItem } from '../../types/database.types';

interface BookingContextType {
  bookingState: BookingState;
  cartItems: CartItem[];
  setShowtime: (showtimeId: string) => void;
  addSeat: (seatId: string) => void;
  removeSeat: (seatId: string) => void;
  clearSeats: () => void;
  addService: (serviceId: string, quantity: number) => void;
  removeService: (serviceId: string) => void;
  updateServiceQuantity: (serviceId: string, quantity: number) => void;
  applyPromoCode: (code: string) => void;
  applyPoints: (points: number) => void;
  updateTotal: (amount: number) => void;
  clearBooking: () => void;
  remainingTime: number;
  startTimer: (minutes: number) => void;
  stopTimer: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookingState, setBookingState] = useState<BookingState>({
    suat_chieu_id: null,
    selected_seats: [],
    selected_services: [],
    khuyen_mai_code: null,
    diem_thuong_su_dung: 0,
    tong_tien: 0
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load booking state from localStorage
    const saved = localStorage.getItem('bookingState');
    if (saved) {
      setBookingState(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save booking state to localStorage
    localStorage.setItem('bookingState', JSON.stringify(bookingState));
  }, [bookingState]);

  const setShowtime = (showtimeId: string) => {
    setBookingState(prev => ({ ...prev, suat_chieu_id: showtimeId }));
  };

  const addSeat = (seatId: string) => {
    setBookingState(prev => ({
      ...prev,
      selected_seats: [...prev.selected_seats, seatId]
    }));
  };

  const removeSeat = (seatId: string) => {
    setBookingState(prev => ({
      ...prev,
      selected_seats: prev.selected_seats.filter(id => id !== seatId)
    }));
  };

  const clearSeats = () => {
    setBookingState(prev => ({ ...prev, selected_seats: [] }));
  };

  const addService = (serviceId: string, quantity: number) => {
    setBookingState(prev => {
      const existing = prev.selected_services.find(s => s.id === serviceId);
      if (existing) {
        return {
          ...prev,
          selected_services: prev.selected_services.map(s =>
            s.id === serviceId ? { ...s, quantity: s.quantity + quantity } : s
          )
        };
      }
      return {
        ...prev,
        selected_services: [...prev.selected_services, { id: serviceId, quantity }]
      };
    });
  };

  const removeService = (serviceId: string) => {
    setBookingState(prev => ({
      ...prev,
      selected_services: prev.selected_services.filter(s => s.id !== serviceId)
    }));
  };

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeService(serviceId);
      return;
    }
    setBookingState(prev => {
      const existing = prev.selected_services.find(s => s.id === serviceId);
      if (existing) {
        return {
          ...prev,
          selected_services: prev.selected_services.map(s =>
            s.id === serviceId ? { ...s, quantity } : s
          )
        };
      }
      return {
        ...prev,
        selected_services: [...prev.selected_services, { id: serviceId, quantity }]
      };
    });
  };

  const applyPromoCode = (code: string) => {
    setBookingState(prev => ({ ...prev, khuyen_mai_code: code }));
  };

  const applyPoints = (points: number) => {
    setBookingState(prev => ({ ...prev, diem_thuong_su_dung: points }));
  };

  const updateTotal = (amount: number) => {
    setBookingState(prev => ({ ...prev, tong_tien: amount }));
  };

  const clearBooking = () => {
    setBookingState({
      suat_chieu_id: null,
      selected_seats: [],
      selected_services: [],
      khuyen_mai_code: null,
      diem_thuong_su_dung: 0,
      tong_tien: 0
    });
    setCartItems([]);
    stopTimer();
    localStorage.removeItem('bookingState');
  };

  const startTimer = (minutes: number) => {
    setRemainingTime(minutes * 60);

    if (timerInterval) {
      clearInterval(timerInterval);
    }

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          clearBooking();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setRemainingTime(0);
  };

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return (
    <BookingContext.Provider
      value={{
        bookingState,
        cartItems,
        setShowtime,
        addSeat,
        removeSeat,
        clearSeats,
        addService,
        removeService,
        updateServiceQuantity,
        applyPromoCode,
        applyPoints,
        updateTotal,
        clearBooking,
        remainingTime,
        startTimer,
        stopTimer
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
