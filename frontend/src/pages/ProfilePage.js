import React, { useState } from 'react';
import './css/profile.css';
import { ActivitySection, EditProfile, FriendsSection, ProfileSection, ProjectSection, WordCloud } from '../components/ProfileComponents';

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('Prof');
    const [activeSectionSide, setActiveSectionSide] = useState('Frie');

    // field visibility
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

    // field values
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

    const handleButtonClick = (section) => {
        setActiveSection(section);
    };

    const handleButtonClickSide = (section) => {
        setActiveSectionSide(section);
    };

    const handleEditToggle = () => {
        setActiveSection(activeSection === 'Edit' ? 'Prof' : 'Edit');
    };

    const updateVisibility = (field) => {
        setVisibleFields((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const updateFieldValue = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className='profile-container'>
            <div className='mainCol'>
                {(activeSection === 'Prof' || activeSection === 'Edit') &&
                    <button
                        className={activeSection === 'Edit' ? 'active edit' : 'edit'}
                        onClick={handleEditToggle}
                    >
                        {activeSection === 'Edit' ? 'Save' : 'Edit'}
                    </button>
                }
                <img src='assets/img/placeholder.png' alt='pfp' className='pfp' />
                <h2>User Name</h2>
                <div className='hLine'></div>

                {activeSection === 'Prof' && (
                    <ProfileSection
                        visibleFields={visibleFields}
                        profileData={profileData}
                    />
                )}

                {activeSection === 'Actv' && <ActivitySection />}
                {activeSection === 'Clou' && <WordCloud />}
                {activeSection === 'Edit' && (
                    <EditProfile
                        visibleFields={visibleFields}
                        updateVisibility={updateVisibility}
                        profileData={profileData}
                        updateFieldValue={updateFieldValue}
                    />
                )}
            </div>

            <div className='changeButtons'>
                <button
                    className={activeSection === 'Prof' ? 'active' : ''}
                    onClick={() => handleButtonClick('Prof')}
                >
                    Prof</button>
                <button
                    className={activeSection === 'Actv' ? 'active' : ''}
                    onClick={() => handleButtonClick('Actv')}
                >
                    Actv</button>
                <button
                    className={activeSection === 'Clou' ? 'active' : ''}
                    onClick={() => handleButtonClick('Clou')}
                >
                    Clou</button>
                <button
                    className={activeSectionSide === 'Frie' ? 'active' : ''}
                    onClick={() => handleButtonClickSide('Frie')}
                >
                    Frie</button>
                <button
                    className={activeSectionSide === 'Proj' ? 'active' : ''}
                    onClick={() => handleButtonClickSide('Proj')}
                >
                    Proj</button>
            </div>

            <div className='sideCol'>
                {activeSectionSide === 'Frie' && <FriendsSection />}
                {activeSectionSide === 'Proj' && <ProjectSection />}
            </div>
        </div>
    );
};

export default ProfilePage;
