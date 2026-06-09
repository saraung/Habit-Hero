import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={28} className="text-indigo-400" />
        </div>
        <h1 className="text-5xl font-bold text-slate-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-600 mb-3">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button variant="primary" onClick={() => navigate('/')}>
          <Home size={14} />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
