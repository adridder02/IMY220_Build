import React from 'react';
import { NavLink } from 'react-router-dom';

const SplashNav = () => {
  return (
    <nav className="default-nav">
      <div >
        <NavLink to="/login" className={({isActive}) => isActive ? 'active' : " "}>Login</NavLink>
        <NavLink to="/register" className={({isActive}) => isActive ? 'active' : ""}>Register</NavLink>
      </div>
    </nav>
  );
};

export default SplashNav;