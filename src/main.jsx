import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from "@/components/ui/provider"
// document.documentElement.classList.add("dark");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
        <App />
    </Provider>
    
  </StrictMode>,
)
