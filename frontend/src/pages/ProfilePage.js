import React, { useState, useEffect, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { UserContext } from '../Session';
import {
    ActivitySection,
    EditProfile,
    FriendsSection,
    ProfileSection,
    ProjectSection,
    WordCloud,
    AvatarUpload
} from '../components/ProfileComponents';
import './css/profile.css';

const ProfilePage = () => {
    const { user, loading, logout } = useContext(UserContext);
    const { id } = useParams();
    const [activeSection, setActiveSection] = useState('Prof');
    const [activeSectionSide, setActiveSectionSide] = useState('Proj');
    const [profileLoading, setProfileLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userInfo, setUserInfo] = useState([]);
    const [activities, setActivities] = useState([]);
    const [projects, setProjects] = useState([]);
    const [friends, setFriends] = useState([]);

    const isOwner = user?.id === id;
    const [avatarUrl, setAvatarUrl] = useState("/assets/img/placeholder.png");

    // fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) return;
            try {
                const response = await fetch(`/api/users/${id}`);
                if (!response.ok) throw new Error('Failed to fetch user');
                const data = await response.json();

                // userInfo array from backend
                setUserInfo(data.userInfo || []);
                setAvatarUrl(data.avatar || "/assets/img/placeholder.png");
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setProfileLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    // fetch activities, projectsa and friends 
    useEffect(() => {
        const emailField = userInfo.find(f => f.field === 'email');
        if (!emailField?.value) return;

        const fetchActivities = async () => {
            try {
                const res = await fetch(`/api/activities?scope=local&email=${emailField.value}`);
                if (!res.ok) throw new Error("Failed to fetch activities");
                const data = await res.json();
                setActivities(data || []);
            } catch (err) {
                console.error(err);
                setActivities([]);
            }
        };

        const fetchProjects = async () => {
            try {
                const res = await fetch(`/api/projects?email=${emailField.value}&scope=my`);
                if (!res.ok) throw new Error("Failed to fetch projects");
                const data = await res.json();
                setProjects(data || []);
            } catch (err) {
                console.error(err);
                setProjects([]);
            }
        };

        const fetchFriends = async () => {
            try {
                const res = await fetch(`/api/users/${id}/friends`);
                if (!res.ok) throw new Error("Failed to fetch friends");
                const data = await res.json();
                const normalized = data.map(f => ({
                    id: f.id || f._id?.toString(),
                    firstName: f.firstName,
                    lastName: f.lastName,
                    email: f.email,
                    avatar: f.avatar || "/assets/img/placeholder.png",
                    online: f.status ?? false
                }));
                setFriends(normalized);
            } catch (err) {
                console.error(err);
                setFriends([]);
            }
        };

        fetchActivities();
        fetchProjects();
        fetchFriends();
    }, [userInfo, id]);

    const handleButtonClick = (section) => setActiveSection(section);
    const handleButtonClickSide = (section) => setActiveSectionSide(section);

    const handleEditToggle = async () => {
        if (!isOwner) return;

        if (activeSection === 'Edit') {
            try {
                const res = await fetch(`/api/users/${user.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userInfo }),
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || 'Failed to save profile');
                }

                const updated = await res.json();
                setUserInfo(updated.user.userInfo || userInfo);
                alert("Profile saved successfully!");
                setActiveSection('Prof');
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        } else {
            setActiveSection('Edit');
        }
    };

    const handleDeleteProfile = async () => {
        if (!isOwner) return;
        if (!window.confirm("Are you sure you want to delete your profile? This cannot be undone.")) return;

        try {
            const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete profile");

            alert("Profile deleted successfully.");
            logout();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    if (loading || profileLoading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (error) return <div>Error: {error}</div>;

    const firstName = userInfo.find(f => f.field === 'name')?.value || '';
    const lastName = userInfo.find(f => f.field === 'surname')?.value || '';


    return (
        <div className="profile-container">
            <div className="mainCol">
                {isOwner && (activeSection === 'Prof' || activeSection === 'Edit') && (
                    <button
                        className={activeSection === 'Edit' ? 'active edit' : 'edit'}
                        onClick={handleEditToggle}
                    >
                        {activeSection === 'Edit' ? 'Save' : 'Edit'}
                    </button>
                )}

                {isOwner ? (
                    <AvatarUpload
                        currentAvatar={avatarUrl}
                        userId={user.id}
                        onAvatarChange={setAvatarUrl}
                    />
                ) : (
                    <img src={avatarUrl} alt="pfp" className="pfp" />
                )}
                <h2>{firstName} {lastName}</h2>
                <div className="hLine"></div>

                {activeSection === 'Prof' && <ProfileSection userInfo={userInfo} />}
                {activeSection === 'Actv' && <ActivitySection activities={activities} />}
                {activeSection === 'Clou' && <WordCloud />}
                {activeSection === 'Edit' && isOwner && (
                    <EditProfile
                        userInfo={userInfo}
                        setUserInfo={setUserInfo}
                        onDelete={handleDeleteProfile}
                    />
                )}
            </div>

            <div className="changeButtons">
                <button
                    className={activeSection === 'Prof' ? 'active' : ''}
                    onClick={() => handleButtonClick('Prof')}
                >Prof</button>
                <button
                    className={activeSection === 'Actv' ? 'active' : ''}
                    onClick={() => handleButtonClick('Actv')}
                >Actv</button>
                <button
                    className={activeSection === 'Clou' ? 'active' : ''}
                    onClick={() => handleButtonClick('Clou')}
                >Clou</button>
                <button
                    className={activeSectionSide === 'Frie' ? 'active' : ''}
                    onClick={() => handleButtonClickSide('Frie')}
                >Frie</button>
                <button
                    className={activeSectionSide === 'Proj' ? 'active' : ''}
                    onClick={() => handleButtonClickSide('Proj')}
                >Proj</button>
            </div>

            <div className="sideCol">
                {activeSectionSide === 'Frie' && (
                    <FriendsSection
                        friends={friends}
                        setFriends={setFriends}
                        profileId={id}
                        currentUserId={user.id}
                    />
                )}
                {activeSectionSide === 'Proj' && <ProjectSection projects={projects} />}
            </div>
        </div>
    );
};

export default ProfilePage;
