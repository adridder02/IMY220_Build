import React from 'react';

export const Name = () => {
    return (
        <div>
            <label>Name</label>
            <input type="text" placeholder="Project Name" />
        </div>
    );
};

export const Type = () => {
    return (
        <div>
            <label>Type</label>
            <div className="select-wrapper">
                <select>
                    <option value="Sort1">Type</option>
                    <option value="Sort2">Type</option>
                    <option value="Sort3">Type</option>
                </select>
            </div>
        </div>
    );
};

export const Description = () => {
    return (
        <div>
            <label>Description</label>
            <textarea placeholder="Describe your Project"></textarea>
        </div>
    );
};

export const Tags = () => {
    return (
        <div>
            <label>Tags</label>
            <div className="tags">
                <div className="tagInput">
                    <input type="text" placeholder="eg. Python" />
                    <button>+</button>
                </div>
                <div className="tagList">
                    <p>#Python</p>
                    <p>#Java</p>
                    <p>#C++</p>
                    <p>#Node</p>
                </div>
            </div>
        </div>
    );
};

export const AddFiles = () => {
    return (
        <div>
            <label>Add Files</label>
            <div className="addFiles">
                <div className="fileInput">
                    <input type="text" placeholder="eg. readme.txt" />
                    <button>+</button>
                </div>
                <div className="uploadButton">
                    <button>Upload File</button>
                    <img src="assets/img/placeholder.png" alt="UploadFile Symbol" />
                </div>
                <div className="fileList">
                    <p>server.js</p>
                    <p>index.html</p>
                    <p>styles.css</p>
                    <p>express.js</p>
                </div>
            </div>
        </div>
    );
};

export const Version = () => {
    return (
        <div className="version">
            <label>Version</label>
            <input type="text" defaultValue="0.0.0.0" />
        </div>
    );
};

export const Member = () => {
    return (
        <div className="member">
            <img src="assets/img/placeholder.png" alt="userPfp" className="avatar" />
            <div className="userInfo">
                <p>Name Surname</p>
                <div className="hLine"></div>
                <p>example@gmail.com</p>
            </div>
            <div className="vLine"></div>
            <button>Manage</button>
        </div>
    );
};

export const ManageMembers = () => {
    return (
        <div>
            <label>Manage Members</label>
            <div className="members">
                <div className="memberInput">
                    <input type="text" placeholder="Add Members" />
                    <button>+</button>
                </div>
                <div className="memberList">
                    <Member />
                    <Member />
                    <Member />
                </div>
            </div>
        </div>
    );
};

export const VersionHistory = () => {
    return (
        <div>
            <label>Version History</label>
            <div className="versionHistory">
                <table>
                    <tbody>
                        <tr>
                            <th>Version</th>
                            <th>Date</th>
                            <th>Modified By</th>
                            <th></th>
                        </tr>
                        <VersionHistoryRow />
                        <VersionHistoryRow />
                        <VersionHistoryRow />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const VersionHistoryRow = () => {
    return (
        <tr>
            <td>0.0.0.0</td>
            <td>07/26/25</td>
            <td>USER</td>
            <td><button>&#8617;</button></td>
        </tr>
    );
};
