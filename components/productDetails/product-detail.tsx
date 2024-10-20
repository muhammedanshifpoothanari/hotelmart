'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Heart, Share2, Minus, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Nav from '../nav/nav';
import { getProductsFromDatabaseById } from '@/lib/actions/user/products';
import { useSelector } from 'react-redux';
import { addToCart, addToFavorites } from '@/lib/actions/user/user';
import Footer from '../footer/footer';

interface User {
    token: string | null;
}

interface Product {
    id: string;
    productName: string;
    productDescription: string;
    productImage: string;
    price: number;
    quantity: number;
}

const ProductDetail = () => {
  return (
      <Suspense fallback={<div>Loading...</div>}>
      <Product/>
      </Suspense>
  )
}

function Product() {
  const searchParams = useSearchParams();
    const router = useRouter();
    const user = useSelector((state: { auth: User }) => state.auth);

    useEffect(() => {
        if (!user.token) router.push('/otp');
    }, [user.token, router]); // Add user.token as dependency


    const id = searchParams.get('id');
    const [quantity, setQuantity] = useState<number>(1);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const incrementQuantity = () => {
        if (product && quantity < product.quantity) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decrementQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Ensure it does not go below 1
    };

    const fetchProductDetails = useCallback(async () => {
        if (id) {
            try {
                const response = await getProductsFromDatabaseById(id);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [id]); // Depend on 'id'

    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]); // Depend on 'fetchProductDetails'

    const shareProduct = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product?.productName,
                    text: product?.productDescription,
                    url: window.location.href,
                });
                console.log('Product shared successfully');
            } catch (error) {
                console.error('Error sharing product:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard! You can share it now.');
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
    };

    const handleBasket = async () => {
        if (!user.token) return; // Ensure user is authenticated
        if (!product) return; // Ensure product is not null
        const newProduct = { ...product, cartQuantity: quantity }; // Correctly destructure
        const response = await addToCart(user.token, newProduct);
        alert('Added to Cart✅');
        console.log('Add to cart response:', response);
    };

    const handleFavorite = async () => {
        if (!user.token) return; // Ensure user is authenticated
        if (!product) return; // Ensure product is not null
        const response = await addToFavorites(user.token, product);
        alert('Added to favorite ✅');
        console.log('Add to favorites response:', response);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>No product found.</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Nav />
            <header className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center">
                <button className="p-2" onClick={() => router.push('/explore')}>
                    <ArrowLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button className="p-2" onClick={shareProduct}>
                    <Share2 className="w-6 h-6 text-gray-800" />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                    <img
                        src={`https://res.cloudinary.com/diwhddwig/image/upload/f_auto,q_auto/${product.productImage}` || '/placeholder.svg?height=300&width=300&text=No+Image'}
                        alt={product.productName}
                        className="w-full h-64 object-cover rounded-lg"
                        width={640} 
                        height={256} 
                    />

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{product.productName}</h1>
                            <p className="text-sm text-gray-500">{product.quantity} available</p>
                        </div>
                        <button
                            onClick={() => {
                                setIsFavorite(!isFavorite);
                                handleFavorite(); // Trigger favorite action
                            }}
                            className={`p-2 rounded-full ${isFavorite ? 'bg-red-100' : 'bg-gray-100'}`}
                        >
                            <Heart className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                        </button>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={decrementQuantity}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                            >
                                <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="text-lg font-semibold">{quantity}</span>
                            <button
                                onClick={incrementQuantity}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                            >
                                <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">₹{product.price}</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="text-gray-800 font-semibold">Product Detail</span>
                        </div>
                        <p className="text-gray-600">{product.productDescription}</p>
                    </div>
                </div>
            </main>

            <footer className="p-4">
                <Button onClick={handleBasket} className="w-full">
                    Add to Cart
                </Button>
            </footer>
            <Footer />
        </div>
    );
}


export default ProductDetail;