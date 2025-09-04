import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';

import SplashNav from './components/SplashNav';
import AppNav from './components/AppNav';
import Footer from './components/Footer';

import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProjectViewPage from './pages/ProjectViewPage';
import ProjectsPage from './pages/ProjectsPage';
import ProfilePage from './pages/ProfilePage';

// not logged
const SplashLayout = () => (
  <>
    <SplashNav />
    <Outlet />
    <Footer />
  </>
);

// logged
const AppLayout = () => (
  <>
    <AppNav />
    <Outlet />
    <Footer />
  </>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    document.body.id = location.pathname === '/' ? 'splash' : 
                      location.pathname === '/home' ? 'dash' : '';
  }, [location]);

  return (
    <div className="app-container">
      <Routes>
        {/* not logged */}
        <Route element={<SplashLayout />}>
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* logged */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/view" element={<ProjectViewPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* fallback because its been bitching at me */}
        <Route path="*" element={<div>404: Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;