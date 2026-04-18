import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import SymptomInput from './pages/SymptomInput';
import PredictionResult from './pages/PredictionResult';
import SpecialistMap from './pages/SpecialistMap';
import MyReports from './pages/MyReports';
import ReportDetails from './pages/ReportDetails';
import Article from './pages/Article';
import ArticlesList from './pages/ArticlesList';
import About from './pages/About';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicRoute from './components/routing/PublicRoute';
import AdminRoute from './components/routing/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminDiseases from './pages/admin/AdminDiseases';
import AdminSymptoms from './pages/admin/AdminSymptoms';
import AdminArticles from './pages/admin/AdminArticles';
import AdminReports from './pages/admin/AdminReports';
import AdminUsers from './pages/admin/AdminUsers';
import { getMe } from './api/user';
import { setCredentials, logout } from './store/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const res = await getMe();
        if (res?.data) dispatch(setCredentials({ user: res.data }));
      } catch {
        dispatch(logout());
      }
    };
    bootstrap();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/symptoms" 
          element={
            <ProtectedRoute>
              <SymptomInput />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/me"
          element={
            <ProtectedRoute>
              <MyReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:id"
          element={
            <ProtectedRoute>
              <ReportDetails />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/prediction-result" 
          element={
            <ProtectedRoute>
              <PredictionResult />
            </ProtectedRoute>
          } 
        />
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/articles/:id" element={<Article />} />
        <Route path="/specialists" element={<SpecialistMap />} />
        <Route path="/about" element={<About />} />

        {/* Admin Panel */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="diseases" element={<AdminDiseases />} />
          <Route path="symptoms" element={<AdminSymptoms />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
