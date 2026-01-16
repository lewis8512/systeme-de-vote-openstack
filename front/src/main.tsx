import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { ElectorProvider } from './contexts/ElectorContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ElectorProvider>
        <App />
      </ElectorProvider>
    </BrowserRouter>
  </StrictMode>,
)
