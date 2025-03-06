
import { createRoot } from 'react-dom/client'
import App from './web/App.tsx'
import './index.css'
import { ElectronProvider } from './contexts/ElectronContext'

createRoot(document.getElementById("root")!).render(
  <ElectronProvider>
    <App />
  </ElectronProvider>
);
