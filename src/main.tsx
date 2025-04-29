
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Function to mount the micro-frontend
function mount(containerId: string, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id ${containerId} not found`);
    return;
  }
  
  const root = createRoot(container);
  root.render(<App {...options} />);
  
  return () => {
    root.unmount();
  };
}

// Auto-mount if in standalone mode
if (!window.microFrontendMounted) {
  mount('root');
}

// Export mount function for micro-frontend integration
export { mount };
