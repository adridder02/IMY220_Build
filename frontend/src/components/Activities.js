import React from 'react';

export const ActivityType1 = ({ user, action, projectName, timestamp }) => {
    return (
        <div className="ActivityType1">
            <img src="assets/img/placeholder.png" alt="userPfp" className="avatar" />
            <div className="text">
                <div className="title">
                    <p>{user}</p>
                    <p>{action}</p>
                    <p>{projectName}</p>
                </div>
                <p>{timestamp}</p>
            </div>
        </div>
    );
};

export const ActivityType2 = ({ user, action, projectName, timestamp, description, cardTitle, cardDescription }) => {
    return (
        <div className="ActivityType2">
            <div className="left">
                <ActivityType1 
                    user={user}
                    action={action}
                    projectName={projectName}
                    timestamp={timestamp}
                />
                <div className="info">
                    <div className="hLine"></div>
                    <p>{description}</p>
                </div>
            </div>
            <div className="vLine"></div>
            <div className="right">
                <div className="cardMini">
                    <img src="assets/img/placeholder.png" alt="projectImg" />
                    <div className="hLine"></div>
                    <h3>{cardTitle}</h3>
                    <p>{cardDescription}</p>
                </div>
            </div>
        </div>
    );
};

export const ActivityType3 = ({ user, action, projectName, timestamp, description }) => {
    return (
        <div className="ActivityType3">
            <div className="left">
                <ActivityType1 
                    user={user}
                    action={action}
                    projectName={projectName}
                    timestamp={timestamp}
                />
                <div className="info">
                    <div className="hLine"></div>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
};