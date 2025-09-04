import React from 'react';
import { Link } from 'react-router-dom';
import { ActivityType1, ActivityType2, ActivityType3 } from '../components/Activities';
import { Sort } from '../components/GeneralComps';


const HomePage = () => {
    return (
        <>
            <link rel="stylesheet" href="css/main.css" />
            <link rel="stylesheet" href="css/projects.css" />
            <link rel="stylesheet" href="css/home.css" />
            <header>
                <img src="assets/img/BuildLogo.svg" alt="Build Icon" />
                <div className="vLine"></div>
                <div>
                    <h1>Welcome,</h1>
                    <h1 className="accent">Name</h1>
                </div>
            </header>
            <section className="grid-container">
                <h2 className="heading1">Activity Feed</h2>
                <div className="buttons">
                    <button className="selected">Local</button>
                    <button>Global</button>
                </div>
                <div className="filter">
                    <div id="filterSearch">
                        <input type="text" placeholder="Search for..." />
                    </div>
                    <div className="hLine"></div>
                    <Sort />
                    <div className="hLine"></div>
                    <div className="filterProject">
                        <h3>Projects</h3>
                        <button>Project1</button>
                        <button>Project2</button>
                        <button className="selected">Project3</button>
                        <button>Project4</button>
                    </div>
                </div>
                <div className="activity">
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
                    <ActivityType2
                        user="USER"
                        action="checked in a project"
                        projectName="NAME"
                        timestamp="07/23/2025 8:30AM"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
                        cardTitle="Project Name"
                        cardDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
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
            </section>
        </>
    );
};

export default HomePage;