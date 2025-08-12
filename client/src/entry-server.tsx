import { StrictMode } from 'react'
import { type RenderToPipeableStreamOptions, renderToPipeableStream } from 'react-dom/server'
import App from './app'
export function render(_url: string, reactOptions: RenderToPipeableStreamOptions, subdomain?: string | null) {
  console.log('render called with subdomain:', subdomain)

  return renderToPipeableStream(
    <StrictMode>
      <App subdomain={subdomain ?? null} />
    </StrictMode>,
    reactOptions,
  )
}
