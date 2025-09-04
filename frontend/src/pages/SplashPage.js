import React from 'react';
import { Link } from 'react-router-dom';

const SplashPage = () => {
    return (
        <>
            <link rel="stylesheet" href="css/main.css" />
            <link rel="stylesheet" href="css/splash.css" />
            <header></header>
            <section id="welcome">
                <div>
                    <h1>Welcome to <span className="accent">Build</span></h1>
                    <p>The platform where coders connect, collaborate and create. Share your projects, version your code and grow with a vibrant community of developers.</p>
                </div>
                <div className="vLine"></div>
                <img src="/assets/img/BuildIcon.svg" alt="Build Icon" />
            </section>
            <div className="hLine"></div>
            <section id="offer">
                <h1>What We <span className="accent">Offer</span></h1>
                <div>
                    <h3>Collaborate Seamlessly</h3>
                    <p>Create and manage projects with friends or global contributors.</p>
                </div>
                <div>
                    <h3>Showcase Your Work</h3>
                    <p>Share your projects, track activity, and discover trending code.</p>
                </div>
                <div>
                    <h3>Connect and Grow</h3>
                    <p>Add friends, explore profiles, and build your coding network.</p>
                </div>
            </section>
            <div className="hLine"></div>
            <section id="get-started">
                <h1>Get <span className="accent">Started</span></h1>
                <p>Join <span className="accent">Build</span> today! Register with your email to start coding, collaborating, and building the future. Already a member? <Link to="/under_construction">Log in</Link> to dive into your projects.</p>
                <Link to="/register" id="call">Sign Up Free ➔</Link>
            </section>
        </>
    );
};

export default SplashPage;