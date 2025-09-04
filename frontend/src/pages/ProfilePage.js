import React, { act, useState } from 'react';
import './css/profile.css';
import { ActivitySection, EditProfile, FriendsSection, ProfileSection, ProjectSection, WordCloud } from '../components/ProfileComponents';

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('Prof');
    const [activeSectionSide, setActiveSectionSide] = useState('Frie');


    const handleButtonClick = (section) => {
        setActiveSection(section);
    };

    const handleButtonClickSide = (section) => {
        setActiveSectionSide(section);
    };

    const handleEditToggle = () => {
        setActiveSection(activeSection === 'Edit' ? 'Prof' : 'Edit');
    };

    return (
        <>
            <div className='profile-container'>
                <div className='mainCol'>
                    {(activeSection === 'Prof' || activeSection === 'Edit') &&
                        <button
                            className={activeSection === 'Edit' ? 'active edit' : 'edit'}
                            onClick={handleEditToggle}
                        >
                            Edit</button>
                    }
                    <img src='assets/img/placeholder.png' alt='pfp' className='pfp' />
                    <h2>User Name</h2>
                    <div className='hLine'></div>
                    {activeSection === 'Prof' && <ProfileSection />}
                    {activeSection === 'Actv' && <ActivitySection />}
                    {activeSection === 'Clou' && <WordCloud />}
                    {activeSection === 'Edit' && <EditProfile />}


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
        </>
    );
};

export default ProfilePage;