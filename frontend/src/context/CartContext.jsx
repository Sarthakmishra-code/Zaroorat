import { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    startDate: '',
    endDate: '',
    notes: '',
  });

  const selectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    toast.success(`${vehicle.name} selected! 🎯`);
  };

  const clearSelection = () => {
    setSelectedVehicle(null);
    setOrderDetails({ startDate: '', endDate: '', notes: '' });
  };

  return (
    <CartContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        selectedVehicle,
        selectVehicle,
        orderDetails,
        setOrderDetails,
        clearSelection,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};