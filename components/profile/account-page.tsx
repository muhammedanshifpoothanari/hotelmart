'use client'
import {  LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Footer from '../footer/footer'
import Nav from '../nav/nav'
import OrderList from '../order-list'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'




export default function Account() {
    // Suppress TypeScript warning by allowing 'any' type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.auth);
  const [number,setMobile] = useState(0);
  useEffect(() => {
    setMobile(user.mobileNumber)
  },[])

  return (
    <div className="flex flex-col h-screen bg-gray-100">
        <Nav/>
      <main className="flex-1 overflow-auto">
        <div className="bg-white p-6 flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Afsar Hossen" />
            <AvatarFallback>AH</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">Mobile:{number}</h2>
            {/* <p className="text-sm text-gray-500">Imshuvo97@gmail.com</p> */}
          </div>
        </div>

        <div className="mt-6">
          <OrderList/>
        </div>

        <div className="p-6">
          <Button variant="outline" className="w-full py-6 text-green-600 border-green-600">
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </Button>
        </div>
      </main>

  <Footer/>
    </div>
  )
}