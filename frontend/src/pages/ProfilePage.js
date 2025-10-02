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
} from '../components/ProfileComponents';
import './css/profile.css';

const ProfilePage = () => {
    const { user, loading, logout } = useContext(UserContext);
    const { id } = useParams();
    const [activeSection, setActiveSection] = useState('Prof');
    const [activeSectionSide, setActiveSectionSide] = useState('Frie');
    const [profileLoading, setProfileLoading] = useState(true);
    const [error, setError] = useState(null);

    const [visibleFields, setVisibleFields] = useState({
        name: true,
        surname: true,
        email: false,
        phone: false,
        dob: true,
        country: false,
        organization: true,
        about: true,
    });

    const [profileData, setProfileData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        dob: '',
        country: '',
        organization: '',
        about: '',
    });

    const [activities, setActivities] = useState([]);
    const [projects, setProjects] = useState([]);
    const [friends, setFriends] = useState([]);

    const isOwner = user?.id === parseInt(id);

    // Fetch profile by ID
    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) return;
            try {
                const response = await fetch(`/api/users/${id}`);
                if (!response.ok) throw new Error('Failed to fetch user');
                const data = await response.json();

                setProfileData({
                    name: data.name || data.firstName || '',
                    surname: data.surname || data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    dob: data.dob || '',
                    country: data.country || '',
                    organization: data.organization || '',
                    about: data.about || '',
                });
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setProfileLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    // Fetch activities, projects, friends after email is loaded
    useEffect(() => {
        if (!profileData.email) return;

        const fetchActivities = async () => {
            try {
                const res = await fetch(`/api/activities?scope=local&email=${profileData.email}`);
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
                const res = await fetch(`/api/projects?email=${profileData.email}&scope=my`);
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
                    id: f.id,
                    firstName: f.firstName,
                    lastName: f.lastName,
                    email: f.email,
                    avatar: f.avatar || "/assets/img/placeholder.png",
                    online: f.online ?? false
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
    }, [profileData.email, id]);

    const handleButtonClick = (section) => setActiveSection(section);
    const handleButtonClickSide = (section) => setActiveSectionSide(section);

    const handleEditToggle = async () => {
        if (!isOwner) return;

        if (activeSection === 'Edit') {
            try {
                const res = await fetch('/api/user', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: profileData.email,
                        firstName: profileData.name,
                        lastName: profileData.surname,
                        phone: profileData.phone,
                        dob: profileData.dob,
                        country: profileData.country,
                        organization: profileData.organization,
                        about: profileData.about,
                    }),
                });
                if (!res.ok) throw new Error('Failed to update profile');
                const data = await res.json();
                console.log('Profile updated', data);
            } catch (err) {
                console.error(err);
                alert('Failed to save profile changes');
            }
            setActiveSection('Prof');
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

    const updateVisibility = (field) =>
        setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));

    const updateFieldValue = (field, value) =>
        setProfileData((prev) => ({ ...prev, [field]: value }));

    if (loading || profileLoading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (error) return <div>Error: {error}</div>;

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

                <img src="/assets/img/placeholder.png" alt="pfp" className="pfp" />
                <h2>{profileData.name} {profileData.surname}</h2>
                <div className="hLine"></div>

                {activeSection === 'Prof' && (
                    <ProfileSection visibleFields={visibleFields} profileData={profileData} />
                )}
                {activeSection === 'Actv' && <ActivitySection activities={activities} />}
                {activeSection === 'Clou' && <WordCloud />}
                {activeSection === 'Edit' && isOwner && (
                    <EditProfile
                        visibleFields={visibleFields}
                        updateVisibility={updateVisibility}
                        profileData={profileData}
                        updateFieldValue={updateFieldValue}
                        onDelete={handleDeleteProfile}
                    />
                )}
            </div>

            <div className="changeButtons">
                <button
                    className={activeSection === 'Prof' ? 'active' : ''}
                    onClick={() => handleButtonClick('Prof')}
                >
                    Prof
                </button>
                <button
                    className={activeSection === 'Actv' ? 'active' : ''}
                    onClick={() => handleButtonClick('Actv')}
                >
                    Actv
                </button>
                <button
                    className={activeSection === 'Clou' ? 'active' : ''}
                    onClick={() => handleButtonClick('Clou')}
                >
                    Clou
                </button>
                <button
                    className={activeSectionSide === 'Frie' ? 'active' : ''}
                    onClick={() => handleButtonClickSide('Frie')}
                >
                    Frie
                </button>
                <button
                    className={activeSectionSide === 'Proj' ? 'active' : ''}
                    onClick={() => handleButtonClickSide('Proj')}
                >
                    Proj
                </button>
            </div>

            <div className="sideCol">
                {activeSectionSide === 'Frie' && (
                    <FriendsSection
                        friends={friends}
                        setFriends={setFriends}
                        profileId={parseInt(id)}
                        currentUserId={user.id}
                    />
                )}
                {activeSectionSide === 'Proj' && <ProjectSection projects={projects} />}
            </div>
        </div>
    );
};

export default ProfilePage;
