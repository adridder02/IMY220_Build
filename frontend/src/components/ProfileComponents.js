import React from 'react';
import { ActivityType1, ActivityType3 } from '../components/Activities';

export const ProfileSection = () => {
    return (
        <>
            <div>
                <label>Name</label>
                <input type="text" placeholder="Name" />
            </div>

            <div>
                <label>Surname</label>
                <input type="text" placeholder="Surname"></input>
            </div>
            <div>
                <label>Email</label>
                <input type="text" placeholder="example@gmail.com"></input>
            </div>
            <div>
                <label>Organization</label>
                <input type="text" placeholder="Company Name"></input>
            </div>
            <div>
                <label>About</label>
                <textarea placeholder="About you"></textarea>
            </div>
        </>
    );
};

export const EditProfile = () => {
    return (
        <>
            <div>
                <label>Name</label>
                <input type="text" placeholder="Name" />
            </div>
            <div>
                <label>Surname</label>
                <input type="text" placeholder="Surname"></input>
            </div>
            <div>
                <label>Email</label>
                <input type="text" placeholder="example@gmail.com"></input>
            </div>
            <div>
                <label>Phone Number</label>
                <input type="text" placeholder="081 123 1234"></input>
            </div>
            <div>
                <label>Date of Birth</label>
                <input type="text" placeholder="18/12/2001"></input>
            </div>
            <div>
                <label>Country</label>
                <input type="text" placeholder="America"></input>
            </div>
            <div>
                <label>Organization</label>
                <input type="text" placeholder="Company Name"></input>
            </div>
            <div>
                <label>About</label>
                <textarea placeholder="About you"></textarea>
            </div>
        </>
    );
};

export const ActivitySection = () => {
    return (
        <>
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
                    <input type="text" placeholder="addFriend" />
                    <button>+</button>
                </div>
                <div className='friendsList'>
                    <Friend />
                    <Friend />
                    <Friend />
                </div>
                <div className='hLine'></div>
            </div>
        </>
    );
};

export const Friend = () => {
    return (
        <div className='friend'>
            <img src="assets/img/placeholder.png" alt="userPfp" className="avatar" />
            <div className="userInfo">
                <p>Name Surname</p>
                <div className="hLine"></div>
                <p>Online</p>
            </div>
            <div className="vLine"></div>
            <button>View</button>
        </div>
    );
};

export const ProjectSection = () => {
    return (
        <div className='projectSection' >
            <h2>Current Projects</h2>

            <div className='projectList'>
                <CardMini />
                <CardMini />
                <CardMini />
            </div>
            <div className='hLine'></div>
            <button>View Projects</button>
        </div>
    )
}

export const CardMini = () => {
    return (
        <div className="cardMini">
            <img src="assets/img/placeholder.png" alt="projectImg" />
            <div className="hLine"></div>
            <h3>Project Name</h3>
        </div>
    );
};