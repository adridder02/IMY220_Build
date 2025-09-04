import React from "react";
import { VersionHistory } from "./FormComponents";
import { ActivityType1, ActivityType2, ActivityType3 } from "./Activities";

export const ViewActivity = () => {
    return (
        <>
            <div className='bar'>
                <div>
                    Status
                </div>
                <button>Graph</button>
            </div>
            <div className='leftSect'>
                <VersionHistory />
            </div>
            <div className='rightSect'>
                <h3>Project Activity</h3>
                <div className="activity">
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

export const ViewProject = () => {
    return (
        <>
            <div className='bar'>
                <h2>Project Name</h2>
                <button>Check In</button>
                <button>Down</button>
                <button>Memb</button>
                <button>Chat</button>
                <button>Edit</button>
            </div>
            <div className='leftSect'>
                <h3>Files</h3>
                <p>readme.txt</p>
                <p>server.js</p>
                <p>index.html</p>
            </div>
            <div className='rightSect'>display file content here</div>
        </>
    );
};
