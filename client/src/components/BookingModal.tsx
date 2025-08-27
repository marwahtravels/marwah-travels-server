import React, { useState } from 'react';
import { X, User, Users, Baby, Mail, Phone, Calendar, MapPin, CreditCard, Plane, Building, Car, DollarSign } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: any) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    // Contact Info
    name: '',
    passengers: '',
    adults: '',
    children: '',
    email: '',
    contactNumber: '',
    agent: '',
    
    // Credit Card
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    
    // Flights
    departureCity: '',
    arrivalCity: '',
    departureDate: '',
    returnDate: '',
    flightClass: 'economy',
    
    // Hotels
    hotelName: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
    
    // Visa
    visaType: 'umrah',
    passportNumber: '',
    nationality: '',
    
    // Transportation
    transportType: 'bus',
    pickupLocation: '',
    
    // Costing
    packagePrice: '',
    additionalServices: '',
    totalAmount: '',
    paymentMethod: 'credit_card'
  });

  const steps = [
    { id: 'contact', title: 'Contact Info', icon: User },
    { id: 'credit', title: 'Credit Card', icon: CreditCard },
    { id: 'flights', title: 'Flights', icon: Plane },
    { id: 'hotels', title: 'Hotels', icon: Building },
    { id: 'visa', title: 'Visa(s)', icon: MapPin },
    { id: 'transport', title: 'Transportation', icon: Car },
    { id: 'costing', title: 'Costing', icon: DollarSign }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};
    const step = steps[stepIndex];
    
    switch (step.id) {
      case 'contact':
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
        if (!formData.passengers.trim()) newErrors.passengers = 'Number of passengers is required';
        break;
      case 'credit':
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
        if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
        if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
        break;
      case 'flights':
        if (!formData.departureCity.trim()) newErrors.departureCity = 'Departure city is required';
        if (!formData.arrivalCity.trim()) newErrors.arrivalCity = 'Arrival city is required';
        if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
        if (!formData.returnDate) newErrors.returnDate = 'Return date is required';
        break;
      case 'costing':
        if (!formData.totalAmount.trim()) newErrors.totalAmount = 'Total amount is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        name: '', passengers: '', adults: '', children: '', email: '', contactNumber: '', agent: '',
        cardNumber: '', expiryDate: '', cvv: '', cardholderName: '',
        departureCity: '', arrivalCity: '', departureDate: '', returnDate: '', flightClass: 'economy',
        hotelName: '', roomType: '', checkIn: '', checkOut: '',
        visaType: 'umrah', passportNumber: '', nationality: '',
        transportType: 'bus', pickupLocation: '',
        packagePrice: '', additionalServices: '', totalAmount: '', paymentMethod: 'credit_card'
      });
      setCurrentStep(0);
      setErrors({});
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'contact':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter Name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Number of Passengers</label>
                <input
                  type="number"
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.passengers ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter Number of Passengers"
                />
                {errors.passengers && <p className="text-red-500 text-xs mt-1">{errors.passengers}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How many Adults?</label>
                <input
                  type="number"
                  name="adults"
                  value={formData.adults}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="How many Adults?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How many Child?</label>
                <input
                  type="number"
                  name="children"
                  value={formData.children}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="How many Child?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter Email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.contactNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter Contact Number"
                />
                {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Agent:</label>
              <select
                name="agent"
                value={formData.agent}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Agent</option>
                <option value="ali">Ali Rahman</option>
                <option value="sara">Sara Khan</option>
                <option value="ahmed">Ahmed Malik</option>
              </select>
            </div>
          </div>
        );

      case 'credit':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Card Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.cardNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="1234 5678 9012 3456"
                />
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.expiryDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="MM/YY"
                />
                {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.cvv ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="123"
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.cardholderName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="John Doe"
                />
                {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
              </div>
            </div>
          </div>
        );

      case 'flights':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure City</label>
                <input
                  type="text"
                  name="departureCity"
                  value={formData.departureCity}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.departureCity ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Departure City"
                />
                {errors.departureCity && <p className="text-red-500 text-xs mt-1">{errors.departureCity}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arrival City</label>
                <input
                  type="text"
                  name="arrivalCity"
                  value={formData.arrivalCity}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.arrivalCity ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Arrival City"
                />
                {errors.arrivalCity && <p className="text-red-500 text-xs mt-1">{errors.arrivalCity}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.departureDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.departureDate && <p className="text-red-500 text-xs mt-1">{errors.departureDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.returnDate ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.returnDate && <p className="text-red-500 text-xs mt-1">{errors.returnDate}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Flight Class</label>
                <select
                  name="flightClass"
                  value={formData.flightClass}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'hotels':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
                <input
                  type="text"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Hotel Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Room Type</option>
                  <option value="single">Single Room</option>
                  <option value="double">Double Room</option>
                  <option value="triple">Triple Room</option>
                  <option value="quad">Quad Room</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        );

      case 'visa':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visa Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visa Type</label>
                <select
                  name="visaType"
                  value={formData.visaType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="umrah">Umrah Visa</option>
                  <option value="hajj">Hajj Visa</option>
                  <option value="tourist">Tourist Visa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Passport Number"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Nationality"
                />
              </div>
            </div>
          </div>
        );

      case 'transport':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transportation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transport Type</label>
                <select
                  name="transportType"
                  value={formData.transportType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="bus">Bus</option>
                  <option value="car">Private Car</option>
                  <option value="van">Van</option>
                  <option value="taxi">Taxi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Pickup Location"
                />
              </div>
            </div>
          </div>
        );

      case 'costing':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Costing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Price</label>
                <input
                  type="number"
                  name="packagePrice"
                  value={formData.packagePrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Package Price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border-b focus:outline-none transition-colors ${
                    errors.totalAmount ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Total Amount"
                />
                {errors.totalAmount && <p className="text-red-500 text-xs mt-1">{errors.totalAmount}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Services</label>
                <textarea
                  name="additionalServices"
                  value={formData.additionalServices}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional Services"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="installments">Installments</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold">Create New Booking</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Step Navigation */}
          <div className="mt-4 sm:mt-6">
            <div className="flex flex-wrap gap-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-green-500 text-white'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-500 text-blue-100 hover:bg-blue-400'
                    }`}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            {currentStep === steps.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Booking
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;