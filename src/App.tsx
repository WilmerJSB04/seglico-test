import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, useAppSelector } from './store';
import { ThemeProvider } from './providers/theme-provider';
import Login from './pages/auth/login';
import MainLayout from './components/layout/main-layout';
import Dashboard from './pages/dashboard';
import Penalties from './pages/dashboard/penalties';
import CreatePenalty from './pages/dashboard/penalties/create';
import EditPenalty from './pages/dashboard/penalties/edit';
import { Toaster } from './components/ui/toaster'; 

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
        <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="penalties" element={<Penalties />} />
        <Route path="penalties/edit/:id" element={<EditPenalty />} />
        <Route path="penalties/create" element={<CreatePenalty />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="seglico-ui-theme">
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
