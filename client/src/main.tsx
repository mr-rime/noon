import './styles/globals.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'

function getSubdomainFromHost() {
    const host = window.location.hostname;
    if (!host) return null;
    const parts = host.split(".");
    if (host.includes("localhost")) return parts.length > 1 ? parts[0] : null;
    return parts.length > 2 ? parts[0] : null;
}

const subdomain = getSubdomainFromHost();

createRoot(
    document.getElementById('root') as HTMLElement,
).render(
    <StrictMode>
        <App subdomain={subdomain} />
    </StrictMode>,
)
