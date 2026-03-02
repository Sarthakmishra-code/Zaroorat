export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const CITIES = [
  {
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb7957ef9?w=400&h=300&fit=crop',
    description: 'Financial Capital'
  },
  {
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
    description: 'Heart of India'
  },
  {
    name: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop',
    description: 'Silicon Valley'
  },
  {
    name: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1603262110679-cc9bc042a4ce?w=400&h=300&fit=crop',
    description: 'City of Pearls'
  },
  {
    name: 'Chennai',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop',
    description: 'Gateway to South'
  },
  {
    name: 'Kolkata',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=300&fit=crop',
    description: 'City of Joy'
  },
  {
    name: 'Pune',
    image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400&h=300&fit=crop',
    description: 'Oxford of East'
  },
  {
    name: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop',
    description: 'Pink City'
  },
];

export const VEHICLE_TYPES = {
  BIKE: 'bike',
  CAR: 'car',
  HOSTEL: 'hostel',
};

// Placeholder images for vehicles (Unsplash)
export const PLACEHOLDER_IMAGES = {
  bike: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop',
  car: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop',
  hostel: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
};
