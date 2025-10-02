import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../Session';
import CardGrid from '../components/CardGrid';
import { Sort } from '../components/GeneralComps';
import { CreateProject } from '../components/ProjectForms';

const ProjectsPage = () => {
  const { user } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [projects, setProjects] = useState([]);
  const [scope, setScope] = useState('my');
  const [sort, setSort] = useState('name-asc');

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      const params = new URLSearchParams({ scope, sort });
      if (scope === 'my') params.append('email', user.email);
      const response = await fetch(`/api/projects?${params}`);
      const data = await response.json();
      setProjects(data);
    };
    fetchProjects();
  }, [scope, sort, user]);

  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  if (!user) return <div>Please log in to view projects.</div>;

  return (
    <>
      {showPopup ? (
        <CreateProject onClose={() => setShowPopup(false)} />
      ) : (
        <div className="projects">
          <div className="projectsBar">
            <div className="projectButtons">
              <button onClick={() => setShowPopup(true)}>Create New</button>
              <button
                className={scope === 'my' ? 'selected' : ''}
                onClick={() => setScope('my')}
              >
                My Projects
              </button>
              <button
                className={scope === 'all' ? 'selected' : ''}
                onClick={() => setScope('all')}
              >
                All Projects
              </button>
            </div>
            <Sort onChange={(e) => setSort(e.target.value)} />
          </div>
          <CardGrid
            projects={projects}
            userEmail={user.email}
            onDeleteProject={handleDeleteProject}
          />
        </div>
      )}
    </>
  );
};


export default ProjectsPage;