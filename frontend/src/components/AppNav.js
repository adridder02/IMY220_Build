import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../Session';

const AppNav = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      // search users
      const usersRes = await fetch(`/api/users?search=${encodeURIComponent(value)}`);
      const usersData = await usersRes.json();
      const userResults = usersData.map(u => ({ ...u, type: 'user' }));

      // search projects
      const projectsRes = await fetch(`/api/projects`);
      const projectsData = await projectsRes.json();
      const projectResults = projectsData
        .filter(p => p.name.toLowerCase().includes(value.toLowerCase()))
        .map(p => ({ ...p, type: 'project' }));

      setSuggestions([...userResults, ...projectResults]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item) => {
    if (item.type === 'user') {
      navigate(`/profile/${item.id}`);
    } else if (item.type === 'project') {
      navigate(`/projects/${item.id}`);
    }
    setSearchInput('');
    setSuggestions([]);
  };

  return (
    <nav>
      <div>
        <NavLink to="/home" className={({ isActive }) => isActive ? 'active accent' : ''}>Home</NavLink>
        {user && (
          <NavLink to={`/profile/${user.id}`} className={({ isActive }) => isActive ? 'active accent' : ''}>
            Profile
          </NavLink>
        )}
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'active accent' : ''}>Projects</NavLink>
      </div>

      <div id="searchBar">
        <input
          type="text"
          placeholder="Search for people or projects..."
          value={searchInput}
          onChange={handleInputChange}
        />
        {loading && <p>Loading...</p>}
        {suggestions.length > 0 && (
          <ul className="suggestionsList" >
            {suggestions.map(item => (
              <li key={item.id + item.type} className="suggestionItem">
                <span className="suggestionText">
                  {item.type === 'user'
                    ? `${item.firstName} ${item.lastName} (${item.email})`
                    : item.name
                  }
                </span>
                <button onClick={() => handleView(item)}>View</button>
              </li>
            ))}
          </ul>
        )}
      </div>


      <div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
};

export default AppNav;
