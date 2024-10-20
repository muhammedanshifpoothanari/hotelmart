'use client'
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Confetti from 'react-confetti';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useWindowSize from 'react-use/lib/useWindowSize';
import { useRouter } from 'next/navigation';
import { placeOrder } from '@/lib/actions/user/user'; 

interface CheckoutModalProps {
  total: number;
  cartItems: unknown[]; // Use the CartItem interface
  userId: string; // Assuming userId is a string
}

export default function CheckoutModal({ total, cartItems, userId }: CheckoutModalProps) {
  const router = useRouter();
  const [location, setLocation] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const { width, height } = useWindowSize();

  const handleUseCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await fetchAddressFromCoordinates(latitude, longitude);
          if (address) {
            setLocation(address);
          } else {
            alert("Could not fetch address. Please enter it manually.");
          }
        },
        (error) => {
          console.error(error);
          alert("Unable to fetch location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const fetchAddressFromCoordinates = async (lat: number, lon: number): Promise<string | null> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const data = await response.json();
      return data.display_name || null;
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    }
  };

  const handlePlaceOrder = async () => {
    if (!location || !mobileNumber) {
      alert("Please provide both location and mobile number for Cash on Delivery.");
      return;
    }
    
    const orderDetails = {
      items: cartItems,
      total,
      location,
      mobileNumber,
    };

    const result = await placeOrder(userId, orderDetails);
    
    if (result.success) {
      setOrderPlaced(true);
      router.push('/orderSuccess');
    } else {
      alert("Failed to place order: " + result.error);
    }
  };

  return (
    <>
      {orderPlaced && <Confetti width={width} height={height} />}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg gap-10">
            <span>Go to Checkout</span>
            <span className="font-semibold">Total: ₹{total?.toFixed(2)}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Checkout</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <CheckoutItem label="Payment Method" value={<span>Cash on Delivery (COD)</span>} />
            <div>
              <label className="block text-sm font-medium text-gray-700">Location (Delivery Address)</label>
              <input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-blue-500 mt-2"
                onClick={handleUseCurrentLocation}
              >
                Use current location
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <CheckoutItem label="Total Cost" value={total?.toFixed(2)} showDetail />
            <p className="text-xs text-gray-500">
              By placing an order, you agree to our{" "}
              <Button variant="link" className="p-0 h-auto text-xs text-blue-500">
                Terms And Conditions
              </Button>
            </p>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-6 rounded-lg text-lg"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CheckoutItem({
  label,
  value,
  showDetail = false,
}: {
  label: string;
  value: React.ReactNode;
  showDetail?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center">
        <span className="mr-2">{value}</span>
        {showDetail && <ChevronRight className="h-4 w-4 text-gray-400" />}
      </div>
    </div>
  );
}
