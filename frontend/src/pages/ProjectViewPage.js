import React, { useState } from 'react';
import './css/view.css';
import { ViewActivity, ViewProject } from '../components/ViewComponents';

const ProjectViewPage = () => {
    const [activeView, setActiveView] = useState('Proj');

    const handleButtonClick = (view) => {
        setActiveView(view);
    };

    return (
        <>
            <div className='view-container' id={activeView === 'Proj' ? 'project-view' : 'activity-view'}>
                <div className='menu'>
                    <h3>Menu</h3>
                    <button
                        className={activeView === 'Proj' ? 'active' : ''}
                        onClick={() => handleButtonClick('Proj')}
                    >
                        Proj
                    </button>
                    <button
                        className={activeView === 'Actv' ? 'active' : ''}
                        onClick={() => handleButtonClick('Actv')}
                    >
                        Actv
                    </button>
                    <div className='hLine'></div>
                    <button>Back</button>
                </div>
                {activeView === 'Proj' && <ViewProject />}
                {activeView === 'Actv' && <ViewActivity />}

            </div>
        </>
    );
};

export default ProjectViewPage;