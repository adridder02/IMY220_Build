import React, { useState, useEffect } from 'react';
import './css/view.css';
import { useParams } from 'react-router-dom';
import { ViewActivity, ViewProject } from '../components/ViewComponents';

const ProjectViewPage = () => {
    const { id } = useParams();
    const [activeView, setActiveView] = useState('Proj');
    const [project, setProject] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch project data
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch('/api/projects');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                const proj = data.find(p => p.id === parseInt(id));
                if (!proj) throw new Error('Project not found');
                setProject(proj);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };
        fetchProject();
    }, [id]);

    // Fetch activities for this project
    useEffect(() => {
        if (!project) return;

        const fetchActivities = async () => {
            try {
                const params = new URLSearchParams({ project: project.name, sort: 'date-desc' });
                const response = await fetch(`/api/activities?${params}`);
                if (!response.ok) throw new Error('Failed to fetch activities');
                const data = await response.json();
                setActivities(data);
            } catch (err) {
                console.error(err);
                setActivities([]);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, [project]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>Project not found</div>;

    const handleButtonClick = (view) => setActiveView(view);

    return (
        <div className='view-container' id={activeView === 'Proj' ? 'project-view' : 'activity-view'}>
            <div className='menu'>
                <h3 className="heading3">Menu</h3>
                <button
                    className={activeView === 'Proj' ? 'active' : ''}
                    onClick={() => handleButtonClick('Proj')}
                >
                    Proj
                </button>
                <button
                    className={activeView === 'Actv' ? 'active' : ''}
                    onClick={() => handleButtonClick('Actv')}
                >
                    Actv
                </button>
                <div className='hLine'></div>
                <button onClick={() => window.history.back()}>Back</button>
            </div>

            {activeView === 'Proj' && <ViewProject project={project} />}
            {activeView === 'Actv' && <ViewActivity project={project} activities={activities} />}
        </div>
    );
};

export default ProjectViewPage;
