import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../Session'

const AppNav = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
};

export default AppNav;