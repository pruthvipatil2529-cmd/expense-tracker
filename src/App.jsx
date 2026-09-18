import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useTransaction } from "./context/TransactionContext";
import { useAuth } from "./context/AuthContext";

// Import the new pages and navbar
import AdminDashboard from "./components/AdminDashboard";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { loading } = useTransaction();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div style={{ overflow: "hidden" }}>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <AdminRoleCheck>
                  <AdminDashboard />
                </AdminRoleCheck>
              </PrivateRoute>
            }
          />

          {/* User Routes inside MainLayout */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <UserRoleCheck>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/reports" element={<Reports />} />
                    </Routes>
                  </MainLayout>
                </UserRoleCheck>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// Helper: Redirects normal users away from Admin Dashboard
const AdminRoleCheck = ({ children }) => {
  const { currentUser } = useAuth();
  if (currentUser && currentUser.role !== 'admin') {
    return <Navigate to="/" />;
  }
  return children;
};

// Helper: Redirects Admins away from User Dashboard to Admin Dashboard
const UserRoleCheck = ({ children }) => {
  const { currentUser } = useAuth();
  if (currentUser && currentUser.role === 'admin') {
    return <Navigate to="/admin" />;
  }
  return children;
};

export default App;
