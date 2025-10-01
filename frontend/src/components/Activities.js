import React from 'react';

export const ActivityType1 = ({ user, action, projectName, timestamp }) => {
  return (
    <div className="ActivityType1">
      <img src="/assets/img/placeholder.png" alt="userPfp" className="avatar" />
      <div className="text">
        <div className="title">
          <p>{user || 'Unknown User'}</p>
          <p>{action || 'Unknown Action'}</p>
          <p>{projectName || 'Unknown Project'}</p>
        </div>
        <p>{timestamp || 'No Date'}</p>
      </div>
    </div>
  );
};

export const ActivityType2 = ({ user, action, projectName, timestamp, description, cardTitle, cardDescription }) => {
  return (
    <div className="ActivityType2">
      <div className="left">
        <ActivityType1
          user={user}
          action={action}
          projectName={projectName}
          timestamp={timestamp}
        />
        <div className="info">
          <div className="hLine"></div>
          <p>{description || 'No description'}</p>
        </div>
      </div>
      <div className="vLine"></div>
      <div className="right">
        <div className="cardMini">
          <img src="/assets/img/placeholder.png" alt="projectImg" />
          <div className="hLine"></div>
          <h3>{cardTitle || 'No Title'}</h3>
          <p>{cardDescription || 'No description'}</p>
        </div>
      </div>
    </div>
  );
};

export const ActivityType3 = ({ user, action, projectName, timestamp, description }) => {
  return (
    <div className="ActivityType3">
      <div className="left">
        <ActivityType1
          user={user}
          action={action}
          projectName={projectName}
          timestamp={timestamp}
        />
        <div className="info">
          <div className="hLine"></div>
          <p>{description || 'No description'}</p>
        </div>
      </div>
    </div>
  );
};

const Activities = ({ activities, forProject = false }) => {
  return (
    <div className="activities">
      {activities.map((activity) => {
        const props = {
          user: activity.user,
          action: activity.action,
          projectName: activity.projectName,
          timestamp: activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'No Date',
          description: activity.description,
          cardTitle: activity.projectName,
          cardDescription: activity.description,
        };

        if (activity.actionType === "checkout") {
          return <ActivityType1 key={activity.id} {...props} />;
        } else {
          return forProject 
            ? <ActivityType3 key={activity.id} {...props} />  // Project page
            : <ActivityType2 key={activity.id} {...props} />; // Home page
        }
      })}
    </div>
  );
};


export default Activities;