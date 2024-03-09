import { createRoot } from 'react-dom/client'

import { App } from './app'

const root = createRoot(
  document.getElementById('root') as HTMLElement
)
// No strict mode to avoid double rendering lol
root.render(<App/>)
