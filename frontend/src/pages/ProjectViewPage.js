import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import { Name, Type, Description, Tags, AddFiles, VersionHistory, Member } from '../components/FormComponents';

const ProjectViewPage = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!user) return;
      const response = await fetch(`/api/projects?email=${user.email}`);
      const projects = await response.json();
      const foundProject = projects.find((p) => p.id === parseInt(id));
      setProject(foundProject);
    };
    fetchProject();
  }, [id, user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="projectView">
      <h2>{project.name}</h2>
      <div className="projectDetails">
        <Name value={project.name} disabled />
        <Type value={project.type} disabled />
        <Description value={project.description} disabled />
        <Tags tags={project.tags} />
        <AddFiles files={project.files} />
        <VersionHistory versionHistory={project.versionHistory} />
        <div className="members">
          <h3>Members</h3>
          {project.members.map((member, index) => (
            <Member key={index} email={member.email} name={member.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectViewPage;