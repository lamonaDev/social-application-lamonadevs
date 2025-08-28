import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HeroUIProvider } from "@heroui/react";
import UserAuthContext from './context/UserAuth.jsx';
import {Toaster} from 'react-hot-toast'
import DarkVeil from './components/ui/Background/Background.jsx';
import { QueryClient, QueryClientProvider, useQuery, } from "@tanstack/react-query";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <HeroUIProvider>
    <UserAuthContext>
      <Toaster />
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </UserAuthContext>
  </HeroUIProvider>
);
