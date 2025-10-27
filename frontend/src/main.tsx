import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import "./i18n"
import 'leaflet/dist/leaflet.css';


createRoot(document.getElementById('root')!).render(
  
  <BrowserRouter>
    <App />
  </BrowserRouter>
 
)
