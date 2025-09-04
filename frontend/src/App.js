
import React from 'react';
import { useEffect } from "react";
import {Routes, Route, useLocation } from 'react-router-dom';

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

function App() {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/") {
            document.body.id = "splash";
        } else if (location.pathname === "/home") {
            document.body.id = "dash";
        } else {
        }
    }, [location]);

    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <SplashNav />
                            <SplashPage />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <>
                            <SplashNav />
                            <LoginPage />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <>
                            <SplashNav />
                            <RegisterPage />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/home"
                    element={
                        <>
                            <AppNav />
                            <HomePage />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/projects"
                    element={
                        <>
                            <AppNav />
                            <ProjectsPage />
                            <Footer />
                        </>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;