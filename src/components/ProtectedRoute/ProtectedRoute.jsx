import { Navigate } from 'react-router-dom';

function ProtectedRoute({ component: Component, loggedIn, ...props }) {
  
  if (!loggedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <Component {...props} />;
}

export default ProtectedRoute;
