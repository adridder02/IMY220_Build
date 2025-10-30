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
    const fileInputRef = React.useRef();

    const handleAddTextFile = () => {
        if (fileInput.trim()) {
            onAddFile(fileInput.trim());
            setFileInput('');
        }
    };

    const handleFile = (file) => {
        if (!file) return;
        onAddFile(file);
    };

    const stop = e => { e.preventDefault(); e.stopPropagation(); };

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
                    <button type="button" onClick={handleAddTextFile}>+</button>
                </div>

                <div
                    className="uploadButton"
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={e => { stop(e); e.currentTarget.classList.add('drag'); }}
                    onDragLeave={e => { stop(e); e.currentTarget.classList.remove('drag'); }}
                    onDrop={e => {
                        stop(e);
                        e.currentTarget.classList.remove('drag');
                        const file = e.dataTransfer.files[0];
                        handleFile(file);
                    }}
                >
                    <label>
                        Upload File
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
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

export const Member = ({ member, isOwner, onPromote, onRemove }) => {
    return (
        <div className="member">
            <div className="userInfo">
                <p>{member.name || `${member.firstName} ${member.lastName}`}</p>
                <div className="hLine"></div>
                <p>{member.email}</p>
            </div>
            <div className="vLine"></div>
            {isOwner ? (
                <span className="ownerBadge">Owner</span>
            ) : (
                <div className="actions">
                    <button className="promoteMember" onClick={onPromote}>Promote</button>
                    <button className="removeMember" onClick={onRemove}>Remove</button>
                </div>
            )}
        </div>
    );
};

export const ManageMembers = ({ members = [], onRemove, onPromote }) => {
    if (!members || members.length === 0) {
        return (
            <div>
                <label>Manage Members</label>
                <div className="members">
                    <h3 className="heading3">Members</h3>
                    <p>No members found</p>
                </div>
            </div>
        );
    }

    const owner = members[0];
    const otherMembers = members.slice(1);

    return (
        <div>
            <label>Manage Members</label>
            <div className="members">
                <div className="memberOwner">
                    <Member
                        key={owner.email}
                        member={owner}
                        isOwner={true}
                        onPromote={() => { }}
                        onRemove={() => { }}
                    />
                </div>
                <div className="memberList">
                    {otherMembers.map((member) => (
                        <Member
                            key={member.email}
                            member={member}
                            isOwner={false}
                            onPromote={() => onPromote(member.email)}
                            onRemove={() => onRemove(member.email)}
                        />
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