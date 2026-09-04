import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Products />} />
        </Route>

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/orders" replace />}
        />

        {/* Unknown Routes */}
        <Route
          path="*"
          element={<Navigate to="/orders" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;