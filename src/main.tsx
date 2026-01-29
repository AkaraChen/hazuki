import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'react-photo-album/masonry.css'
import 'yet-another-react-lightbox/styles.css'
import './index.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
