
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const CITIES = [
  { name: 'Mumbai', icon: '🌆' },
  { name: 'Delhi', icon: '🏛️' },
  { name: 'Bangalore', icon: '💻' },
  { name: 'Hyderabad', icon: '🍛' },
  { name: 'Chennai', icon: '🏖️' },
  { name: 'Kolkata', icon: '🎭' },
  { name: 'Pune', icon: '🎓' },
  { name: 'Jaipur', icon: '🏰' },
];

export const VEHICLE_TYPES = {
  BIKE: 'bike',
  CAR: 'car',
  HOSTEL: 'hostel',
};