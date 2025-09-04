import React from 'react';
import { NavLink } from 'react-router-dom';

const AppNav = () => {
  return (
    <nav>
      <div>
        <NavLink to="/home" className={({ isActive }) => isActive ? 'active accent' : ''}>Home</NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active accent' : ''}>Profile</NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'active accent' : ''}>Projects</NavLink>
      </div>
      <div id="searchBar">
        <input type="text" placeholder="Search for..." />
      </div>
      <div>
        <NavLink to="/login" className={({ isActive }) => isActive ? 'active accent' : ''}>Logout</NavLink>
      </div>
    </nav>
  );
};

export default AppNav;