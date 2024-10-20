'use client';
import { useState } from 'react';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Footer from '../footer/footer';
import Nav from '../nav/nav';
import { useRouter } from 'next/navigation';

// Define the types for the product
interface Product {
  _id: string;
  productName: string;
  productImage: string;
  price: string;
  quantity: number;
}

interface ProductListProps {
  products: Product[];
  name: string;
}

export default function ProductList({ products, name }: ProductListProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'bestSeller' | 'offer' | 'lowToHigh' | 'highToLow' | ''>(''); // Type for sorting

  // Toggle dropdown visibility
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle sorting by price
  const handleSort = (order: 'bestSeller' | 'offer' | 'lowToHigh' | 'highToLow') => {
    setSortOrder(order);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  // Function to get sorted products
  const getSortedProducts = (products: Product[]) => {
    if (sortOrder === 'lowToHigh') {
      return [...products].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
    if (sortOrder === 'highToLow') {
      return [...products].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    return products; // No sorting
  };

  // Get sorted products
  const sortedProducts = getSortedProducts(products);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Nav />
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="flex items-center justify-between p-4">
          <button className="p-2" onClick={() => router.push('/explore')}>
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-semibold">{name}</h1> {/* Dynamic title */}
          <button className="p-2" onClick={handleDropdownToggle}>
            <SlidersHorizontal className="w-6 h-6 text-gray-800" />
          </button>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-4 top-16 bg-white shadow-lg rounded-md p-2 z-20">
              <button className="block w-full text-left p-2 hover:bg-gray-100" onClick={() => handleSort('bestSeller')}>
                Best Seller
              </button>
              <button className="block w-full text-left p-2 hover:bg-gray-100" onClick={() => handleSort('offer')}>
                Offer
              </button>
              <div className="border-t my-2"></div>
              <button className="block w-full text-left p-2 hover:bg-gray-100" onClick={() => handleSort('lowToHigh')}>
                Price: Low to High
              </button>
              <button className="block w-full text-left p-2 hover:bg-gray-100" onClick={() => handleSort('highToLow')}>
                Price: High to Low
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {sortedProducts.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded-lg shadow-sm" onClick={() => router.push(`/productDetails?id=${product._id}`)}>
                <img 
                  src={`https://res.cloudinary.com/diwhddwig/image/upload/f_auto,q_auto/${product?.productImage}` || '/placeholder.svg?height=100&width=100'} 
                  alt={product.productName} 
                  className="w-full h-24 object-cover rounded-lg mb-2" 
                />
                <h3 className="text-sm font-medium">{product.productName}</h3>
                <p className="text-xs text-gray-500">{product.quantity} available</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold">₹{product.price}</span> {/* Added currency symbol */}
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 p-0 flex items-center justify-center">
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
