import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../Session';
import { AddFiles, Description, ManageMembers, Name, Tags, Type, Version, VersionHistory } from './FormComponents';

export const CreateProject = ({ onClose, onProjectCreated }) => {
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

    const [imageFile, setImageFile] = useState(null);
    const [fileObjects, setFileObjects] = useState([]);
    const [error, setError] = useState('');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddTag = (tag) => {
        if (tag.trim() && !formData.tags.includes(tag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        }
    };

    const handleAddFile = (file) => {
        if (!file) return;
        setFormData(prev => ({ ...prev, files: [...prev.files, file.name || file] }));
        setFileObjects(prev => [...prev, file]);
    };

    const handleAddMember = (email) => {
        if (!email) return;
        setFormData(prev => ({ ...prev, members: [...prev.members, email] }));
    };

    // file upload functions
    const uploadImage = async (file) => {
        if (!file) return '';
        const form = new FormData();
        form.append('image', file);
        const res = await fetch('/api/projects/upload-image', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Image upload failed');
        return data.filename;
    };

    const uploadFiles = async (files) => {
        if (!files || files.length === 0) return [];
        const form = new FormData();
        files.forEach(f => form.append('files', f));
        const res = await fetch('/api/projects/upload-files', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Files upload failed');
        return data.files.map(f => f.filename);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.description || !formData.version) {
            setError('Name, description, and version are required');
            return;
        }

        try {
            const imageFilename = await uploadImage(imageFile);
            const uploadedFiles = await uploadFiles(fileObjects);
            const projectData = {
                ...formData,
                image: imageFilename,
                files: uploadedFiles
            };

            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create project');

            if (onProjectCreated) onProjectCreated(data.project);
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
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="uploadArea">
                    <label>Project Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setImageFile(file);
                                handleInputChange('image', file.name);
                            }
                        }}
                    />
                    {formData.image && <p>{formData.image}</p>}
                </div>

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
                        <button type="submit" className="submit">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const CheckInProject = ({ projectId, userEmail, onCheckIn, onClose }) => {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        description: '',
        version: '',
        files: [],
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${projectId}`);
                if (!response.ok) throw new Error('Failed to fetch project');
                const data = await response.json();
                setFormData({
                    description: '',
                    version: data.version,
                    files: data.files || [],
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (projectId) fetchProject();
    }, [projectId]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddFile = (file) => {
        if (!file) return;
        setFormData((prev) => ({ ...prev, files: [...prev.files, file.name || file] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`/api/projects/${projectId}/checkin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userEmail }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to check in project');
            onCheckIn(data.project);
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
                            <Description
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                            <Version
                                value={formData.version}
                                onChange={(e) => handleInputChange('version', e.target.value)}
                            />
                        </div>
                        <div className="rightCol">
                            <AddFiles files={formData.files} onAddFile={handleAddFile} />
                        </div>
                    </div>
                    <div id="buttonContainer">
                        <button type="submit" className="submit">Check In</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const EditProject = ({ projectId, onClose, onProjectUpdate }) => {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Web App',
        description: '',
        tags: [],
        image: '',
        files: [],
        version: '0.0.0',
        members: [],
    });
    const [error, setError] = useState('');

    // Fetch project
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
                    tags: data.tags || [],
                    image: data.image || '',
                    files: data.files || [],
                    version: data.version,
                    members: data.members.map(m => ({
                        id: m._id?.toString(),
                        firstName: m.name?.split(' ')[0] || '',
                        lastName: m.name?.split(' ').slice(1).join(' ') || '',
                        email: m.email,
                        name: m.name,
                        avatar: m.avatar,
                    })),
                });
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddTag = (tag) => {
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        }
    };

    const handleAddFile = (file) => {
        setFormData(prev => ({ ...prev, files: [...prev.files, file] }));
    };

    const handlePromote = (email) => {
        setFormData((prev) => {
            const members = [...prev.members];
            const idx = members.findIndex((m) => m.email === email);
            if (idx === -1 || idx === 0) return prev; // already owner

            // Swap with owner (index 0)
            [members[0], members[idx]] = [members[idx], members[0]];
            return { ...prev, members };
        });
    };

    const handleRemove = (email) => {
        if (formData.members[0]?.email === email) return;
        setFormData(prev => ({
            ...prev,
            members: prev.members.filter(m => m.email !== email)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const payload = {
                ...formData,
                members: formData.members.map(m => m.email),
            };

            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update');

            onProjectUpdate?.(data.project);  // Refresh parent
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
                            <ManageMembers
                                members={formData.members}
                                onPromote={handlePromote}
                                onRemove={handleRemove}
                            />
                        </div>
                    </div>
                    <div id="buttonContainer">
                        <button type="button">Delete</button>
                        <button type="submit" className="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};