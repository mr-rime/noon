import './index.css'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './app'

const initialProps = (window as any).__INITIAL_PROPS__ || {}

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <App {...initialProps} />
  </StrictMode>,
)
