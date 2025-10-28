import React, { useState } from 'react';
import ProjectCards from './ProjectCards';

const CardGrid = ({ projects, userEmail, onDeleteProject }) => {
    const [flipped, setFlipped] = useState({});

    const handleFlip = (projectId) => {
        setFlipped((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
    };

    return (
        <div className="cards">
            {projects.map((project) => {
                const projectId = project._id?.toString();
                return (
                    <ProjectCards
                        key={projectId}
                        side={flipped[projectId] ? 'back' : 'front'}
                        projectId={projectId}
                        projectName={project.name}
                        tags={project.tags.map(tag => `#${tag}`).join(' ')}
                        description={project.description}
                        owner={project.owner}
                        checkedOutBy={project.checkedOutBy}
                        userEmail={userEmail}
                        onFlip={() => handleFlip(projectId)}
                        onDeleteProject={onDeleteProject}
                        members={project.members}
                    />
                );
            })}
        </div>
    );
};

export default CardGrid;
