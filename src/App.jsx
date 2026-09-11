import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Customers from "./pages/Customers";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import Brand from "./pages/Brand";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>

          {/* Common Wrapper */}
          <Route element={<Layout />}>

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/orders" element={<Orders />} />

            
            <Route path="/customers" element={<Customers />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/products" element={<Products />} />
            <Route path="/settings" element={<Settings />} />

          </Route>

        </Route>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Unknown */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;