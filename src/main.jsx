import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Landingpage from './landingPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Landingpage />
  </StrictMode>,
)
