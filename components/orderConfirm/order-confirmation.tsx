"use client"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactConfetti from "react-confetti"
import useWindowSize from "react-use/lib/useWindowSize"
import { useRouter } from "next/navigation"

export default function OrderSuccuss() {
  const router = useRouter();
  const { width, height } = useWindowSize()


    setTimeout(() => {
      router.push('/')
    }, 5000);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
        
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
      <ReactConfetti width={width} height={height} />

        <div className="p-8 flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-white" />
            </div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="w-2 h-2 bg-blue-400 rounded-full absolute top-2 right-2 animate-ping"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full absolute bottom-4 left-0 animate-ping delay-300"></div>
              <div className="w-8 h-1 bg-purple-400 rounded-full absolute top-1/2 -left-4 rotate-45"></div>
              <div className="w-8 h-1 bg-red-400 rounded-full absolute bottom-8 -right-4 -rotate-45"></div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Your Order has been accepted</h2>
            <p className="text-gray-600">Your items has been placed and is on it&apos;s way to being processed</p>
          </div>
          
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition-colors duration-300">
            Track Order
          </Button>
          
          <button className="text-gray-600 hover:text-gray-800 transition-colors duration-300" onClick={() => router.push('/')}>
            Back to home
          </button>
        </div>
      </div>
    </div>
  )
}