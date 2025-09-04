import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCards = ({ side = 'front', projectName, tags, description }) => {
    return (
        <div className="card">
            {side === 'front' ? (
                <div className='cardFront'>
                    <div className="projectImg">
                        <img src="assets/img/placeholder.png" alt="projectImg" />
                        <div className="imgAddon">
                            <button className="info" type="button">i</button>
                        </div>
                    </div>
                    <h3>{projectName}</h3>
                    <div className="tags">{tags}</div>
                    <p>{description}</p>
                    <button>
                        <Link to="/view">Go To Project</Link>
                    </button>
                    <button>Check In</button>
                </div>
            ) : (
                <div className='cardBack'>
                    <div className="projectImg">
                        <img src="assets/img/placeholder.png" alt="projectImg" />
                        <div className="imgAddon">
                            <button className="info" type="button">i</button>
                        </div>
                    </div>
                    <p>{description}</p>
                    <button>See Activity</button>
                    <button>Delete</button>
                </div>
            )}
        </div>
    );
};

export default ProjectCards;