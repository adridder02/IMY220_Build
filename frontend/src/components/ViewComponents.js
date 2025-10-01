import React, { useState } from "react";
import { ActivityType1, ActivityType2, ActivityType3 } from "./Activities";
import { CheckInProject, EditProject } from "./ProjectForms";

export const ViewActivity = () => {
    const [activeView, setActiveView] = useState('hist');

    const toggleLeft = () => {
        if (activeView === "mem") {
            setActiveView("hist");
        } else {
            setActiveView("mem");
        }
    };

    return (
        <>
            <div className='bar'>

                <button className="memView" onClick={() => toggleLeft("mem")}>{activeView === "mem" ? "View History" : "View Members"}</button>
                <button className="graphView">Graph View</button>
            </div>

            <div className='leftSect'>
                {activeView === 'mem' && <ViewMembers />}
                {activeView === 'hist' && <ViewVersionHistory />}
            </div>

            <div className='rightSect'>
                <h3 className="heading3">Project Activity</h3>
                <div className="viewActivity">
                    <ActivityType1
                        user="USER"
                        action="checked in a project"
                        projectName="NAME"
                        timestamp="07/23/2025 8:30AM"
                    />
                    <ActivityType1
                        user="USER"
                        action="checked in a project"
                        projectName="NAME"
                        timestamp="07/23/2025 8:30AM"
                    />
                    <ActivityType1
                        user="USER"
                        action="checked in a project"
                        projectName="NAME"
                        timestamp="07/23/2025 8:30AM"
                    />
                    <ActivityType3
                        user="USER"
                        action="checked in a project"
                        projectName="NAME"
                        timestamp="07/23/2025 8:30AM"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
                    />
                </div>
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

export const ViewMembers = () => {
    return (
        <div className="viewMembers">
            <h3 className="heading3">Member List</h3>
            <div className="member">
                <img src="assets/img/placeholder.png" alt="userPfp" className="avatar" />
                <div className="userInfo">
                    <p>name</p>
                    <div className="hLine"></div>
                    <p>example@gmail.com</p>
                </div>
                <div className="vLine"></div>
                <button>View</button>
            </div>
            <div className="member">
                <img src="assets/img/placeholder.png" alt="userPfp" className="avatar" />
                <div className="userInfo">
                    <p>name</p>
                    <div className="hLine"></div>
                    <p>example@gmail.com</p>
                </div>
                <div className="vLine"></div>
                <button>View</button>
            </div>
            <div className="member">
                <img src="assets/img/placeholder.png" alt="userPfp" className="avatar" />
                <div className="userInfo">
                    <p>name</p>
                    <div className="hLine"></div>
                    <p>example@gmail.com</p>
                </div>
                <div className="vLine"></div>
                <button>View</button>
            </div>
        </div>
    );
};


export const ViewProject = ({ projectId }) => {
    const [activeView, setActiveView] = useState('file');

    const toggleRight = (view) => {
        setActiveView(view);
    };
    return (
        <>
            <div className='bar'>
                <h2>Project Name</h2>
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
                    <button>
                        readme.txt
                    </button>
                    <button>
                        server.js
                    </button>
                    <button>
                        index.html
                    </button>
                </div>
            </div>
            <div className='rightSect'>
                {activeView === 'checkin' && (
                    <CheckInProject
                        onClose={() => setActiveView("file")}
                    />
                )}
                {activeView === 'edit' && (
                    <EditProject
                        onClose={() => setActiveView("file")}
                    />
                )}
                {activeView === 'file' && (
                    <div className="fileDisplay">
                        <code className="fileLine">1 Example file</code>
                        <code className="fileLine">2 char title[50];</code>
                        <code className="fileLine">3 char isbn[13];</code>
                        <code className="fileLine">4 int quantity;</code>
                    </div>
                )}
            </div>
        </>
    );
};