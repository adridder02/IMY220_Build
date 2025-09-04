import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../Session';
import { AddFiles, Description, ManageMembers, Name, Tags, Type, Version, VersionHistory } from './FormComponents';

export const CreateProject = ({ onClose }) => {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Web App',
        description: '',
        tags: [],
        image: '',
        files: [],
        version: '0.0.0',
        members: [user?.email || 'user1@example.com'],
    });
    const [error, setError] = useState('');

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddTag = (tag) => {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    };

    const handleAddFile = (file) => {
        setFormData((prev) => ({ ...prev, files: [...prev.files, file] }));
    };

    const handleAddMember = (email) => {
        setFormData((prev) => ({ ...prev, members: [...prev.members, email] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create project');
            }
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="popup createForm">
            <div className="form">
                <div className="formHeader">
                    <h2 className="heading2">New Project</h2>
                    <div className="close" onClick={onClose}>X</div>
                </div>
                <div className="timestamp">{new Date().toLocaleString()}</div>
                <div className="uploadArea">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleInputChange('image', e.target.files[0]?.name || '')}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="formContent">
                        <div className="leftCol">
                            <Name value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                            <Type value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)} />
                            <Description value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                            <Tags tags={formData.tags} onAddTag={handleAddTag} />
                        </div>
                        <div className="rightCol">
                            <AddFiles files={formData.files} onAddFile={handleAddFile} />
                            <Version value={formData.version} onChange={(e) => handleInputChange('version', e.target.value)} />
                        </div>
                    </div>
                    <div id="buttonContainer">
                        <button onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const CheckInProject = ({ projectId, onClose }) => {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        description: '',
        version: '',
        files: [],
    });
    const [error, setError] = useState('');

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddFile = (file) => {
        setFormData((prev) => ({ ...prev, files: [...prev.files, file] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`/api/projects/${projectId}/checkin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userEmail: user.email }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to check in project');
            }
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="popup checkInForm">
            <div className="form">
                <div className="formHeader">
                    <h2 className="heading2">Check In Project</h2>
                    <div className="close" onClick={onClose}>X</div>
                </div>
                <div className="timestamp">{new Date().toLocaleString()}</div>
                <div className="uploadArea">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleInputChange('image', e.target.files[0]?.name || '')}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="formContent">
                        <div className="leftCol">
                            <Description value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                            <Version value={formData.version} onChange={(e) => handleInputChange('version', e.target.value)} />
                        </div>
                        <div className="rightCol">
                            <AddFiles files={formData.files} onAddFile={handleAddFile} />
                        </div>
                    </div>
                    <div id="buttonContainer">
                        <button onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit">Check In</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const EditProject = ({ projectId, onClose }) => {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Web App',
        description: '',
        tags: [],
        image: '',
        files: [],
        version: '0.0.0',
        members: [user?.email || 'user1@example.com'],
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${projectId}`);
                if (!response.ok) throw new Error('Failed to fetch project');
                const data = await response.json();
                setFormData({
                    name: data.name,
                    type: data.type,
                    description: data.description,
                    tags: data.tags,
                    image: data.image,
                    files: data.files,
                    version: data.version,
                    members: data.members.map((m) => m.email),
                });
            } catch (error) {
                console.error('Error fetching project:', error);
                setError(error.message);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddTag = (tag) => {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    };

    const handleAddFile = (file) => {
        setFormData((prev) => ({ ...prev, files: [...prev.files, file] }));
    };

    const handleAddMember = (email) => {
        setFormData((prev) => ({ ...prev, members: [...prev.members, email] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update project');
            }
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="popup editForm">
            <div className="form">
                <div className="formHeader">
                    <h2 className="heading2">Edit Project</h2>
                    <div className="close" onClick={onClose}>X</div>
                </div>
                <div className="timestamp">{new Date().toLocaleString()}</div>
                <div className="uploadArea">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleInputChange('image', e.target.files[0]?.name || '')}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="formContent">
                        <div className="leftCol">
                            <Name value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                            <Type value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)} />
                            <Description value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                            <Tags tags={formData.tags} onAddTag={handleAddTag} />
                        </div>
                        <div className="rightCol">
                            <AddFiles files={formData.files} onAddFile={handleAddFile} />
                            <Version value={formData.version} onChange={(e) => handleInputChange('version', e.target.value)} />
                            <ManageMembers members={formData.members} onAddMember={handleAddMember} />
                        </div>
                    </div>
                    <div id="buttonContainer">
                        <button onClick={onClose}>Cancel</button>
                        <button type="submit" className="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};