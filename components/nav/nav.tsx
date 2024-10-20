import {  MapPin} from 'lucide-react'
import Logo from './logo';
// import { Input } from '../ui/input'

const Nav = () => {
    return (
        <header className="sticky p-4 flex top-0 bg-white z-10 shadow-sm  justify-between">
               <Logo/>
        <div className="flex items-center ">
         
          <MapPin className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-sm font-medium">Kazhakkootum</span>
        </div>
        {/* <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input type="text" placeholder="Search Store" className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100" />
          </div>
        </div> */}
      </header>
    )
}
export default Nav;



  