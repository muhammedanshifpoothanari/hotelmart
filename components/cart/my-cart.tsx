'use client';
import { useState, useEffect } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CheckoutModal from './checkout-modal';
import Nav from '../nav/nav';
import Footer from '../footer/footer';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getUserCart, removeFromCart } from '@/lib/actions/user/user';

interface CartItem {
  _id: string;
  productName: string;
  quantity: number;
  price: number;
  productImage: string;
  totalStock: number; // Added total stock to the interface
}

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // Suppress TypeScript warning by allowing 'any' type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state:any) => state.auth); 
  useEffect(() => {
    if (!user.token) router.push('/otp');
  }, [user]);

  useEffect(() => {
    const fetchCart = async () => {
      const result = await getUserCart(user.token);
      if (result.success) {
        setCartItems(result.data);
      } else {
        console.error(result.error);
      }
    };

    fetchCart();
  }, [user.token]);

  const updateQuantity = async (item: CartItem, increment: number) => {
    const newQuantity = item.quantity + increment;

    // Check against total stock
    if (newQuantity < 1 || newQuantity > item.totalStock) return; // Prevent invalid quantities

    const updatedItem = { ...item, quantity: newQuantity };

    // Call an API to update the cart in the database here

    setCartItems((items) =>
      items.map((cartItem) =>
        cartItem._id === item._id ? updatedItem : cartItem
      )
    );
  };

  const removeItem = async (itemId: string) => {
    // Optimistically update the UI by removing the item locally
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCart);

    // Call your API to remove the item from the database
    try {
      const response = await removeFromCart(user.token, itemId);
      if (!response.success) {
        // Handle error: rollback UI change if the API fails
        setCartItems(cartItems); // Revert the UI back to original state
        console.error('Failed to remove item from cart:', response.error);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Error removing item from cart:', error);
      setCartItems(cartItems); // Revert the UI back to original state
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Nav />
      <header className="bg-white p-4 shadow">
        <h1 className="text-xl font-semibold text-center">My Cart</h1>
      </header>

      <main className="flex-1 overflow-auto p-4">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center bg-white p-4 mb-4 rounded-lg shadow">
            <img src={`https://res.cloudinary.com/diwhddwig/image/upload/f_auto,q_auto/${item?.productImage}`} alt={item.productName} className="w-20 h-20 object-cover mr-4" />
            <div className="flex-1">
              <h2 className="font-semibold">{item.productName}</h2>
              {item.totalStock}
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              <div className="flex items-center mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => updateQuantity(item, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-2">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => updateQuantity(item, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Button variant="ghost" size="icon" onClick={() => removeItem(item._id)}>
                <X className="h-4 w-4" />
              </Button>
              <span className="font-semibold mt-2">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </main>

      <footer className="bg-white p-4">
        <div className="flex justify-between">

        {total>0?<CheckoutModal total={total} cartItems={cartItems} userId={user.token}/>:            <span className="bg-white p-4 text-center">Please Add Product To Basket.</span>
      }
        </div>
      </footer>

      <Footer />
    </div>
  );
}

