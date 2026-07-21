import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/i18n'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    <Toaster position='top-right' reverseOrder={false}/>
    </BrowserRouter>
  </StrictMode>,
)
