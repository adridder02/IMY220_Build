import React, { useState } from 'react';
import ProjectCards from './ProjectCards';

const CardGrid = ({ projects, userEmail, onDeleteProject }) => {
    const [flipped, setFlipped] = useState({});

    const handleFlip = (projectId) => {
        setFlipped((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
    };

    return (
        <div className="cards">
            {projects.map((project) => (
                <ProjectCards
                    key={project.id}
                    side={flipped[project.id] ? 'back' : 'front'}
                    projectId={project.id}
                    projectName={project.name}
                    tags={project.tags.map(tag => `#${tag}`).join(' ')}
                    description={project.description}
                    owner={project.owner}
                    checkedOutBy={project.checkedOutBy}
                    userEmail={userEmail}
                    onFlip={() => handleFlip(project.id)}
                    onDeleteProject={onDeleteProject}
                    members={project.members}
                />

            ))}
        </div>
    );
};

export default CardGrid;