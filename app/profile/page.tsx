'use client'
import Account from "@/components/profile/account-page";
import Image from "next/image";

const Page = () => {
    const openWhatsApp = () => {
        const phoneNumber = +919995076948; 
    
      const message = "Hello from *HotelMart*! Your Can Chat here with our executives:" +``
      
        const whatsappURL = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(message);
        window.open(whatsappURL, "_blank");
      }
    return (
        <>
        <Account/>
        <div className="sticky bottom-20 right-3 w-full z-40">
        <Image
          src="/icons8-whatsapp.svg" 
          width={80} 
          height={80} 
          alt="WhatsApp Icon"
          onClick={openWhatsApp}
          className="absolute right-3 bottom-3 cursor-pointer"
        />
      </div>
      </>
    )
}

export default Page;