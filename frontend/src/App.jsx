import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import PrivateRoute from "./components/layout/PrivateRoute";
import AppLayout from "./components/layout/AppLayout";
import ClientesPage from "./pages/clientes/ClientesPage";

function Dashboard() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-2">Dashboard KORUS</h1>
      <p className="text-sm text-slate-600">
        Aquí iremos montando el panel con resumen de clientes, rutinas y ejercicios.
      </p>
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/login" element={<Login />} />

        {/* Privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
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

        {/* De momento rutinas/ejercicios serán placeholders */}
        <Route
          path="/rutinas"
          element={
            <PrivateRoute>
              <AppLayout>
                <h1 className="text-xl font-bold">Rutinas</h1>
                <p className="text-sm text-slate-600">
                  Aquí montaremos la gestión de rutinas.
                </p>
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/ejercicios"
          element={
            <PrivateRoute>
              <AppLayout>
                <h1 className="text-xl font-bold">Ejercicios</h1>
                <p className="text-sm text-slate-600">
                  Aquí montaremos el catálogo de ejercicios.
                </p>
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
