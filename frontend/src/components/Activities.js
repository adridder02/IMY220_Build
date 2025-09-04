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

const Activities = ({ activities }) => {
  return (
    <div className="activities">
      {activities.map((activity) => {
        if (!activity) {
          console.warn('Invalid activity: empty', activity);
          return null;
        }
        // handle  structure: { id, type, user: string, email, action, projectName, timestamp, description }
        // this is to stop the console screaming because of the sub props and empty things etc
        const props = {
          user: activity.user || 'Unknown User',
          action: activity.action || 'Unknown Action',
          projectName: activity.projectName || 'Unknown Project',
          timestamp: activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'No Date',
          description: activity.description || '',
          cardTitle: activity.projectName || 'No Title',
          cardDescription: activity.description || 'No description',
        };

        switch (activity.type) {
          case 'ActivityType1':
            return <ActivityType1 key={activity.id} {...props} />;
          case 'ActivityType2':
            return <ActivityType2 key={activity.id} {...props} />;
          case 'ActivityType3':
            return <ActivityType3 key={activity.id} {...props} />;
          default:
            console.warn('Unknown activity type:', activity.type, activity);
            return null;
        }
      })}
    </div>
  );
};

export default Activities;