import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCards = ({
    side = 'front',
    projectId,
    projectName,
    owner,
    tags,
    description,
    onFlip,
    checkedOutBy,
    userEmail,
    onDeleteProject,
    members
}) => {
    const isOwner = owner?.email === userEmail;

    return (
        <div className="card">
            {side === 'front' ? (
                <div className="cardFront">
                    <div className="projectImg">
                        <img src="assets/img/placeholder.png" alt="projectImg" />
                        <div className="imgAddon">
                            <button className="info" type="button" onClick={onFlip}>i</button>
                        </div>
                    </div>
                    <h3>{projectName}</h3>
                    <div className="tags">{tags}</div>
                    <p>{description}</p>
                    <button>
                        <Link to={`/projects/${projectId}`}>Go to Project</Link>
                    </button>
                </div>
            ) : (
                <div className="cardBack">
                    <div className="projectImg">
                        <img src="assets/img/placeholder.png" alt="projectImg" />
                        <div className="imgAddon">
                            <button className="info" type="button" onClick={onFlip}>i</button>
                        </div>
                    </div>
                    <h2>Owned by: {owner?.name || "Unknown"}</h2>
                    <p>Checked Out By: {checkedOutBy ? checkedOutBy.name : "Available"}</p>
                    <button
                        onClick={() => window.open(`/api/projects/download-multiple/${projectId}`, "_blank")}
                    >
                        Download Project
                    </button>

                    <button
                        onClick={() => onDeleteProject(projectId)}
                        disabled={!isOwner}
                        style={{
                            opacity: isOwner ? 1 : 0.5,
                            cursor: isOwner ? "pointer" : "not-allowed"
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectCards;
