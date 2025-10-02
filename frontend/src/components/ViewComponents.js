import React, { useState, useEffect, useContext } from "react";
import Activities from "./Activities";
import { Link } from "react-router-dom";
import { CheckInProject, EditProject } from "./ProjectForms";
import { UserContext } from "../Session";

export const ViewActivity = ({ project, activities = [] }) => {
    const { user } = useContext(UserContext);
    const [activeView, setActiveView] = useState('mem');
    const [projectMembers, setProjectMembers] = useState(project.members || []);

    if (!user) return <p>Please log in to view this project.</p>;

    const toggleLeft = () => {
        setActiveView(prev => (prev === "mem" ? "hist" : "mem"));
    };

    return (
        <>
            <div className='bar'>
                <button className="memView" onClick={toggleLeft}>
                    {activeView === "mem" ? "View History" : "View Members"}
                </button>
                <button className="graphView">Graph View</button>
            </div>

            <div className='leftSect'>
                {activeView === 'mem' && (
                    <ViewMembers
                        project={project}
                        members={projectMembers}
                        setMembers={setProjectMembers}
                        profileId={user.id}
                        currentUserId={user.id}
                    />
                )}
                {activeView === 'hist' && (
                    <ViewVersionHistory versionHistory={project.versionHistory} />
                )}
            </div>

            <div className='rightSect'>
                <h3 className="heading3">Project Activity</h3>
                <div className="viewActivity">
                    <Activities activities={activities} forProject={true} />
                </div>
            </div>
        </>
    );
};

export const ViewMembers = ({ members = [], setMembers, profileId, currentUserId, project, id }) => {
    const [memberInput, setMemberInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [friends, setFriends] = useState([]);

    const canEdit = profileId === currentUserId;

    useEffect(() => {
        if (!canEdit || !currentUserId) return;

        setLoading(true);
        fetch(`/api/users/${currentUserId}/friends`)
            .then(res => res.json())
            .then(data => setFriends(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [currentUserId, canEdit]);

    const handleInputChange = (e) => {
        if (!canEdit) return;

        const value = e.target.value;
        setMemberInput(value);

        if (!value) {
            setSuggestions([]);
            return;
        }

        const filtered = (friends || []).filter(
            f =>
                !members.some(m => m.id === f.id) &&
                (`${f.firstName} ${f.lastName}`.toLowerCase().includes(value.toLowerCase()) ||
                    f.email.toLowerCase().includes(value.toLowerCase()))
        );

        setSuggestions(filtered);
    };

    const handleAddMember = async (friend) => {
        if (!project?.id) {
            console.error("Project ID missing");
            return;
        }

        try {
            const res = await fetch(`/api/projects/${project.id}/members`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: friend.email }),
            });
            if (!res.ok) throw new Error("Failed to add member");

            const data = await res.json();
            setMembers(data.project.members);
            setMemberInput("");  
            setSuggestions([]);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };



    return (
        <div className="viewMembers">
            <h3 className="heading3">Member List</h3>

            {canEdit && (
                <div className="memberInput">
                    <input
                        type="text"
                        placeholder="Add Members"
                        value={memberInput}
                        onChange={handleInputChange}
                    />
                </div>
            )}

            {loading && <p>Loading suggestions...</p>}

            {!loading && suggestions.length > 0 && canEdit && (
                <ul className="suggestionsList">
                    {suggestions.map(s => (
                        <li key={s.id} className="suggestionItem">
                            <span className="suggestionText">
                                {s.firstName} {s.lastName} ({s.email})
                            </span>
                            <button onClick={() => handleAddMember(s)}>Add</button>
                        </li>
                    ))}
                </ul>
            )}

            {members.map((member, idx) => (
                <div className="member" key={member.id ?? member.email ?? idx}>
                    <img
                        src={member.avatar || "/assets/img/placeholder.png"}
                        alt="userPfp"
                        className="avatar"
                    />
                    <div className="userInfo">
                        <p>{member.name || `${member.firstName} ${member.lastName}`}</p>
                        <div className="hLine"></div>
                        <p>{member.email}</p>
                    </div>
                    <div className="vLine"></div>
                    <button>
                        <Link to={`/profile/${member.id}`}>View</Link>
                    </button>
                </div>
            ))}

            {members.length === 0 && <p>No members found</p>}
        </div>
    );
};

export const ViewProject = ({ project, userEmail }) => {
    const [activeView, setActiveView] = useState("file");
    const [currentProject, setCurrentProject] = useState(project);
    const isOwnerOrMember =
        project.owner?.email === userEmail || project.members?.some(m => m.email === userEmail);

    const toggleRight = (view) => setActiveView(view);

    let checkButtonLabel;
    let checkButtonDisabled = false;

    if (currentProject.checkedOutBy) {
        if (currentProject.checkedOutBy.email === userEmail) {
            checkButtonLabel = "Check In";
        } else {
            checkButtonLabel = `Checked Out by ${currentProject.checkedOutBy.name}`;
            checkButtonDisabled = true;
        }
    } else {
        checkButtonLabel = "Check Out";
    }

    const handleCheckClick = async () => {
        if (!isOwnerOrMember) return;

        if (!currentProject.checkedOutBy) {
            try {
                const res = await fetch(`/api/projects/${currentProject.id}/checkout`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: userEmail }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to check out");
                setCurrentProject(data.project);
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        } else if (currentProject.checkedOutBy.email === userEmail) {
            setActiveView("checkin");
        }
    };

    const handleDownload = () => {
        window.open(`/api/projects/download-multiple/${currentProject.id}`, "_blank");
    };

    const handleChat = () => {
        toggleRight("chat");
    };


    return (
        <>
            <div className="bar">
                <h2>{currentProject.name}</h2>
                <div className="barButtons">
                    <button
                        className="checkIn accent"
                        onClick={handleCheckClick}
                        disabled={checkButtonDisabled || !isOwnerOrMember}
                        style={{
                            opacity: checkButtonDisabled || !isOwnerOrMember ? 0.5 : 1,
                            cursor: checkButtonDisabled || !isOwnerOrMember ? "not-allowed" : "pointer",
                        }}
                    >
                        {checkButtonLabel}
                    </button>
                    <button onClick={handleDownload}>Dow</button>
                    <button onClick={handleChat}>Chat</button>
                    {isOwnerOrMember && (
                        <button className="editButton" onClick={() => toggleRight("edit")}>
                            Edit
                        </button>
                    )}
                </div>
            </div>

            <div className="leftSect">
                <h3 className="heading3">Files</h3>
                <div className="fileButtons">
                    {currentProject.files.map((file, idx) => (
                        <button key={idx}>{file}</button>
                    ))}
                </div>
            </div>

            <div className="rightSect">
                {activeView === "checkin" && (
                    <CheckInProject
                        projectId={currentProject.id}
                        userEmail={userEmail}
                        onCheckIn={(updatedProject) => {
                            setCurrentProject(updatedProject);
                            setActiveView("file");
                        }}
                        onClose={() => setActiveView("file")}
                    />
                )}
                {activeView === "edit" && (
                    <EditProject
                        projectId={currentProject.id}
                        onClose={() => setActiveView("file")}
                    />
                )}
                {activeView === "chat" && (
                    <div>
                        Chat Panel
                        <button onClick={() => setActiveView("file")}>Close</button>
                    </div>
                )}
                {activeView === "file" && (
                    <div className="fileDisplay">
                        {currentProject.files.map((file, idx) => (
                            <code key={idx} className="fileLine">{`${idx + 1} ${file}`}</code>
                        ))}
                        <p>
                            Status:{" "}
                            {currentProject.checkedOutBy
                                ? `Checked out by ${currentProject.checkedOutBy.name}`
                                : "Available"}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};


export const ViewVersionHistory = ({ versionHistory }) => {
    const hasHistory = versionHistory && versionHistory.length > 0;

    return (
        <div>
            <h3 className="heading3">Version History</h3>
            <div className="versionHistory">
                {hasHistory ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Version</th>
                                <th>Date</th>
                                <th>Modified By</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {versionHistory.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.version}</td>
                                    <td>{entry.date}</td>
                                    <td>{entry.modifiedBy}</td>
                                    <td><button>&#8617;</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No current version history</p>
                )}
            </div>
        </div>
    );
};
