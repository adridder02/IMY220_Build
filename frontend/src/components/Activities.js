import React, { useEffect, useState } from 'react';

const avatarCache = new Map();

const fetchAvatar = async (userId) => {
  if (!userId) return "/assets/img/placeholder.png";

  // check cache first
  if (avatarCache.has(userId)) return avatarCache.get(userId);

  // check localStorage
  const cached = localStorage.getItem(`avatar_${userId}`);
  if (cached) {
    const { url, timestamp } = JSON.parse(cached);
    // expire after 7 days
    if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
      avatarCache.set(userId, url);
      return url;
    }
  }

  // fetch from server
  let url = "/assets/img/placeholder.png"; 
  try {
    let res, data;

    if (userId.includes('@')) {
      res = await fetch(`/api/users/user?email=${encodeURIComponent(userId)}`);
    } else {
      res = await fetch(`/api/users/${userId}`);
    }

    if (res.ok) {
      data = await res.json();
      url = data.avatar || url;
    } else if (res.status === 404) {
      // user deleted, keep fallback
      console.warn(`User not found: ${userId}`);
    } else {
      throw new Error(`Failed to fetch avatar: ${res.status}`);
    }

    // cache in memory + localStorage
    avatarCache.set(userId, url);
    localStorage.setItem(`avatar_${userId}`, JSON.stringify({
      url,
      timestamp: Date.now()
    }));

    return url;
  } catch (err) {
    console.error("Avatar fetch failed:", err);
    avatarCache.set(userId, url);
    return url;
  }
};


export const ActivityType1 = ({ avatarUrl, user, action, projectName, timestamp }) => {
  return (
    <div className="ActivityType1">
      <img src={avatarUrl} alt="userPfp" className="avatar" />
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

const ActivityType1WithAvatar = ({ userId, ...props }) => {
  const [avatarUrl, setAvatarUrl] = useState("/assets/img/placeholder.png");
  useEffect(() => {
    let mounted = true;
    fetchAvatar(userId).then(url => { if (mounted) setAvatarUrl(url); });
    return () => { mounted = false; };
  }, [userId]);
  return <ActivityType1 avatarUrl={avatarUrl} {...props} />;
};

const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
};

export const ActivityType2 = ({
  userId,
  user,
  action,
  projectName,
  timestamp,
  description,
  cardTitle,
  cardDescription,
  projectImage
}) => {
  return (
    <div className="ActivityType2">
      <div className="left">
        <ActivityType1WithAvatar
          userId={userId}
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
          <img
            src={projectImage || "/assets/img/placeholder.png"}
            alt={cardTitle || "project"}
          />
          <div className="hLine"></div>
          <h3>{cardTitle || 'No Title'}</h3>
          <p>{truncateText(cardDescription, 50) || 'No description'}</p>
        </div>
      </div>
    </div>
  );
};

export const ActivityType3 = ({
  userId,
  user,
  action,
  projectName,
  timestamp,
  description
}) => {
  return (
    <div className="ActivityType3">
      <div className="left">
        <ActivityType1WithAvatar
          userId={userId}
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
          userId: activity.userId,
          user: activity.user,
          action: activity.action,
          projectName: activity.projectName,
          timestamp: activity.timestamp
            ? new Date(activity.timestamp).toLocaleString()
            : 'No Date',
          description: activity.description,
          cardTitle: activity.projectName,
          cardDescription: activity.projectDescription,
          projectImage: activity.projectImage || "/assets/img/placeholder.png"
        };

        if (activity.actionType === "checkout") {
          return <ActivityType1WithAvatar key={activity.id} userId={activity.userId} {...props} />;
        } else {
          return forProject ? (
            <ActivityType3 key={activity.id} {...props} />
          ) : (
            <ActivityType2 key={activity.id} {...props} />
          );
        }
      })}
    </div>
  );
};

export default Activities;