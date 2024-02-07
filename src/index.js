import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home.jsx";
import NoPage from "./pages/NoPage";
import Dashboard from "./pages/Dashboard.jsx";
import "./index.css";
import Login from "./pages/Login.jsx";
import { AuthProvider } from "./context/authContext.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CategoriesProvider from "./context/categoriesContext.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CategoriesProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NoPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </CategoriesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
