import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import PurchasePage from "./pages/PurchasePage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./components/ErrorPage";

// Protected Route wrappers
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />, // basic login page
    errorElement: <ErrorPage />,
  },
  {
    path: "/purchase",
    element: (
      <ProtectedRoute>
        <PurchasePage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </AuthProvider>
  );
}

export default App;
