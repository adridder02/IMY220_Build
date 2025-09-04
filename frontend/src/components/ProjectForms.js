import React from 'react';
import { AddFiles, Description, ManageMembers, Name, Tags, Type, Version, VersionHistory } from './FormComponents';

export const CreateProject = ({ onClose }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO form submission api thingies here later
        console.log('Form submitted');
        onClose();
    };

    return (
        <div className="popup createForm">
            <div className="form">
                <div className="formHeader">
                    <h2 className="heading2">New Project</h2>
                    <div className="close" onClick={onClose}>
                        X
                    </div>
                </div>
                <div className="timestamp">01:29 PM - 9/02/2025</div>
                <div className="uploadArea">
                    <p>Drag and drop or click here to upload your image (max 2 MiB)</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="formContent">
                        <div className="leftCol">
                            <Name />
                            <Type />
                            <Description />
                            <Tags />
                        </div>
                        <div className="rightCol">
                            <AddFiles />
                            <Version />
                        </div>
                    </div>
                    <div id="buttonContainer">
                        <button type="submit" className="submit">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const EditProject = ({ onClose }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO form submission api thingies here later
        console.log('Form submitted');
        onClose();
    };

    return (
        <div className="popup editForm">
            <div className="form">
                <div className="formHeader">
                    <h2 className="heading2">Edit Project</h2>
                    <div className="close" onClick={onClose}>
                        X
                    </div>
                </div>
                <div className="timestamp">01:29 PM - 9/02/2025</div>
                <div className="uploadArea">
                    <p>Drag and drop or click here to upload your image (max 2 MiB)</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="formContent">
                        <div className="leftCol">
                            <Name />
                            <Type />
                            <Description />
                            <Tags />
                            <ManageMembers />
                        </div>
                        <div className="rightCol">
                            <AddFiles />
                            <VersionHistory />
                            <Version />
                        </div>
                    </div>
                    <div id="buttonContainer">
                        <button>Delete</button>
                        <button type="submit" className="submit">
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const CheckInProject = ({ onClose }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO form submission api thingies here later
        console.log('Form submitted');
        onClose();
    };

    return (
        <div className="popup checkInForm">
            <div className="form">
                <div className="formHeader">
                    <h2 className="heading2">Check In Project</h2>
                    <div className="close" onClick={onClose}>
                        X
                    </div>
                </div>
                <div className="timestamp">01:29 PM - 9/02/2025</div>
                <div className="uploadArea">
                    <p>Drag and drop or click here to upload your image (max 2 MiB)</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="formContent">
                        <div className="leftCol">
                            <Description />
                            <Version />
                        </div>
                        <div className="rightCol">
                            <AddFiles />
                        </div>
                    </div>
                    <div id="buttonContainer">
                        <button type="submit" className="submit">
                            Check In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};