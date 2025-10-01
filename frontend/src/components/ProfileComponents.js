import React from 'react';
import { ActivityType1, ActivityType3 } from '../components/Activities';
import { Link } from 'react-router-dom';

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

export const EditProfile = ({ visibleFields, updateVisibility, profileData, updateFieldValue }) => {
    return (
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
    );
};

export const ActivitySection = () => {
    return (
        <>
            <div className='profileActivity'>
                <ActivityType1
                    user="USER"
                    action="checked in a project"
                    projectName="NAME"
                    timestamp="07/23/2025 8:30AM"
                />
                <ActivityType1
                    user="USER"
                    action="checked in a project"
                    projectName="NAME"
                    timestamp="07/23/2025 8:30AM"
                />
                <ActivityType1
                    user="USER"
                    action="checked in a project"
                    projectName="NAME"
                    timestamp="07/23/2025 8:30AM"
                />
                <ActivityType3
                    user="USER"
                    action="checked in a project"
                    projectName="NAME"
                    timestamp="07/23/2025 8:30AM"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
                />
            </div>
        </>
    );
};

export const WordCloud = () => {
    return (
        <>
            <div className='wordCloud'>Word Cloud</div>
        </>
    );
};

export const FriendsSection = () => {
    return (
        <>
            <div className='friendsSection'>
                <div className="friendInput">
                    <input type="text" placeholder="Add a Friend" />
                    <button>+</button>
                </div>
                <div className='hLine'></div>
                <div className='friendsList'>
                    <Friend />
                    <Friend />
                    <Friend />
                </div>
            </div>
        </>
    );
};

export const Friend = () => {
    return (
        <div className='friend'>
            <img src="/assets/img/placeholder.png" alt="userPfp" className="avatar" />
            <div className="userInfo">
                <p>Name Surname</p>
                <div className="hLine"></div>
                <p>Online</p>
            </div>
            <div className="vLine"></div>
            <button><Link to="/profile">View</Link></button>
        </div>
    );
};

export const ProjectSection = () => {
    return (
        <div className='projectSection' >
            <h2 className='heading3 '>Current Projects</h2>

            <div className='projectList'>
                <CardMini />
                <CardMini />
                <CardMini />
                <CardMini />
                <CardMini />
            </div>
            <div id='projSectLine' className='hLine'></div>
            <button><Link to="/projects">View Projects</Link></button>
        </div>
    )
}

export const CardMini = () => {
    return (
        <div className="cardMini">
            <img src="/assets/img/placeholder.png" alt="projectImg" />
            <div className="hLine"></div>
            <h3>Project Name</h3>
        </div>
    );
};