/* eslint-disable */

'use client'
import { ShoppingBag, Compass, ShoppingCart, Heart, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { setClickStateReducer } from '@/lib/redux/clickState/clickSlice';
import { useSelector, useDispatch } from "react-redux";
interface RootState {
  clickState: {
    clicked: string;
  };
}
export default function Footer() {
   

  
  const clickedState = useSelector((state: RootState) => state.clickState.clicked);
  
  return (
      <footer className="sticky bottom-0 bg-white border-t border-gray-200">
        <nav className="flex justify-between items-center px-6 py-2">
          <NavItem icon={ShoppingBag} label="Shop" isActive={clickedState == "/"?true:false} path="/"/>
          <NavItem icon={Compass} label="Explore" isActive={clickedState == "/explore"?true:false}  path="/explore"/>
          <NavItem icon={ShoppingCart} label="Cart" isActive={clickedState == "/cart"?true:false} path="/cart"/>
          <NavItem icon={Heart} label="Favourite" isActive={clickedState == "/favorite"?true:false} path="/favorite" />
          <NavItem icon={User} label="Account" isActive={clickedState == "/profile"?true:false} path="/profile" />
        </nav>
      </footer>
  )
}


function NavItem({ icon: Icon, label, path, isActive = false }: { icon: any, label: string, path: string, isActive: boolean }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const route = () => {
    dispatch(setClickStateReducer({ clicked: path }));
    router.push(path)
  }
  return (
    <button className="flex flex-col items-center" onClick={route}>
      <Icon className={`w-6 h-6 ${isActive ? 'text-green-500' : 'text-gray-500'}`} />
      <span className={`text-xs mt-1 ${isActive ? 'text-green-500' : 'text-gray-500'}`}>{label}</span>
    </button>
  )
}