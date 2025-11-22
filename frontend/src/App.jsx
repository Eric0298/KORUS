import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import PrivateRoute from "./components/layout/PrivateRoute";
import AppLayout from "./components/layout/AppLayout";

import ClientesPage from "./pages/clientes/ClientesPage";
import ClienteDetallePage from "./pages/clientes/ClienteDetallePage";
import RutinasPage from "./pages/rutinas/RutinasPage";
import RutinaDetallePage from "./pages/rutinas/RutinaDetallePage";
import EjerciciosPage from "./pages/ejercicios/EjerciciosPage";
import EjercicioDetallePage from "./pages/ejercicios/EjercicioDetallePage";
import DashboardPage from "./pages/dashboard/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/login" element={<Login />} />

        {/* Privadas con layout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <AppLayout>
                <ClientesPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <ClienteDetallePage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/rutinas"
          element={
            <PrivateRoute>
              <AppLayout>
                <RutinasPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
         <Route
          path="/rutinas/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <RutinaDetallePage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/ejercicios"
          element={
            <PrivateRoute>
              <AppLayout>
                <EjerciciosPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ejercicios/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <EjercicioDetallePage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
