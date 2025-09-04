import React from 'react';


const ProjectCards = ({ side = 'front', projectName, tags, description }) => {
    return (
        <div className="card">
            {side === 'front' ? (
                <div className='cardFront'>
                    <div className="projectImg imgLink">
                        <div className="imgAddon">
                            <button className="info" type="button">i</button>
                        </div>
                    </div>
                    <h3>{projectName}</h3>
                    <div className="tags">{tags}</div>
                    <p>{description}</p>
                    <button>Go to Project</button>
                    <button>Check In</button>
                </div>
            ) : (
                <div className='cardBack'>
                    <div className="projectImg imgLink">
                        <div className="imgAddon">
                            <button className="info" type="button">i</button>
                        </div>
                    </div>
                    <p>{description}</p>
                    <button>Go to Project</button>
                    <button>Delete</button>
                </div>
            )}
        </div>
    );
};

export default ProjectCards;