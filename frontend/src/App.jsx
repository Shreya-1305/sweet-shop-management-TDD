import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SweetProvider } from "./context/SweetContext";

// Pages
import LandingPage from "./pages/LandingPage";
import PurchasePage from "./pages/PurchasePage";
import AdminDashboard from "./pages/AdminDashboard";
import ErrorPage from "./components/ErrorPage";

// Protected wrappers
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
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
      <NotificationProvider>
        <SweetProvider>
          <RouterProvider
            router={router}
            future={{ v7_startTransition: true }}
          />
        </SweetProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
