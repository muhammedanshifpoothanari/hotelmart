// Modal.tsx
"use client"
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [otp, setOtp] = React.useState<string>('');

  const handleSubmit = () => {
    onSubmit(otp);
    onClose(); // Close modal after submitting
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg">
        <h2 className="text-lg font-bold">Enter OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mt-3 border border-gray-300 p-2 w-full"
        />
        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-gray-300 p-2 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
