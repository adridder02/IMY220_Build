import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer>
            <div id="footer-list">
                <div>
                    <h3>Repositories</h3>
                    <ul>
                        <li>
                            <Link to="/under_construction">Explore Repositories</Link>
                        </li>
                        <li>
                            <Link to="/under_construction">Public Projects</Link>
                        </li>
                        <li>
                            <Link to="/under_construction">Open Source</Link>
                        </li>
                        <li>
                            <Link to="/under_construction">Trending</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3>About Us</h3>
                    <ul>
                        <li>
                            <Link to="/under_construction">Our Mission</Link>
                        </li>
                        <li>
                            <Link to="/under_construction">Community</Link>
                        </li>
                        <li>
                            <Link to="/under_construction">Contact</Link>
                        </li>
                        <li>
                            <Link to="/under_construction">Careers</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3>Resources</h3>
                    <ul>
                        <li>
                            <Link to="/under_construction">Documentation</Link>
                        </li>
                        <li>
                            <Link to="/under_construction">Tutorials</Link>
                        </li>
                        <li>
                            <Link to="/under_construction">Support</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3>Account</h3>
                    <ul>
                        <li>
                            <Link to="/under_construction">Profile</Link>
                        </li>
                        <li>
                            <Link to="/under_construction">Settings</Link>
                        </li>
                        <li>
                            <Link to="/under_construction">Billing</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="footer-bottom">
                <div>
                    <Link to="/under_construction">Build 2025</Link>
                    <Link to="/under_construction">Terms of Service</Link>
                    <Link to="/under_construction">Privacy</Link>
                    <Link to="/under_construction">Manage Cookies</Link>
                </div>
                <div>
                    <Link to="/youtube"><img src="assets/img/youtube.svg" alt="YouTube" /></Link>
                    <Link to="/facebook"><img src="assets/img/facebook.svg" alt="Facebook" /></Link>
                    <Link to="/instagram"><img src="assets/img/instagram.svg" alt="Instagram" /></Link>
                    <Link to="/linkedin"><img src="assets/img/linkedin.svg" alt="LinkedIn" /></Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;