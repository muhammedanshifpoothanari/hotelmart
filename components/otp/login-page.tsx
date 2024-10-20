'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from '../footer/footer';
import { Button } from '../ui/button';
import Swal from 'sweetalert2';
import { setAuthReducer } from '@/lib/redux/auth/authSlice';
import { useRouter } from 'next/navigation';
import { getUserByPhoneNumber, registerUser, validatePassword } from '@/lib/actions/user/user';
import Logo from '../nav/logo';

interface UserCheckResponse {
  exists?: boolean;
}

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phone, setPhone] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null); 
  const [pin, setPin] = useState<string[]>(['', '', '', '']); 

  const checkRegistration = async () => {
    const response: UserCheckResponse = await getUserByPhoneNumber(phone);
    setIsRegistered(response.exists ?? false);
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1) { 
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < pin.length - 1) {
        document?.getElementById(`pin-${index + 1}`)?.focus();
      }
    }
  };

  const handleLogin = async () => {
    const enteredPin = pin.join('');
    
    if (isRegistered) {
      // Validate existing PIN
      const passwordResponse = await validatePassword(phone, enteredPin);

      if (passwordResponse.success) {
        dispatch(setAuthReducer({ token: passwordResponse.id, mobileNumber: phone }));
        Swal.fire({
          title: 'Login Successful!',
          text: 'Welcome back!',
          icon: 'success',
          confirmButtonText: 'Okay',
        });
        router.push('/explore'); 
      } else {
        // Clear the PIN input fields
        setPin(['', '', '', '']); // Resetting the PIN input fields

        Swal.fire({
          title: 'Error!',
          text: 'Invalid PIN. Please try again.',
          icon: 'error',
          confirmButtonText: 'Okay',
        });
      }
    } else {
      // Set new PIN
      const setPasswordResponse = await registerUser(phone, enteredPin); // Adjust for new user registration

      if (setPasswordResponse.success) {
        dispatch(setAuthReducer({ token: setPasswordResponse.id, mobileNumber: phone }));

        Swal.fire({
          title: 'PIN Set Successful!',
          text: 'You can now log in!',
          icon: 'success',
          confirmButtonText: 'Okay',
        });
        router.push('/explore'); 
      } else {
        // Clear the PIN input fields
        setPin(['', '', '', '']); // Resetting the PIN input fields

        Swal.fire({
          title: 'Error!',
          text: 'Failed to set PIN. Please try again.',
          icon: 'error',
          confirmButtonText: 'Okay',
        });
      }
    }
  };

  const handleNext = async () => {
    await checkRegistration();
    if (isRegistered !== null) {
      const pinInputs = document.querySelectorAll<HTMLInputElement>('.pin-input');
      pinInputs[0].focus();
    }
  };

  const openWhatsApp = () => {
    const phoneNumber = '+919995076948'; 
    const message = "Hello from *HotelMart*! You can chat here with our executives:";
    const whatsappURL = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(message);
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="relative flex-1">
        {/* <img
          src="/Group6806.svg?height=400&width=400"
          alt="Groceries"
          className="absolute inset-0 w-full h-full object-cover"
        /> */}
       <div
        className="h-[350px] w-full"
        style={{
          backgroundImage: 'url("/signGroup.svg")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
      </div>
      <div className="relative z-10 px-6 pb-8">
        <h1 className="text-3xl font-bold mb-8">
          Get your groceries with <Logo />
        </h1>
        {isRegistered === null ? (
          <>
            <div className="flex mb-4">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+91">🇮🇳 +91</SelectItem>
                  <SelectItem value="+1">🇺🇸 +1</SelectItem>
                  <SelectItem value="+44">🇬🇧 +44</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="number"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 ml-2 p-2 border-b-2 border-gray-300 focus:outline-none focus:border-green-500"
              />
            </div>
            <button onClick={handleNext} className="mb-4 bg-blue-600 text-white py-2 px-4 rounded">
              Next
            </button>
          </>
        ) : (
          <>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {isRegistered ? 'Enter your existing PIN:' : 'Set your new PIN:'}
              </label>
            </div>
            <div className="flex space-x-2 mb-4">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="number"
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  className="pin-input w-10 h-10 text-center border-b-2 border-gray-300 focus:outline-none focus:border-green-500"
                  maxLength={1}
                />
              ))}
            </div>
            <button onClick={handleLogin} className="mb-4 bg-blue-600 text-white py-2 px-4 rounded">
              Submit
            </button>
          </>
        )}
        <p className="text-sm text-gray-500 mb-4">Or chat with social media</p>
    
        <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white" onClick={openWhatsApp}>
          Continue with WhatsApp
        </Button>
      </div>
      <Footer />
    </div>
  );
}
