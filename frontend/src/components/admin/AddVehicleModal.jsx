import { useState } from 'react';
import { X, Upload, Car as CarIcon, Bike } from 'lucide-react';
import toast from 'react-hot-toast';

const AddVehicleModal = ({ isOpen, onClose, type, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        brand_name: '',
        model: '',
        category: '',
        city: '',
        price: '',
        pricePerHour: '',
        registrationNumber: '',
        fuelType: '',
        transmission: '',
        seatingCapacity: '',
        engine_CC: '',
        mileage: '',
        kmRun: '',
        description: '',
    });
    const [imageFile, setImageFile] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!imageFile) {
            toast.error('Please upload an image for the vehicle.');
            return;
        }

        try {
            setLoading(true);
            const submitData = new FormData();
            
            // Append all text fields
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    submitData.append(key, formData[key]);
                }
            });
            
            // Append file
            const fileField = type === 'cars' ? 'CarImage' : 'BikeImage';
            submitData.append(fileField, imageFile);

            const token = localStorage.getItem('accessToken');
            const res = await fetch(`http://localhost:8000/api/v1/${type}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
            });

            const data = await res.json();
            
            if (res.ok) {
                toast.success(`${type === 'cars' ? 'Car' : 'Bike'} added successfully!`);
                onSuccess();
                onClose();
            } else {
                throw new Error(data.message || 'Failed to add vehicle');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Error occurred while saving');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white/90 dark:bg-dark-800/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-700 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {type === 'cars' ? <CarIcon className="h-5 w-5 text-blue-600" /> : <Bike className="h-5 w-5 text-blue-600" />}
                        Add New {type === 'cars' ? 'Car' : 'Bike'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name *</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="ex: Swift Dzire" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Brand Name *</label>
                            <input type="text" name="brand_name" required value={formData.brand_name} onChange={handleChange} className="input-field" placeholder="ex: Maruti Suzuki" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Model *</label>
                            <input type="text" name="model" required value={formData.model} onChange={handleChange} className="input-field" placeholder="ex: 2023 VXI" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category *</label>
                            <input type="text" name="category" required value={formData.category} onChange={handleChange} className="input-field" placeholder={type === 'cars' ? 'ex: Sedan, SUV...' : 'ex: Sports, Cruiser...'} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Price (per day) *</label>
                            <input type="number" name="price" required value={formData.price} onChange={handleChange} className="input-field" placeholder="ex: 1500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Price (per hour)</label>
                            <input type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} className="input-field" placeholder="ex: 150" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">City *</label>
                            <input type="text" name="city" required value={formData.city} onChange={handleChange} className="input-field" placeholder="ex: Delhi" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Registration # *</label>
                            <input type="text" name="registrationNumber" required value={formData.registrationNumber} onChange={handleChange} className="input-field" placeholder="ex: DL10 CA 1234" />
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="pt-4 border-t border-gray-100 dark:border-dark-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {type === 'cars' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Fuel Type</label>
                                        <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="input-field">
                                            <option value="">Select</option>
                                            <option value="Petrol">Petrol</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="CNG">CNG</option>
                                            <option value="Electric">Electric</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Transmission</label>
                                        <select name="transmission" value={formData.transmission} onChange={handleChange} className="input-field">
                                            <option value="">Select</option>
                                            <option value="Manual">Manual</option>
                                            <option value="Automatic">Automatic</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Seats *</label>
                                        <input type="number" name="seatingCapacity" required value={formData.seatingCapacity} onChange={handleChange} className="input-field" placeholder="ex: 5" />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Engine CC *</label>
                                    <input type="number" name="engine_CC" required value={formData.engine_CC} onChange={handleChange} className="input-field" placeholder="ex: 350" />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium mb-1">Mileage</label>
                                <input type="text" name="mileage" value={formData.mileage} onChange={handleChange} className="input-field" placeholder="ex: 18 kmpl" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">KM Driven</label>
                                <input type="number" name="kmRun" value={formData.kmRun} onChange={handleChange} className="input-field" placeholder="ex: 15000" />
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="pt-4 border-t border-gray-100 dark:border-dark-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Vehicle Image *</h3>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-dark-600 px-6 py-8">
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white dark:bg-dark-800 font-semibold text-blue-600 hover:text-blue-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                                {imageFile && <p className="text-sm font-medium text-green-600 mt-2">Selected: {imageFile.name}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-dark-700">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="input-field" placeholder="Add some details about the vehicle..."></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-dark-700 sticky bottom-0 bg-white dark:bg-dark-800 py-4 z-10">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                            {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : 'Save Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicleModal;
