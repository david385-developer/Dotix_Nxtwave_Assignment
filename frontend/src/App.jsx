import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import Dashboard from './pages/Dashboard';
import JobDetail from './pages/JobDetail';

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/jobs" element={<Dashboard />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}
