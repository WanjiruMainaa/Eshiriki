import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import {
  getTasks,
  createTask,
  deleteTask,
  getTeams,
  getComments,
  postComment,
} from './api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('login');
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    deadline: '',
    team: '',
  });
  const [commentsByTask, setCommentsByTask] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      setUser({ username: 'User' });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
      loadTeams();
    }
  }, [isAuthenticated]);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (error) {
      setTasks([]);
    }
  };

  const loadTeams = async () => {
    try {
      const res = await getTeams();
      setTeams(res.data);
      if (res.data.length && !newTask.team) {
        setNewTask((prev) => ({ ...prev, team: res.data[0].id }));
      }
    } catch (error) {
      setTeams([]);
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.filter((task) => !task.completed).length,
  };

  const progress = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    setUser({ username: 'User' });
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setCurrentView('login');
    setUser(null);
    setShowDropdown(false);
    setTasks([]);
    setCommentsByTask({});
    setOpenComments({});
  };

  const handleRegister = () => {
    setCurrentView('login');
  };

  const toggleComments = async (taskId) => {
    const currentlyOpen = !!openComments[taskId];
    setOpenComments((prev) => ({ ...prev, [taskId]: !currentlyOpen }));

    if (!currentlyOpen && !commentsByTask[taskId]) {
      try {
        const res = await getComments(taskId);
        setCommentsByTask((prev) => ({ ...prev, [taskId]: res.data }));
      } catch (error) {
        setCommentsByTask((prev) => ({ ...prev, [taskId]: [] }));
      }
    }
  };

  const handleCommentChange = (taskId, value) => {
    setCommentInputs((prev) => ({ ...prev, [taskId]: value }));
  };

  const handlePostComment = async (taskId) => {
    const text = (commentInputs[taskId] || '').trim();
    if (!text) return;

    try {
      await postComment(taskId, text);
      const res = await getComments(taskId);
      setCommentsByTask((prev) => ({ ...prev, [taskId]: res.data }));
      setCommentInputs((prev) => ({ ...prev, [taskId]: '' }));
    } catch (error) {
      setErrorMessage('Unable to post comment.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline || !newTask.team) {
      setErrorMessage('Title, deadline, and team are required.');
      return;
    }

    try {
      await createTask(newTask);
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'Medium',
        deadline: '',
        team: teams[0]?.id || '',
      });
      setErrorMessage('');
      loadTasks();
    } catch (error) {
      setErrorMessage('Unable to create task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      loadTasks();
    } catch (error) {
      setErrorMessage('Unable to delete task.');
    }
  };

  if (!isAuthenticated) {
    if (currentView === 'register') {
      return <Register onRegister={handleRegister} />;
    }

    return (
      <div>
        <Login onLogin={handleLogin} />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => setCurrentView('register')}
            style={{
              color: '#3b82f6',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Don't have an account? Register here
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Eshiriki Dashboard</h1>
          <div className="navbar-actions">
            <button className="btn-primary" onClick={() => setShowNewTaskModal(true)}>
              + New Task
            </button>
            <div className="profile-dropdown">
              <button className="profile-btn" onClick={() => setShowDropdown(!showDropdown)}>
                <span>{user?.username}</span>
                <span>▼</span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        <section className="stats-panel">
          <div className="stats-header">
            <div>
              <h2>Project Stats</h2>
              <p>Overview of current task progress.</p>
            </div>
            <span className="stats-user">{user?.username}</span>
          </div>

          <div className="stats-cards">
            <div className="stat-card">
              <span>Total Tasks</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="stat-card">
              <span>Completed</span>
              <strong>{stats.completed}</strong>
            </div>
            <div className="stat-card">
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
          </div>

          <div className="progress-row">
            <span>Completion</span>
            <div className="progress-bar-outer">
              <div className="progress-bar-inner" style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}%</span>
          </div>
        </section>

        <section className="task-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-card-header">
                <h3>{task.title}</h3>
                <button className="btn-delete" onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </div>
              <span className={`task-priority ${task.priority === 'High' ? 'priority-high' : task.priority === 'Low' ? 'priority-low' : 'priority-medium'}`}>
                {task.priority}
              </span>
              <p className="task-description">{task.description || 'No description yet.'}</p>
              <div className="task-meta">Due: {task.deadline}</div>
              <div className="task-meta">Team: {task.team_name || task.team}</div>
              <div className="task-meta">Assigned to: {task.assigned_to || user?.username}</div>

              <button className="btn-secondary small" onClick={() => toggleComments(task.id)}>
                {openComments[task.id] ? 'Hide Comments' : 'Show Comments'}
              </button>

              {openComments[task.id] && (
                <div className="comments-section">
                  <div className="comments-list">
                    {(commentsByTask[task.id] || []).length ? (
                      commentsByTask[task.id].map((comment) => (
                        <div key={comment.id} className="comment-row">
                          <strong>{comment.user}</strong>
                          <p>{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="comment-empty">No comments yet.</div>
                    )}
                  </div>
                  <div className="comment-form">
                    <input
                      type="text"
                      value={commentInputs[task.id] || ''}
                      onChange={(e) => handleCommentChange(task.id, e.target.value)}
                      placeholder="Add a comment..."
                    />
                    <button className="btn-primary small" type="button" onClick={() => handlePostComment(task.id)}>
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      </div>

      {showNewTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>New Task</h2>
              <button className="close-button" onClick={() => setShowNewTaskModal(false)}>
                ×
              </button>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleCreateTask} className="new-task-form">
              <label>
                Title
                <input
                  value={newTask.title}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                />
              </label>
              <label>
                Deadline
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, deadline: e.target.value }))}
                  required
                />
              </label>
              <label>
                Priority
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </label>
              <label>
                Team
                <select
                  value={newTask.team}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, team: e.target.value }))}
                  required
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Create Task
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowNewTaskModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;