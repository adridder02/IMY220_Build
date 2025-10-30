import React, { useState, useEffect, useContext } from 'react';
import './css/view.css';
import { useParams } from 'react-router-dom';
import { ViewActivity, ViewProject } from '../components/ViewComponents';
import { UserContext } from '../Session';

const ProjectViewPage = () => {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const [activeView, setActiveView] = useState("Proj");
    const [project, setProject] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = 'Build - Projects';
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${id}`);
                if (!response.ok) throw new Error("Project not found");
                const data = await response.json();
                setProject({ ...data, _id: data._id.toString() });
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    useEffect(() => {
        if (!project) return;
        const fetchActivities = async () => {
            try {
                const params = new URLSearchParams({ project: project.name, sort: "date-desc" });
                const response = await fetch(`/api/activities?${params}`);
                if (!response.ok) throw new Error("Failed to fetch activities");
                const data = await response.json();
                const activitiesWithId = data.map((a) => ({ ...a, id: a._id?.toString() || a.id }));
                setActivities(activitiesWithId);
                setProject((prev) => ({ ...prev, activities: activitiesWithId }));
            } catch (err) {
                console.error(err);
                setActivities([]);
            }
        };
        fetchActivities();
    }, [project?.name]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!project) return <div>Project not found</div>;

    const handleButtonClick = (view) => setActiveView(view);

    return (
        <div className="view-container" id={activeView === "Proj" ? "project-view" : "activity-view"}>
            <div className="menu">
                <h3 className="heading3">Menu</h3>
                <button className={activeView === "Proj" ? "active" : ""} onClick={() => handleButtonClick("Proj")}>
                    <img src="/assets/icons/project.svg" alt="Project Icon" className='icon'/>
                </button>
                <button className={activeView === "Actv" ? "active" : ""} onClick={() => handleButtonClick("Actv")}>
                    <img src="/assets/icons/activity.svg" alt="Activity Icon" className='icon'/>
                </button>
                <div className="hLine"></div>
                <button onClick={() => window.history.back()}>Back</button>
            </div>

            {activeView === "Proj" && <ViewProject project={project} userEmail={user?.email} />}
            {activeView === "Actv" && <ViewActivity project={project} activities={activities} id={project._id} />}
        </div>
    );
};

export default ProjectViewPage;
