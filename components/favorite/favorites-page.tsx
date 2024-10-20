'use client';
import { useEffect, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Footer from '../footer/footer';
import Nav from '../nav/nav';
import { getUserFavorites, removeFromFavorites } from '@/lib/actions/user/user';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

interface FavoriteItem {
  _id: string;
  productImage: string;
  productName: string;
  quantity: number;
  price: number;
}

export default function Favorites() {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  
  // Suppress TypeScript warning by allowing 'any' type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.auth); // Consider creating a proper type for auth state
  const router = useRouter();

  useEffect(() => {
    if (!user.token) router.push('/otp');
  }, [user]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user.token) {
        console.error('User token is not available');
        return;
      }

      try {
        const response = await getUserFavorites(user.token);
        if (response.success) {
          setFavoriteItems(response.data);
        } else {
          console.error('Failed to fetch favorites:', response.error);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user.token]);

  const removeItem = async (itemId: string) => {
    const updatedFavorites = favoriteItems.filter((item) => item._id !== itemId);
    setFavoriteItems(updatedFavorites);

    // Call your API to remove the item from the database
    try {
      const response = await removeFromFavorites(user.token, itemId);
      if (!response.success) {
        // Handle error: rollback UI change if the API fails
        const itemToRestore = favoriteItems.find(item => item._id === itemId);
        if (itemToRestore) {
          setFavoriteItems((prev) => [...prev, itemToRestore]); // Revert the UI back to the original state
        }
        console.error('Failed to remove item from favorites:', response.error);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Error removing item from favorites:', error);
      const itemToRestore = favoriteItems.find(item => item._id === itemId);
      if (itemToRestore) {
        setFavoriteItems((prev) => [...prev, itemToRestore]); // Revert the UI back to the original state
      }
    }
  };

  const handleAddAllToCart = () => {
    // Logic to add all favorite items to the cart can be implemented here
    alert('All items added to cart!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Nav />
      <header className="sticky top-0 bg-white z-10 shadow-sm">
        <div className="p-4">
          <h1 className="text-xl font-semibold">Favorites</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-200">
          {favoriteItems.length === 0 ? (
            <li className="bg-white p-4 text-center">No favorite items found.</li>
          ) : (
            favoriteItems.map((item) => (
              <li key={item._id} className="bg-white">
                <div className="flex items-center p-4">
                  <img 
                    src={`https://res.cloudinary.com/diwhddwig/image/upload/f_auto,q_auto/${item.productImage}`} 
                    alt={item.productName} 
                    className="w-12 h-12 object-contain mr-4" 
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.productName}</h3>
                    <p className="text-xs text-gray-500">{item.quantity}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold mr-2">{item.price}</span>
                    <Button 
                      onClick={() => removeItem(item._id)} 
                      variant="link" 
                      className="text-red-500 hover:underline"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div onClick={() => router.push(`/productDetails?id=${item._id}`)}>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>     
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </main>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors duration-300"
          onClick={handleAddAllToCart}
        >
          Add All To Cart
        </Button>
      </div>

      <Footer />
    </div>
  );
}
