import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';
import './accessibility.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<App />
			<Toaster
				position="bottom-right"
				dir="rtl"
				toastOptions={{
					style: {
						background: '#12121f',
						border: '1px solid rgba(255,255,255,0.08)',
						color: 'rgba(255,255,255,0.85)',
						fontFamily: 'Heebo, Inter, system-ui, sans-serif',
					},
				}}
			/>
		</BrowserRouter>
	</StrictMode>,
);

// Register service worker for PWA support (production only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch(() => {
			// SW registration failed — not critical, ignore silently
		});
	});
}
