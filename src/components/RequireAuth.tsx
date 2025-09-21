import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateJwt } from '@/lib/parseJwt';


const RequireAuth = () => {
  const { auth }: any = useAuth();
  const location = useLocation();

  return auth?.accessToken && validateJwt(auth.accessToken) ? 
   (<Outlet />) : 
   (<Navigate to="/login" state={{ from: location }} replace />);
};

export default RequireAuth;
