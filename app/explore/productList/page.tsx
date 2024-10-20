'use client';
import ProductList from "@/components/productList/beverages-page";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getProductsByCriteria } from '@/lib/actions/user/category';


const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <ProductLists/>
        </Suspense>
    )
}
const ProductLists = () => {
  const searchParams = useSearchParams();
  
  // Extract query parameters
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const isBestSelling = searchParams.get('isBestSelling');
  const isOfferList = searchParams.get('isOfferList');

  // State to hold products data
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');

  // Fetch products from the backend on component mount or when searchParams change
  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProductsByCriteria({
        category,
        subcategory,
        isBestSelling: isBestSelling === 'true',
        isOfferList: isOfferList === 'true',
      });

      if (result && result.success) {
        setProducts(result.data);
      }
    };

    // Set the title dynamically based on query parameters
    const determineTitle = () => {
      if (isBestSelling === 'true') {
        setTitle('Best Selling');
      } else if (isOfferList === 'true') {
        setTitle('Offers');
      } else if (subcategory) {
        setTitle(subcategory);
      } else if (category) {
        setTitle(category);
      } else {
        setTitle('Products');
      }
    };

    determineTitle();
    fetchProducts();
  }, [category, subcategory, isBestSelling, isOfferList]);

  return (
    <div>
      <ProductList products={products} name={title} />
    </div>
  );
};

export default Page;
