import React, { useState } from 'react';
import ProjectCards from './ProjectCards';

const CardGrid = ({ projects }) => {
    const [flipped, setFlipped] = useState({}); // track side

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
                    tags={project.tags.join(' #')}
                    description={project.description}
                    onFlip={() => handleFlip(project.id)}
                />
            ))}
        </div>
    );
};

export default CardGrid;