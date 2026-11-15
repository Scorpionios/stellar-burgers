import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '@services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = (location.state as Record<string, unknown>)?.from ?? { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return children;
};
