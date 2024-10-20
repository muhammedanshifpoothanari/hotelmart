"use client"

import { Provider } from "react-redux";
import { Store } from "../lib/redux/store";

// Define props interface
interface ReduxProviderProps {
  children: React.ReactNode; // Specify the type for children
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={Store}>
      {children} 
    </Provider>
  );
}

export default ReduxProvider;
