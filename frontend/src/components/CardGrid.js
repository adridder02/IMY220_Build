import React from 'react';
import ProjectCards from './ProjectCards';

const CardGrid = () => {
    return (
        <>
            <div className="cards">
                <ProjectCards
                    side="front"
                    projectName="Project Name"
                    tags="#tag #tag #tag #tag"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                />
                <ProjectCards
                    side="back"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                />
            </div>

        </>
    );

};

export default CardGrid;