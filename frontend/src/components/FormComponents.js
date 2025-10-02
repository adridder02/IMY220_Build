import React from 'react';

export const Name = ({ value, onChange }) => {
    return (
        <div>
            <label>Name</label>
            <input
                type="text"
                placeholder="Project Name"
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export const Type = ({ value, onChange }) => {
    return (
        <div>
            <label>Type</label>
            <div className="select-wrapper">
                <select value={value} onChange={onChange}>
                    <option value="Web App">Web App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="API">API</option>
                </select>
            </div>
        </div>
    );
};

export const Description = ({ value, onChange }) => {
    return (
        <div>
            <label>Description</label>
            <textarea
                placeholder="Describe your Project"
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export const Tags = ({ tags, onAddTag }) => {
    const [tagInput, setTagInput] = React.useState('');

    const handleAdd = () => {
        if (tagInput.trim()) {
            onAddTag(tagInput.trim());
            setTagInput('');
        }
    };

    return (
        <div>
            <label>Tags</label>
            <div className="tags">
                <div className="tagInput">
                    <input
                        type="text"
                        placeholder="eg. Python"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                    />
                    <button type="button" onClick={handleAdd}>+</button>
                </div>
                <div className="tagList">
                    {tags.map((tag, index) => (
                        <p key={index}>#{tag}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const AddFiles = ({ files, onAddFile }) => {
    const [fileInput, setFileInput] = React.useState('');

    const handleAdd = () => {
        if (fileInput.trim()) {
            onAddFile(fileInput.trim());
            setFileInput('');
        }
    };

    return (
        <div>
            <label>Add Files</label>
            <div className="addFiles">
                <div className="fileInput">
                    <input
                        type="text"
                        placeholder="eg. readme.txt"
                        value={fileInput}
                        onChange={(e) => setFileInput(e.target.value)}
                    />
                    <button type="button" onClick={handleAdd}>+</button>
                </div>

                <div className="uploadButton">
                    <label>
                        Upload File
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) onAddFile(file);
                            }}
                        />
                    </label>
                    <img src="/assets/img/placeholder.png" alt="UploadFile Symbol" />
                </div>

                <div className="fileList">
                    {files.map((file, index) => (
                        <p key={index}>{file.name || file}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};



export const Version = ({ value, onChange }) => {
    return (
        <div className="version">
            <label>Version</label>
            <input type="text" value={value} onChange={onChange} />
        </div>
    );
};

export const Member = ({ email, name }) => {
    return (
        <div className="member">
            <img src="/assets/img/placeholder.png" alt="userPfp" className="avatar" />
            <div className="userInfo">
                <p>{name}</p>
                <div className="hLine"></div>
                <p>{email}</p>
            </div>
            <div className="vLine"></div>
            <button className='removeMember'>-</button>
        </div>
    );
};

export const ManageMembers = ({ members, onPromote }) => {
    const handlePromote = () => {
    };

    return (
        <div>
            <label>Manage Members</label>
            <div className="members">
                <div className="memberInput">
                    <input
                        type="text"
                        placeholder="New Owner"
                    />
                    <button type="button" onClick={handlePromote}>&#x2713;</button>
                </div>
                <div className="memberList">
                    {members.map((email, index) => (
                        <Member key={index} email={email} name={email.split('@')[0]} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export const VersionHistory = ({ versionHistory }) => {
    return (
        <div>
            <label>Version History</label>
            <div className="versionHistory">
                <table>
                    <tr>
                        <th>Version</th>
                        <th>Date</th>
                        <th>Modified By</th>
                        <th></th>
                    </tr>
                    {(versionHistory || []).map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.version}</td>
                            <td>{entry.date}</td>
                            <td>{entry.modifiedBy}</td>
                            <td><button>&#8617;</button></td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    );
};