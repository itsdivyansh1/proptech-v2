import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  // Check if a user is logged in by verifying token or state
  return localStorage.getItem("authToken") !== null;
};

// Protect routes that shouldn't be accessed by authenticated users
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    // Redirect logged-in users to home page or any other route
    return <Navigate to="/" />;
  }
  return children;
};

export default PublicRoute;
