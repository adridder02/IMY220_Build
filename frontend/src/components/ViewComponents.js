import React, { useState, useEffect, useContext } from "react";
import Activities from "./Activities";
import { Link } from "react-router-dom";
import { CheckInProject, EditProject } from "./ProjectForms";
import { UserContext } from "../Session";

export const ViewActivity = ({ project, activities = [] }) => {
  const { user } = useContext(UserContext);
  const [activeView, setActiveView] = useState('mem');
  const [projectMembers, setProjectMembers] = useState(project.members || []);

  if (!user) return <p>Please log in to view this project.</p>;

  const toggleLeft = () => {
    setActiveView(prev => (prev === "mem" ? "hist" : "mem"));
  };

  const activitiesWithUserId = activities.map(act => ({
    ...act,
    userId: act.user?._id || act.email || act.userId,
    user: act.user?.name || act.user || 'Unknown User'
  }));

  return (
    <>
      <div className='bar'>
        <button className="memView" onClick={toggleLeft}>
          {activeView === "mem" ? "View History" : "View Members"}
        </button>
        <button className="graphView">Graph View</button>
      </div>

      <div className='leftSect'>
        {activeView === 'mem' && (
          <ViewMembers
            project={project}
            members={projectMembers}
            setMembers={setProjectMembers}
            profileId={user.id}
            currentUserId={user.id}
            id={project._id}
          />
        )}
        {activeView === 'hist' && (
          <ViewVersionHistory versionHistory={project.versionHistory} />
        )}
      </div>

      <div className='rightSect'>
        <h3 className="heading3">Project Activity</h3>
        <div className="viewActivity">
          <Activities activities={activitiesWithUserId} forProject={true} />
        </div>
      </div>
    </>
  );
};

export const ViewMembers = ({ members = [], setMembers, profileId, currentUserId, project, id }) => {
  const [memberInput, setMemberInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [avatarMap, setAvatarMap] = useState({});

  const canEdit = profileId === currentUserId;

  useEffect(() => {
    if (!canEdit || !currentUserId) return;

    setLoading(true);
    fetch(`/api/users/${currentUserId}/friends`)
      .then(res => res.json())
      .then(data => setFriends(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUserId, canEdit]);

  useEffect(() => {
    const loadAvatars = async () => {
      const map = {};
      for (const member of members) {
        const userId = member.id || member._id;
        if (!userId) continue;
        try {
          const res = await fetch(`/api/users/${userId}`);
          const data = await res.json();
          map[userId] = data.avatar || "/assets/img/placeholder.png";
        } catch {
          map[userId] = "/assets/img/placeholder.png";
        }
      }
      setAvatarMap(map);
    };
    if (members.length > 0) loadAvatars();
  }, [members]);

  const handleInputChange = (e) => {
    if (!canEdit) return;

    const value = e.target.value;
    setMemberInput(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const filtered = (friends || []).filter(
      f =>
        !members.some(m => m.id === f.id) &&
        (`${f.firstName} ${f.lastName}`.toLowerCase().includes(value.toLowerCase()) ||
          f.email.toLowerCase().includes(value.toLowerCase()))
    );

    setSuggestions(filtered);
  };

  const handleAddMember = async (friend) => {
    if (!id) {
      console.error("Project ID missing");
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: friend.email }),
      });
      if (!res.ok) throw new Error("Failed to add member");

      const data = await res.json();
      setMembers(data.project.members);
      setMemberInput("");
      setSuggestions([]);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="viewMembers">
      <h3 className="heading3">Member List</h3>

      {canEdit && (
        <div className="memberInput">
          <input
            type="text"
            placeholder="Add Members"
            value={memberInput}
            onChange={handleInputChange}
          />
        </div>
      )}

      {loading && <p>Loading suggestions...</p>}

      {!loading && suggestions.length > 0 && canEdit && (
        <ul className="suggestionsList">
          {suggestions.map(s => (
            <li key={s.id} className="suggestionItem">
              <span className="suggestionText">
                {s.firstName} {s.lastName} ({s.email})
              </span>
              <button onClick={() => handleAddMember(s)}>Add</button>
            </li>
          ))}
        </ul>
      )}

      {members.map((member, idx) => {
        const userId = member.id || member._id;
        const avatar = avatarMap[userId] || "/assets/img/placeholder.png";
        return (
          <div className="member" key={userId ?? member.email ?? idx}>
            <img
              src={avatar}
              alt="userPfp"
              className="avatar"
            />
            <div className="userInfo">
              <p>{member.name || `${member.firstName} ${member.lastName}`}</p>
              <div className="hLine"></div>
              <p>{member.email}</p>
            </div>
            <div className="vLine"></div>
            <button>
              <Link to={`/profile/${userId}`}>View</Link>
            </button>
          </div>
        );
      })}

      {members.length === 0 && <p>No members found</p>}
    </div>
  );
};

export const ViewProject = ({ project, userEmail, onProjectUpdated }) => {
  const [activeView, setActiveView] = useState("file");
  const [currentProject, setCurrentProject] = useState({
    ...project,
    _id: project._id?.toString(),
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [loadingFile, setLoadingFile] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");

  const isOwnerOrMember =
    project.owner?.email === userEmail ||
    project.members?.some((m) => m.email === userEmail);
  const isOwner = project.owner?.email === userEmail;

  let checkButtonLabel;
  let checkButtonDisabled = false;

  if (currentProject.checkedOutBy) {
    if (currentProject.checkedOutBy.email === userEmail) {
      checkButtonLabel = "Check In";
    } else {
      checkButtonLabel = `Checked Out by ${currentProject.checkedOutBy.name}`;
      checkButtonDisabled = true;
    }
  } else {
    checkButtonLabel = "Check Out";
  }

  const handleCheckClick = async () => {
    if (!isOwnerOrMember) return;
    if (!currentProject.checkedOutBy) {
      try {
        const res = await fetch(`/api/projects/${currentProject._id}/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to check out");
        setCurrentProject(data.project);
        onProjectUpdated?.(data.project);
      } catch (err) {
        alert(err.message);
      }
    } else if (currentProject.checkedOutBy.email === userEmail) {
      setActiveView("checkin");
    }
  };

  const refreshProject = async () => {
    try {
      const res = await fetch(`/api/projects/${currentProject._id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to refresh project");
      setCurrentProject(data);
      onProjectUpdated?.(data);
    } catch (err) {
      console.error("Failed to refresh project:", err);
    }
  };

  const handleDownload = () => {
    window.open(`/api/projects/download-multiple/${currentProject._id}`, "_blank");
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }
    try {
      const res = await fetch(`/api/projects/${currentProject._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, comment: commentInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add comment");

      await refreshProject();
      setCommentInput("");
      setCommentError("");
    } catch (err) {
      setCommentError(err.message);
    }
  };


  const handleFileClick = async (fileObj) => {
    setSelectedFile(fileObj);
    setLoadingFile(true);
    setFileContent("");

    try {
      const fileId = fileObj.path.split("/").pop();
      const res = await fetch(`/api/files/content/${fileId}`, {
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text.includes("<!DOCTYPE") ? "Not logged in" : text);
      }

      const data = await res.json();
      setFileContent(data.content);
    } catch (err) {
      setFileContent(`Error: ${err.message}`);
    } finally {
      setLoadingFile(false);
    }
  };

  return (
    <>
      <div className="bar">
        <h2>{currentProject.name}</h2>
        <div className="barButtons">
          <button
            className="checkIn accent"
            onClick={handleCheckClick}
            disabled={checkButtonDisabled || !isOwnerOrMember}
            style={{
              opacity: checkButtonDisabled || !isOwnerOrMember ? 0.5 : 1,
              cursor: checkButtonDisabled || !isOwnerOrMember ? "not-allowed" : "pointer",
            }}
          >
            {checkButtonLabel}
          </button>
          <button onClick={handleDownload}>Download All</button>
          <button onClick={() => setActiveView("chat")}>Chat</button>
          {isOwner && (
            <button className="editButton" onClick={() => setActiveView("edit")}>
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="leftSect">
        <h3 className="heading3">Files</h3>
        <div className="fileButtons">
          {currentProject.files?.map((file, idx) => (
            <button
              key={idx}
              className={selectedFile?.name === file.name ? "active" : ""}
              onClick={() => handleFileClick(file)}
            >
              {file.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rightSect">
        {activeView === "checkin" && (
          <CheckInProject
            projectId={currentProject._id}
            userEmail={userEmail}
            onCheckIn={(updatedProject) => {
              setCurrentProject(updatedProject);
              onProjectUpdated?.(updatedProject);
              setActiveView("file");
            }}
            onClose={() => setActiveView("file")}
          />
        )}

        {activeView === "edit" && (
          <EditProject
            projectId={currentProject._id}
            onClose={() => setActiveView("file")}
            onProjectUpdate={(updatedProject) => {
              setCurrentProject(updatedProject);
              onProjectUpdated?.(updatedProject);
              setActiveView("file");
            }}
          />
        )}

        {activeView === "chat" && (
          <div className="chatPanel">
            <h3 className="heading3">Project Chat</h3>
            <form onSubmit={handleCommentSubmit}>
              <div className="commentInput">
                <textarea
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
                <button type="submit" disabled={!isOwnerOrMember}>
                  Send
                </button>
              </div>
              {commentError && <p style={{ color: "red" }}>{commentError}</p>}
            </form>

            <div className="commentList">
              {currentProject.activities
                ?.filter((a) => a.actionType === "comment")
                .map((activity) => (
                  <div key={activity.id} className="comment">
                    <p>
                      <strong>{activity.user}</strong> ({activity.email}) at{" "}
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                    <p>{activity.description.split(": ")[1] || activity.description}</p>
                  </div>
                ))}
            </div>

            <button onClick={() => setActiveView("file")}>Close</button>
          </div>
        )}

        {activeView === "file" && (
          <div className="fileDisplay">
            {currentProject.files && currentProject.files.length > 0 ? (
              <>
                <h4>{currentProject.files[0].name}</h4>
                {loadingFile ? (
                  <p>Loading...</p>
                ) : (
                  <pre className="codeBlock">{fileContent}</pre>
                )}
              </>
            ) : (
              <p>No files available.</p>
            )}
          </div>

        )}
      </div>
    </>
  );
};

export const ViewVersionHistory = ({ versionHistory }) => {
  const hasHistory = versionHistory && versionHistory.length > 0;

  return (
    <div>
      <h3 className="heading3">Version History</h3>
      <div className="versionHistory">
        {hasHistory ? (
          <table>
            <thead>
              <tr>
                <th>Version</th>
                <th>Date</th>
                <th>Modified By</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {versionHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.version}</td>
                  <td>{entry.date}</td>
                  <td>{entry.modifiedBy}</td>
                  <td><button>&#8617;</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No current version history</p>
        )}
      </div>
    </div>
  );
};
