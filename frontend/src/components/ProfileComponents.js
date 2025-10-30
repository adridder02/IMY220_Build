import React from 'react';
import Activities from '../components/Activities';
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../Session';

export const ProfileSection = ({ userInfo }) => {
    const leftFields = ["name", "surname", "email", "phone", "dob"];
    const rightFields = ["country", "organization", "about"];

    return (
        <div className='profileInfo'>
            <div className='leftCol'>
                {userInfo.filter(f => ["name", "surname", "email", "phone", "dob"].includes(f.field) && f.visible)
                    .map(f => (
                        <div key={f.field}>
                            <label>{f.field.charAt(0).toUpperCase() + f.field.slice(1)}</label>
                            <p>{f.value || '-'}</p>
                        </div>
                    ))}
            </div>

            <div className='rightCol'>
                {userInfo.filter(f => ["country", "organization", "about"].includes(f.field) && f.visible)
                    .map(f => (
                        <div key={f.field}>
                            <label>{f.field.charAt(0).toUpperCase() + f.field.slice(1)}</label>
                            <p>{f.value || '-'}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export const EditProfile = ({ userInfo, setUserInfo, onDelete }) => {

    const handleValueChange = (field, value) => {
        setUserInfo(prev => prev.map(f => f.field === field ? { ...f, value } : f));
    };

    const handleVisibilityToggle = (field) => {
        setUserInfo(prev => prev.map(f => f.field === field ? { ...f, visible: !f.visible } : f));
    };

    return (
        <>
            <div className='profileInfo'>
                <div className='leftCol'>
                    {["name", "surname", "email", "phone", "dob"].map(f => {
                        const fieldObj = userInfo.find(u => u.field === f);
                        return (
                            <div key={f}>
                                <div className='editGroup'>
                                    <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={fieldObj.visible}
                                            onChange={() => handleVisibilityToggle(f)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    value={fieldObj.value}
                                    placeholder={f}
                                    onChange={(e) => handleValueChange(f, e.target.value)}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className='rightCol'>
                    {["country", "organization", "about"].map(f => {
                        const fieldObj = userInfo.find(u => u.field === f);
                        return (
                            <div key={f}>
                                <div className='editGroup'>
                                    <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={fieldObj.visible}
                                            onChange={() => handleVisibilityToggle(f)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                {f === "about" ? (
                                    <textarea
                                        value={fieldObj.value}
                                        placeholder={f}
                                        onChange={(e) => handleValueChange(f, e.target.value)}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={fieldObj.value}
                                        placeholder={f}
                                        onChange={(e) => handleValueChange(f, e.target.value)}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="deleteProfile">
                <button className="deleteButton" onClick={() => { if (window.confirm("Are you sure?")) onDelete(); }}>
                    Delete Profile
                </button>
            </div>
        </>
    );
};

export const ActivitySection = ({ activities = [] }) => {
    const activitiesWithUserId = activities.map(act => ({
        ...act,
        userId: act.user?._id || act.email || act.userId,
        user: act.user?.name || act.user || 'Unknown User'
    }));

    return (
        <div className="profileActivity">
            <Activities activities={activitiesWithUserId} forProject={true} />
        </div>
    );
};

export const WordCloud = () => {
    return (
        <>
            <div className='wordCloud'>Word Cloud</div>
        </>
    );
};

export const FriendsSection = ({ profileId, currentUserId }) => {
    const { user } = useContext(UserContext);
    const isOwner = profileId === currentUserId;

    const [friends, setFriends] = useState([]);
    const [friendInput, setFriendInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);

    // fetch friend requests (if owner)
    useEffect(() => {
        if (!isOwner) return;

        const fetchRequests = async () => {
            try {
                const res = await fetch(`/api/users/${profileId}`);
                const data = await res.json();
                setFriendRequests(data.friendRequests?.map(r => ({ ...r, _id: r._id.toString() })) || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRequests();
    }, [profileId, isOwner]);

    // fetch friends dynamically
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await fetch(`/api/users/${profileId}/friends`);
                if (!res.ok) throw new Error("Failed to fetch friends");
                const data = await res.json();
                setFriends(data);
            } catch (err) {
                console.error(err);
                setFriends([]);
            }
        };

        fetchFriends();
    }, [profileId]);

    const handleInputChange = (e) => {
        if (!isOwner) return;
        const value = e.target.value;
        setFriendInput(value);
        if (!value) return setSuggestions([]);

        setLoading(true);
        fetch(`/api/users?search=${encodeURIComponent(value)}`)
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter(
                    u => u._id !== profileId && !friends.some(f => f.id === u._id)
                );
                setSuggestions(filtered.map(u => ({ ...u, id: u._id })));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleSendRequest = async (friend) => {
        try {
            const res = await fetch(`/api/users/${friend.id}/friend-request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderEmail: user.email }),
            });
            if (!res.ok) throw new Error("Failed to send friend request");
            alert("Friend request sent!");
            setFriendInput("");
            setSuggestions([]);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleAcceptRequest = async (senderId) => {
        try {
            const res = await fetch(`/api/users/${profileId}/friend-request/${senderId}/accept`, { method: "POST" });
            if (!res.ok) throw new Error("Failed to accept request");
            const data = await res.json();
            setFriends(data.friends || []);
            setFriendRequests(prev => prev.filter(r => r._id !== senderId));
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleRejectRequest = async (senderId) => {
        if (!window.confirm("Are you sure you want to reject this friend request?")) return;
        try {
            const res = await fetch(`/api/users/${profileId}/friend-request/${senderId}/reject`, { method: "POST" });
            if (!res.ok) throw new Error("Failed to reject request");
            setFriendRequests(prev => prev.filter(r => r._id !== senderId));
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        if (!window.confirm("Are you sure you want to remove this friend?")) return;
        try {
            const res = await fetch(`/api/users/${profileId}/friends/${friendId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to remove friend");
            const data = await res.json();
            setFriends(data.friends || []);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    return (
        <div className="friendsSection">
            <h2 className="heading3">Friends</h2>

            {isOwner && (
                <div className="friendInput">
                    <input
                        type="text"
                        placeholder="Add a friend by name, surname, or email"
                        value={friendInput}
                        onChange={handleInputChange}
                    />
                </div>
            )}

            {loading && <p>Loading suggestions...</p>}
            {!loading && suggestions.length > 0 && isOwner && (
                <ul className="suggestionsList">
                    {suggestions.map(s => (
                        <li key={s.id} className="suggestionItem">
                            <span className="suggestionText">{s.firstName} {s.lastName} ({s.email})</span>
                            <button onClick={() => handleSendRequest(s)}>Add</button>
                        </li>
                    ))}
                </ul>
            )}

            {isOwner && friendRequests.length > 0 && (
                <div className="pendingRequests">
                    <h3>Pending Friend Requests</h3>
                    {friendRequests.map(req => (
                        <div key={req._id} className="requestItem">
                            {req.firstName} {req.lastName}
                            <button onClick={() => handleAcceptRequest(req._id)}>Accept</button>
                            <button onClick={() => handleRejectRequest(req._id)}>Reject</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="hLine"></div>

            <div className="friendsList">
                {friends.map(friend => (
                    <Friend
                        key={friend.id}
                        friend={friend}
                        onRemove={isOwner ? () => handleRemoveFriend(friend.id) : undefined}
                    />
                ))}
            </div>
        </div>
    );
};

export const Friend = ({ friend, onRemove }) => {
    return (
        <div className="friend">
            <img
                src={friend.avatar || "/assets/img/placeholder.png"}
                alt="userPfp"
                className="avatar"
            />
            <div className="userInfo">
                <p>{friend.firstName} {friend.lastName}</p>
                <div className="hLine"></div>
                <p>{friend.online ? "Online" : "Offline"}</p>
            </div>
            <div className="friendButtons">
                <button>
                    <Link to={`/profile/${friend.id}`}>View</Link>
                </button>
                {onRemove && (
                    <button className='remFriend' onClick={() => onRemove(friend.id)}>-</button>
                )}
            </div>
        </div>
    );
};

export const ProjectSection = ({ projects = [] }) => {
    return (
        <div className="projectSection">
            <h2 className="heading3">Current Projects</h2>
            <div className="projectList">
                {projects.map(proj => (
                    <CardMini
                        key={proj._id || proj.id}
                        project={proj}
                        image={proj.image || '/assets/img/placeholder.png'}   
                    />
                ))}
            </div>
            <div className="hLine"></div>
            <button className='viewall'><Link to="/projects">View Projects</Link></button>
        </div>
    );
};

export const CardMini = ({ project, image }) => {
    return (
        <div className="cardMini">
            <img src={image || '/assets/img/placeholder.png'} alt={project.name} />
            <div className="hLine"></div>
            <h3>{project.name}</h3>
            <div className="hLine"></div>
            <button>
                <Link to={`/projects/${project._id}`}>View</Link>
            </button>
        </div>
    );
};

export const AvatarUpload = ({ currentAvatar, userId, onAvatarChange }) => {
    const [preview, setPreview] = useState(currentAvatar);
    const fileInput = useRef();

    const upload = async (file) => {
        const form = new FormData();
        form.append('avatar', file);

        const res = await fetch('/api/upload-avatar', {
            method: 'POST',
            body: form
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        // uetch curr userInfo
        const userRes = await fetch(`/api/users/${userId}`);
        const userData = await userRes.json();

        // update with both userInfo and avatar
        await fetch(`/api/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userInfo: userData.userInfo || [],
                avatar: data.url
            })
        });

        return data.url;
    };

    const handleFile = async (file) => {
        if (!file?.type.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
        try {
            const savedUrl = await upload(file);
            setPreview(savedUrl);
            onAvatarChange?.(savedUrl);
        } catch (e) {
            setPreview(currentAvatar);
            alert(e.message);
        }
    };

    const stop = e => { e.preventDefault(); e.stopPropagation(); };

    return (
        <div
            className="avatarUploader"
            onClick={() => fileInput.current.click()}
            onDragOver={e => { stop(e); e.currentTarget.classList.add('drag'); }}
            onDragLeave={e => { stop(e); e.currentTarget.classList.remove('drag'); }}
            onDrop={e => {
                stop(e);
                e.currentTarget.classList.remove('drag');
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
            }}
        >
            <img src={preview} alt="pfp" className="pfp" />
            <input
                ref={fileInput}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => e.target.files[0] && handleFile(e.target.files[0])}
            />
        </div>
    );
};
