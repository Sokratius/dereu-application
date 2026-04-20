import { LucideIcon } from 'lucide-react';

export type AlertStatus = 'active' | 'closed';
export type AlertType = 'missing_person' | 'suspect' | 'emergency';
export type CrimePoint = 'theft' | 'robbery' | 'assault' | 'fraud' | 'vandalism' | 'narcotics';

export interface CrimeDetail {
  label: string;
  value: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  status: AlertStatus;
  photoUrl: string;
  name: string;
  age?: string;
  description: string;
  lastSeenLocation: string;
  coordinates: [number, number]; // [lat, lng]
  timestamp: string;
  specialNotes?: string;
  crimePoint?: CrimePoint;
  crimeDetails?: CrimeDetail[];
  authorityName: string;
  radiusKm: number; // For visualization on map
  isVerified: boolean;
}

export interface User {
  id: string;
  iin: string;
  role: 'user' | 'admin';
  name?: string;
}

export interface Report {
  id: string;
  alertId: string;
  reporterId: string;
  photoUrl?: string;
  message: string;
  location?: string;
  timestamp: string;
}
