import React from 'react';
import { Link } from 'react-router-dom';


const ProjectCards = ({ side = 'front', projectName, tags, description, onFlip }) => {
    return (
        <div className="card">
            {side === 'front' ? (
                <div className="cardFront">
                    <div className="projectImg">
                        <img src="assets/img/placeholder.png" alt="projectImg" />
                        <div className="imgAddon">
                            <button className="info" type="button" onClick={onFlip}>
                                i
                            </button>
                        </div>
                    </div>
                    <h3>{projectName}</h3>
                    <div className="tags">{tags}</div>
                    <p>{description}</p>
                    <button>
                        <Link to="/view">Go to Project</Link>
                    </button>
                    <button>Check In</button>
                </div>
            ) : (
                <div className="cardBack">
                    <div className="projectImg">
                        <img src="assets/img/placeholder.png" alt="projectImg" />
                        <div className="imgAddon">
                            <button className="info" type="button" onClick={onFlip}>
                                i
                            </button>
                        </div>
                    </div>
                    <p>{description}</p>
                    <button>Delete</button>
                    <button>View Activties</button>
                </div>
            )}
        </div>
    );
};

export default ProjectCards;