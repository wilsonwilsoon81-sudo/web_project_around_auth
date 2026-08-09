import { Navigate } from 'react-router-dom'; // ⚠️ La 'N' debe ser MAYÚSCULA

function ProtectedRoute({ component: Component, loggedIn, ...props }) {
  // Si NO está logueado, redirige a /sign-in
  if (!loggedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  
  // Si está logueado, renderiza el componente protegido
  return <Component {...props} />;
}

export default ProtectedRoute;
