/**
 * Type definitions for the RideShare app
 */

export type UserRole = 'driver' | 'passenger';
export type TripStatus = 'active' | 'done' | 'cancelled';

export interface User {
  id: string;
  name: string;
  phone: string;
  rating: number;
  reviewCount: number;
  tripsAsDriver: number;
  tripsAsPassenger: number;
  avatar?: string;
}

export interface Trip {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  status: TripStatus;
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  carInfo?: string;
  carYear?: string;
  comments?: string;
  createdAt: string;
}

export interface CreateTripData {
  role?: UserRole;
  origin?: string;
  destination?: string;
  date?: string;
  time?: string;
  seats?: number;
  price?: number;
  carInfo?: string;
  carYear?: string;
  comments?: string;
}
