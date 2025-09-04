import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CardGrid from '../components/CardGrid';
import { Sort } from '../components/GeneralComps';
import { CreateProject} from '../components/ProjectForms';

const ProjectsPage = () => {
    const [showPopup, setShowPopup] = useState(false);

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            {showPopup ? (<CreateProject onClose={handleClosePopup} />
            ) : (
                <div className="projects">
                    <div className="projectsBar">
                        <div className="projectButtons">
                            <button onClick={handleOpenPopup}>Create New</button>
                            <button className="selected">My Projects</button>
                            <button>All Projects</button>
                        </div>
                        <Sort />
                    </div>
                    <CardGrid />
                </div>
            )}
        </>
    );
};

export default ProjectsPage;