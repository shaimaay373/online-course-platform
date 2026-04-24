import { AuthProvider } from './context/AuthProvider';
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import { NotificationProvider } from './context/NotificationContext';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </AuthProvider>
);