'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getUserOrders } from '@/lib/actions/user/user'; // Import the getUserOrders function
import { Badge } from './ui/badge';

interface OrderItem {
  _id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string; // Changed id to _id to match your API response
  userId: string;
  orderDetails: {
    items: OrderItem[];
    total: number;
    location: string;
    mobileNumber: string;
    status:string;
    dispatched?: boolean; // Optional dispatched field
    isDelivered?: boolean; // Optional isDelivered field
  };

  createdAt: string;
}

const OrderList = () => {
  // Suppress TypeScript warning by allowing 'any' type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.auth);
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user.token) {
      router.push('/otp');
      return; // Exit early if the user is not logged in
    }

    const fetchOrders = async () => {
      const response = await getUserOrders(user.token); // Fetch orders using userId from token
      if (response.success) {
        console.log(response, 'responseresponse');

        setOrders(response.data); // Update the orders state with fetched data
      } else {
        console.error("Failed to fetch orders:", response.error);
      }
    };

    fetchOrders();
  }, [user.token, router]); // Add user.token to the dependency array

  const filteredOrders = orders.filter(order =>
    order.orderDetails.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Processing': return 'bg-blue-500';
      case 'Shipped': return 'bg-purple-500';
      case 'Delivered': return 'bg-green-500';
      case 'Dispatched': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push('/')}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold">Orders</h1>
      </header>
      <main className="p-4">
        <Input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {filteredOrders.map((order, index) => (
            <div key={order._id} className="bg-white rounded-lg shadow mb-4 overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">{index + 1}</h2>
                  <Badge className={getStatusColor(order.orderDetails.status || "Pending")}>
                    {order.orderDetails.status ? order.orderDetails.status : " dispatched"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Mobile: {order.orderDetails.mobileNumber}</p>
                <p className="text-sm text-gray-500">Location: {order.orderDetails.location}</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-4">
                    <span>View Details</span>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Items:</h3>
                    {order.orderDetails.items.map((item) => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span>{item.productName} x{item.quantity}</span>
                        <span>₹{item.price}</span>
                      </div>
                    ))}
                    <div className="mt-4 pt-2 border-t flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₹{order.orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </ScrollArea>
      </main>
    </div>
  );
};

export default OrderList;
