import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../Session';
import { AddFiles, Description, ManageMembers, Name, Tags, Type, Version, VersionHistory } from './FormComponents';

const extensionToLanguage = {
    js: 'javascript', ts: 'typescript', py: 'python', java: 'java',
    cpp: 'C++', c: 'C', cs: 'csharp', rb: 'ruby', php: 'php',
    go: 'golang', rs: 'rust', html: 'html', css: 'css', json: 'json', sql: 'sql'
};

const generateTagsFromFiles = (files) => {
    const tags = [];
    files.forEach(f => {
        const name = typeof f === 'string' ? f : f.name;
        const ext = name.split('.').pop().toLowerCase();
        const language = extensionToLanguage[ext];
        if (language && !tags.includes(language)) tags.push(language);
    });
    return tags;
};

export const CreateProject = ({ onClose, onProjectCreated }) => {
    const { user } = useContext(UserContext);

    const [formData, setFormData] = useState({
        name: '', type: 'Web App', description: '', tags: [], image: '', files: [],
        version: '0.0.0', members: [user?.email || 'user1@example.com']
    });
    const [imageFile, setImageFile] = useState(null);
    const [fileObjects, setFileObjects] = useState([]);
    const [error, setError] = useState('');

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleAddTag = (tag) => {
        if (tag.trim() && !formData.tags.includes(tag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        }
    };

    const handleAddFile = (file) => {
        if (!file) return;
        setFormData(prev => {
            const updatedFiles = [...prev.files, file];
            const generatedTags = generateTagsFromFiles(updatedFiles);
            const allTags = Array.from(new Set([...prev.tags, ...generatedTags]));
            return { ...prev, files: updatedFiles, tags: allTags };
        });
        if (file instanceof File) setFileObjects(prev => [...prev, file]);
    };

    const uploadImage = async (file) => {
        if (!file) return '';
        const form = new FormData();
        form.append('image', file);
        const res = await fetch('/api/projects/upload-image', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Image upload failed');
        return data.path;
    };

    const uploadFiles = async (files) => {
        if (!files || files.length === 0) return [];
        const form = new FormData();
        files.forEach(f => form.append('files', f));
        const res = await fetch('/api/projects/upload-files', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Files upload failed');
        return data.files;
    };

    const createBlankFile = async (name) => {
        const res = await fetch('/api/projects/create-blank-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Blank file creation failed');
        return data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.name || !formData.description || !formData.version) {
            setError('Name, description, and version are required');
            return;
        }
        try {
            const imagePath = await uploadImage(imageFile);
            const realFiles = formData.files.filter(f => f instanceof File);
            const blankNames = formData.files.filter(f => typeof f === 'string');
            const uploadedFiles = await uploadFiles(realFiles);
            const blankFiles = [];
            for (const name of blankNames) {
                const fileInfo = await createBlankFile(name);
                blankFiles.push(fileInfo);
            }
            const allFiles = [...uploadedFiles, ...blankFiles];
            const projectData = { ...formData, image: imagePath, files: allFiles };
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create project');
            onProjectCreated?.(data.project);
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
                    <div
                        className="imageUploader"
                        onClick={() => document.getElementById('projectImageInput').click()}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag'); }}
                        onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove('drag'); }}
                        onDrop={e => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('drag');
                            const file = e.dataTransfer.files[0];
                            if (file?.type.startsWith('image/')) {
                                setImageFile(file);
                                handleInputChange('image', URL.createObjectURL(file));
                            }
                        }}
                    >
                        {formData.image ? (
                            <img src={formData.image} alt="preview" className="previewImg" />
                        ) : (
                            <p>Click or drag image here</p>
                        )}
                    </div>
                    <input
                        id="projectImageInput"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setImageFile(file);
                                handleInputChange('image', URL.createObjectURL(file));
                            }
                        }}
                    />
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
    const [fileObjects, setFileObjects] = useState([]);
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
        setFormData((prev) => ({ ...prev, files: [...prev.files, file] }));
        if (file instanceof File) {
            setFileObjects(prev => [...prev, file]);
        }
    };

    const uploadFiles = async (files) => {
        if (!files || files.length === 0) return [];
        const form = new FormData();
        files.forEach(f => form.append('files', f));
        const res = await fetch('/api/projects/upload-files', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Files upload failed');
        return data.files;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // upload any new file objects first
            const uploadedFiles = await uploadFiles(fileObjects);

            // combine previously added files and newly uploaded files
            const existingFiles = formData.files.filter(f => typeof f === 'string' || f.path);
            const allFiles = [...existingFiles, ...uploadedFiles];

            if (!formData.description) {
                setError('Description is required');
                return;
            }

            const response = await fetch(`/api/projects/${projectId}/checkin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail,
                    description: formData.description,
                    version: formData.version || undefined,
                    files: allFiles
                }),
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
        name: '', type: 'Web App', description: '', tags: [], image: '', files: [],
        version: '0.0.0', members: []
    });
    const [imageFile, setImageFile] = useState(null);
    const [fileObjects, setFileObjects] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${projectId}`);
                if (!response.ok) throw new Error('Failed to fetch project');
                const data = await response.json();

                const files = data.files.map(f => typeof f === 'string' ? { name: f.split('/').pop(), path: f } : f);

                setFormData({
                    name: data.name,
                    type: data.type,
                    description: data.description,
                    tags: data.tags || generateTagsFromFiles(files),
                    image: data.image || '',
                    files: files,
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

                // Keep track of File objects for newly added files
                setFileObjects([]);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleAddTag = (tag) => {
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
        }
    };

    const handleAddFile = (file) => {
        if (!file) return;
        setFormData(prev => {
            const updatedFiles = [...prev.files, file];
            const generatedTags = generateTagsFromFiles(updatedFiles);
            const allTags = Array.from(new Set([...prev.tags, ...generatedTags]));
            return { ...prev, files: updatedFiles, tags: allTags };
        });
        if (file instanceof File) setFileObjects(prev => [...prev, file]);
    };

    const handlePromote = (email) => {
        setFormData(prev => {
            const members = [...prev.members];
            const idx = members.findIndex(m => m.email === email);
            if (idx === -1 || idx === 0) return prev;
            [members[0], members[idx]] = [members[idx], members[0]];
            return { ...prev, members };
        });
    };

    const handleRemove = (email) => {
        if (formData.members[0]?.email === email) return;
        setFormData(prev => ({ ...prev, members: prev.members.filter(m => m.email !== email) }));
    };

    const uploadImage = async (file) => {
        if (!file) return formData.image;
        const form = new FormData();
        form.append('image', file);
        const res = await fetch('/api/projects/upload-image', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Image upload failed');
        return data.path;
    };

    const uploadFiles = async (files) => {
        if (!files || files.length === 0) return [];
        const form = new FormData();
        files.forEach(f => form.append('files', f));
        const res = await fetch('/api/projects/upload-files', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Files upload failed');
        return data.files;
    };

    const createBlankFile = async (name) => {
        const res = await fetch('/api/projects/create-blank-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Blank file creation failed');
        return data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const imagePath = await uploadImage(imageFile);

            const realFiles = fileObjects.filter(f => f instanceof File);
            const blankNames = formData.files.filter(f => typeof f === 'string');

            const uploadedFiles = await uploadFiles(realFiles);

            const blankFiles = [];
            for (const name of blankNames) {
                const fileInfo = await createBlankFile(name);
                blankFiles.push(fileInfo);
            }

            // Include existing files that are not File objects or strings
            const existingFiles = formData.files.filter(f => typeof f !== 'string' && !(f instanceof File));
            const allFiles = [...existingFiles, ...uploadedFiles, ...blankFiles];

            const payload = {
                ...formData,
                image: imagePath,
                files: allFiles,
                members: formData.members.map(m => m.email),
            };

            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update');

            onProjectUpdate?.(data.project);
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
                    <label>Project Image</label>
                    <div
                        className="imageUploader"
                        onClick={() => document.getElementById('editProjectImageInput').click()}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag'); }}
                        onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove('drag'); }}
                        onDrop={e => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('drag');
                            const file = e.dataTransfer.files[0];
                            if (file?.type.startsWith('image/')) {
                                setImageFile(file);
                                handleInputChange('image', URL.createObjectURL(file));
                            }
                        }}
                    >
                        {formData.image ? (
                            <img src={formData.image} alt="preview" className="previewImg" />
                        ) : (
                            <p>Click or drag image here</p>
                        )}
                    </div>
                    <input
                        id="editProjectImageInput"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setImageFile(file);
                                handleInputChange('image', URL.createObjectURL(file));
                            }
                        }}
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="formContent">
                        <div className="leftCol">
                            <Name value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                            <Type value={formData.type} onChange={e => handleInputChange('type', e.target.value)} />
                            <Description value={formData.description} onChange={e => handleInputChange('description', e.target.value)} />
                            <Tags tags={formData.tags} onAddTag={handleAddTag} />
                        </div>
                        <div className="rightCol">
                            <AddFiles files={formData.files} onAddFile={handleAddFile} />
                            <Version value={formData.version} onChange={e => handleInputChange('version', e.target.value)} />
                            <ManageMembers members={formData.members} onPromote={handlePromote} onRemove={handleRemove} />
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