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
    const isMember = owner?.email === userEmail || members?.some(m => m.email === userEmail);

    const handleCheck = async () => {
        if (!isMember) return;

        if (checkedOutBy && checkedOutBy.email === userEmail) {
            await fetch(`/api/projects/${projectId}/checkin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail }),
            });
        } else if (!checkedOutBy) {
            await fetch(`/api/projects/${projectId}/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail }),
            });
        }
        window.location.reload();
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok) {
                onDeleteProject(projectId);
            } else {
                console.error(data.error);
            }
        } catch (err) {
            console.error("Failed to delete project:", err);
        }
    };

    const buttonLabel = checkedOutBy
        ? (checkedOutBy.email === userEmail ? "Check In" : `Checked Out by ${checkedOutBy.name}`)
        : "Check Out";

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
                    <button
                        onClick={handleCheck}
                        disabled={!isMember || (checkedOutBy && checkedOutBy.email !== userEmail)}
                        style={{
                            opacity: !isMember || (checkedOutBy && checkedOutBy.email !== userEmail) ? 0.5 : 1,
                            cursor: !isMember || (checkedOutBy && checkedOutBy.email !== userEmail) ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {buttonLabel}
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
                    <p>Owned by: {owner?.name || "Unknown"}</p>
                    <p>Checked Out By: {checkedOutBy ? checkedOutBy.name : "Available"}</p>
                    <p>{description}</p>

                    <button
                        onClick={() => window.open(`/api/projects/download-multiple/${projectId}`, "_blank")}
                    >
                        Download Project
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={owner?.email !== userEmail}
                        style={{
                            opacity: owner?.email === userEmail ? 1 : 0.5,
                            cursor: owner?.email === userEmail ? "pointer" : "not-allowed"
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
