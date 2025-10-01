import React, { useState } from "react";
import Activities from "./Activities";
import { CheckInProject, EditProject } from "./ProjectForms";

export const ViewActivity = ({ project, activities = [] }) => {
    const [activeView, setActiveView] = useState('hist');

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
                {activeView === 'mem' && <ViewMembers members={project.members} />}
                {activeView === 'hist' && <ViewVersionHistory versionHistory={project.versionHistory} />}
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

export const ViewMembers = ({ members = [] }) => {
    if (members.length === 0) return <p>No members found</p>;

    return (
        <div className="viewMembers">
            <h3 className="heading3">Member List</h3>
            {members.map((member, idx) => (
                <div className="member" key={idx}>
                    <img
                        src="/assets/img/placeholder.png"
                        alt="userPfp"
                        className="avatar"
                    />
                    <div className="userInfo">
                        <p>{member.name}</p>
                        <div className="hLine"></div>
                        <p>{member.email}</p>
                    </div>
                    <div className="vLine"></div>
                    <button>View</button>
                </div>
            ))}
        </div>
    );
};
export const ViewProject = ({ project }) => {
    const [activeView, setActiveView] = useState('file');

    const toggleRight = (view) => {
        setActiveView(view);
    };

    return (
        <>
            <div className='bar'>
                <h2>{project.name}</h2>
                <div className="barButtons">
                    <button onClick={() => toggleRight("checkin")} className="checkIn accent">Check In</button>
                    <button>Dow</button>
                    <button>Chat</button>
                    <button onClick={() => toggleRight("edit")}>Edit</button>
                </div>
            </div>

            <div className='leftSect'>
                <h3 className="heading3">Files</h3>
                <div className="fileButtons">
                    {project.files.map((file, idx) => (
                        <button key={idx}>{file}</button>
                    ))}
                </div>
            </div>

            <div className='rightSect'>
                {activeView === 'checkin' && <CheckInProject onClose={() => setActiveView("file")} />}
                {activeView === 'edit' && <EditProject onClose={() => setActiveView("file")} />}
                {activeView === 'file' && (
                    <div className="fileDisplay">
                        {project.files.map((file, idx) => (
                            <code key={idx} className="fileLine">{`${idx + 1} ${file}`}</code>
                        ))}
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
