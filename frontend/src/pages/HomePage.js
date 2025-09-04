import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../Session';
import Activities from '../components/Activities';
import { Search, Sort } from '../components/GeneralComps';
import "./css/projects.css"
import "./css/home.css"

const HomePage = () => {
    const { user } = useContext(UserContext);
    const [activities, setActivities] = useState([]);
    const [scope, setScope] = useState('local');
    const [projectFilter, setProjectFilter] = useState('');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('date-desc');
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            // * fetch projects for filter buttons
            try {
                const projectUrl = scope === 'local'
                    ? `/api/projects?scope=my&email=${user.email}`
                    : `/api/projects`;
                const projectResponse = await fetch(projectUrl);
                if (!projectResponse.ok) throw new Error('Failed to fetch projects');
                const projectData = await projectResponse.json();
                setProjects(projectData || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects([]);
            }

            // * fetch activities
            const params = new URLSearchParams({ scope, sort });
            if (scope === 'local') params.append('email', user.email);
            if (projectFilter) params.append('project', projectFilter);
            if (search) params.append('search', search);
            try {
                const response = await fetch(`/api/activities?${params}`);
                if (!response.ok) throw new Error('Failed to fetch activities');
                const data = await response.json();
                setActivities(data || []);
            } catch (error) {
                console.error('Error fetching activities:', error);
                setActivities([]);
            }
        };
        fetchData();
    }, [scope, projectFilter, search, sort, user]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <header>
                <img src="/assets/img/BuildLogo.svg" alt="Build Icon" />
                <div className="vLine"></div>
                <div>
                    <h1>Welcome,</h1>
                    <h1 className="accent">{user.name}</h1>
                </div>
            </header>
            <section className="grid-container">
                <h2 className="heading1">Activity Feed</h2>
                <div className="buttons">
                    <button
                        className={scope === 'local' ? 'selected' : ''}
                        onClick={() => setScope('local')}
                    >
                        Local
                    </button>
                    <button
                        className={scope === 'global' ? 'selected' : ''}
                        onClick={() => setScope('global')}
                    >
                        Global
                    </button>
                </div>
                <div className="filter">
                    <div id="filterSearch">
                        <Search value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="hLine"></div>
                    <Sort value={sort} onChange={(e) => setSort(e.target.value)} />
                    <div className="hLine"></div>
                    <div className="filterProject">
                        <h3>Projects</h3>
                        <button
                            className={projectFilter === '' ? 'selected' : ''}
                            onClick={() => setProjectFilter('')}
                        >
                            All Projects
                        </button>
                        {projects.map((project) => (
                            <button
                                key={project.id}
                                className={projectFilter === project.name ? 'selected' : ''}
                                onClick={() => setProjectFilter(projectFilter === project.name ? '' : project.name)}
                            >
                                {project.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="activity">
                    <Activities activities={activities} />
                </div>
            </section>
        </>
    );
};

export default HomePage;