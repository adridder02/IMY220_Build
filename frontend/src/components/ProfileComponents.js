import React from 'react';
import Activities from '../components/Activities';
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from 'react';

export const ProfileSection = ({ visibleFields, profileData }) => {
    return (
        <div className='profileInfo'>
            <div className='leftCol'>
                {visibleFields.name && (
                    <div>
                        <label>Name</label>
                        <p>{profileData.name || '-'}</p>
                    </div>
                )}

                {visibleFields.surname && (
                    <div>
                        <label>Surname</label>
                        <p>{profileData.surname || '-'}</p>
                    </div>
                )}

                {visibleFields.email && (
                    <div>
                        <label>Email</label>
                        <p>{profileData.email || '-'}</p>
                    </div>
                )}

                {visibleFields.phone && (
                    <div>
                        <label>Phone Number</label>
                        <p>{profileData.phone || '-'}</p>
                    </div>
                )}

                {visibleFields.dob && (
                    <div>
                        <label>Date of Birth</label>
                        <p>{profileData.dob || '-'}</p>
                    </div>
                )}
            </div>

            <div className='rightCol'>
                {visibleFields.country && (
                    <div>
                        <label>Country</label>
                        <p>{profileData.country || '-'}</p>
                    </div>
                )}

                {visibleFields.organization && (
                    <div>
                        <label>Organization</label>
                        <p>{profileData.organization || '-'}</p>
                    </div>
                )}

                {visibleFields.about && (
                    <div>
                        <label>About</label>
                        <p>{profileData.about || '-'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const EditProfile = ({ visibleFields, updateVisibility, profileData, updateFieldValue, onDelete }) => {
    return (
        <>
            <div className='profileInfo'>
                <div className='leftCol'>
                    <div>
                        <div className='editGroup'>
                            <label>Name</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={visibleFields.name}
                                    onChange={() => updateVisibility('name')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <input
                            type="text"
                            value={profileData.name}
                            placeholder="Name"
                            onChange={(e) => updateFieldValue('name', e.target.value)}
                        />
                    </div>

                    <div>
                        <div className='editGroup'>
                            <label>Surname</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={visibleFields.surname}
                                    onChange={() => updateVisibility('surname')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <input
                            type="text"
                            value={profileData.surname}
                            placeholder="Surname"
                            onChange={(e) => updateFieldValue('surname', e.target.value)}
                        />
                    </div>

                    <div>
                        <div className='editGroup'>
                            <label>Email</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={visibleFields.email}
                                    onChange={() => updateVisibility('email')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <input
                            type="text"
                            value={profileData.email}
                            placeholder="example@gmail.com"
                            onChange={(e) => updateFieldValue('email', e.target.value)}
                        />
                    </div>

                    <div>
                        <div className='editGroup'>
                            <label>Phone Number</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={visibleFields.phone}
                                    onChange={() => updateVisibility('phone')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <input
                            type="text"
                            value={profileData.phone}
                            placeholder="081 123 1234"
                            onChange={(e) => updateFieldValue('phone', e.target.value)}
                        />
                    </div>

                    <div>
                        <div className='editGroup'>
                            <label>Date of Birth</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={visibleFields.dob}
                                    onChange={() => updateVisibility('dob')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <input
                            type="text"
                            value={profileData.dob}
                            placeholder="18/12/2001"
                            onChange={(e) => updateFieldValue('dob', e.target.value)}
                        />
                    </div>
                </div>

                <div className='rightCol'>
                    <div>
                        <div className='editGroup'>
                            <label>Country</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={visibleFields.country}
                                    onChange={() => updateVisibility('country')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <input
                            type="text"
                            value={profileData.country}
                            placeholder="America"
                            onChange={(e) => updateFieldValue('country', e.target.value)}
                        />
                    </div>

                    <div>
                        <div className='editGroup'>
                            <label>Organization</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={visibleFields.organization}
                                    onChange={() => updateVisibility('organization')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <input
                            type="text"
                            value={profileData.organization}
                            placeholder="Company Name"
                            onChange={(e) => updateFieldValue('organization', e.target.value)}
                        />
                    </div>

                    <div>
                        <div className='editGroup'>
                            <label>About</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={visibleFields.about}
                                    onChange={() => updateVisibility('about')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <textarea
                            value={profileData.about}
                            placeholder="About you"
                            onChange={(e) => updateFieldValue('about', e.target.value)}
                        />
                    </div>

                </div>
            </div>
            <div className="deleteProfile">
                <button
                    className="deleteButton"
                    onClick={() => {
                        if (window.confirm("Are you sure you want to delete your profile? This cannot be undone.")) {
                            onDelete();
                        }
                    }}
                >
                    Delete Profile
                </button>
            </div>
        </>
    );
};

export const ActivitySection = ({ activities = [] }) => {
    return (
        <div className="profileActivity">
            <Activities activities={activities} forProject={true} />
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

export const FriendsSection = ({ friends, setFriends, profileId, currentUserId }) => {
    const [friendInput, setFriendInput] = React.useState("");
    const [suggestions, setSuggestions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const isOwner = profileId === currentUserId; // only the owner can edit

    const handleInputChange = (e) => {
        if (!isOwner) return;

        const value = e.target.value;
        setFriendInput(value);

        if (!value) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        fetch(`/api/users?search=${encodeURIComponent(value)}`)
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter(
                    u => u.id !== profileId && !friends.some(f => f.id === u.id)
                );
                setSuggestions(filtered);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleAddFriend = async (friend) => {
        if (!isOwner) return;
        try {
            const res = await fetch(`/api/users/${profileId}/friends`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: friend.email }),
            });
            if (!res.ok) throw new Error("Failed to add friend");
            const data = await res.json();
            setFriends([...data.friends]);
            setFriendInput("");
            setSuggestions([]);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        if (!isOwner) return;
        if (!window.confirm("Are you sure you want to remove this friend?")) return;

        setFriends(prev => prev.filter(f => f.id !== friendId)); 

        try {
            const res = await fetch(`/api/users/${profileId}/friends/${friendId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to remove friend");
            const data = await res.json();
            setFriends([...data.friends]);
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
                            <span className="suggestionText">
                                {s.firstName} {s.lastName} ({s.email})
                            </span>
                            <button onClick={() => handleAddFriend(s)}>Add</button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="hLine"></div>

            <div className="friendsList">
                {friends.map(friend => (
                    <Friend
                        key={friend.id ?? friend.email ?? `${friend.firstName}-${friend.lastName}`}
                        friend={friend}
                        onRemove={isOwner ? handleRemoveFriend : undefined}
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
                    <CardMini key={proj.id} project={proj} />
                ))}
            </div>
            <div className="hLine"></div>
            <button><Link to="/projects">View Projects</Link></button>
        </div>
    );
};


export const CardMini = ({ project }) => {
    return (
        <div className="cardMini">
            <img src={"/assets/img/placeholder.png"} alt="projectImg" />
            <div className="hLine"></div>
            <h3>{project.name}</h3>
        </div>
    );
};
