/* eslint-disable */
"use client"
import { ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Footer from '../footer/footer'
import Nav from '../nav/nav'
import {getBannersFromDatabase} from "@/lib/actions/user/banner"
import {getProductsFromDatabaseForHomeScreen} from "@/lib/actions/user/products"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomeScreen() {
  const router = useRouter();
  const [banners, setBanners] = useState([{ title: 'jnk', linkUrl: '#',imageUrl:'',subtitle:'' }]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [offer, setOffer]  = useState<any>([]);
  const [bestSelling, setBestSelling]  = useState<any>([]);

  // Fetching banners from the database
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannerData = await getBannersFromDatabase();
        setBanners(bannerData.data);
        console.log('Banners:', bannerData);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    const fetchOffer = async () => {
      try {
        const offer = await getProductsFromDatabaseForHomeScreen();
        setOffer(offer?.data?.offerEndingProducts);
        setBestSelling(offer?.data?.bestSellingProducts);
        console.log('offer:', offer);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    

    fetchBanners();
    fetchOffer();
  }, []);

  // Change banner every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        banners.length > 0 ? (prevIndex + 1) % banners.length : 0
      );
    }, 3000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [banners]);

  // Handle banner click
  const handleBannerClick = () => {
    const currentBanner = banners[currentBannerIndex];
    if (currentBanner.linkUrl) {
      window.open(currentBanner.linkUrl, '_blank'); // Open the link in a new tab
    }
  };
 
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Nav/>
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* banner */}
          <section className="relative rounded-lg overflow-hidden" onClick={handleBannerClick}>
      <img
        src={`https://res.cloudinary.com/diwhddwig/image/upload/f_auto,q_auto/${banners[currentBannerIndex]?.imageUrl}` || '/placeholder.svg?height=150&width=400'} 
        alt={banners[currentBannerIndex]?.title || 'Placeholder'}
        className="w-full h-36 object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
        <div>
          <h2 className="text-white text-xl font-bold">{banners[currentBannerIndex]?.title}</h2>
          <p className="text-white text-sm">{banners[currentBannerIndex]?.subtitle || 'Get Up To 40% OFF'}</p>
        </div>
      </div>
    </section>

          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Exclusive Offer</h2>
              <Button variant="link" className="text-green-600" onClick={() => router.push(`/explore/productList?isOfferList=true`)}>
                See all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {offer.map((data:any,index:any) => {
                return(
                  <ProductCard id={data._id} key={index} name={data.productName} weight={`stock:${data.quantity}`} price={data.price} image={`https://res.cloudinary.com/diwhddwig/image/upload/f_auto,q_auto/${data?.productImage}` ||"/placeholder.svg?height=100&width=100"} />

                )
              })}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Best Selling</h2>
              <Button variant="link" className="text-green-600"   onClick={() => router.push(`/explore/productList?isBestSelling=true`)}
>
                See all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
            {bestSelling.map((data:any,index:any) => {
                return(
                  <>
                  <ProductCard id={data._id} key={index} name={data.productName} weight={`stock:${data.quantity}`} price={data.price} image={`https://res.cloudinary.com/diwhddwig/image/upload/f_auto,q_auto/${data?.productImage}` ||"/placeholder.svg?height=100&width=100"} />
                  </>
                )
              })}
            </div>
          </section>

          {/* <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Groceries</h2>
              <Button variant="link" className="text-green-600">
                See all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CategoryCard name="Pulses" image="/placeholder.svg?height=100&width=100" />
              <CategoryCard name="Rice" image="/placeholder.svg?height=100&width=100" />
              <ProductCard name="Beef Bone" weight="1kg" price="₹4.99" image="/placeholder.svg?height=100&width=100" />
              <ProductCard name="Broiler Chicken" weight="1kg" price="₹4.99" image="/placeholder.svg?height=100&width=100" />
            </div>
          </section> */}
        </div>
      </main>

     <Footer/>
    </div>
    
  )
}

interface ProductCardProps {
  name: string;
  weight: string;
  price: string;
  image: string;
  id: string;
}


function ProductCard({ name, weight, price, image,id='1' }:ProductCardProps) {
  const router = useRouter()
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm" onClick={() => router.push(`/productDetails?id=${id}`)}>
      <img src={image} alt={name} className="w-full h-24 object-cover rounded-lg mb-2" />
      <h3 className="text-sm font-medium">{name}</h3>
      <p className="text-xs text-gray-500">{weight}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm font-bold">₹{price}</span>
        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white rounded-full w-7 h-7 p-0 flex items-center justify-center" onClick={() => router.push('/id')}>
          +
        </Button>
      </div>
    </div>
  )
}

interface CategoryCardProps {
  name: string;
  image: string;
}
function CategoryCard({ name, image }:CategoryCardProps) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <img src={image} alt={name} className="w-full h-24 object-cover rounded-lg mb-2" />
      <h3 className="text-sm font-medium">{name}</h3>
    </div>
  )
}

