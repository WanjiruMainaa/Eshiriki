import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Register from './Register';

// Set up axios defaults for authentication
axios.defaults.baseURL = 'http://127.0.0.1:8000';

// Add token to requests if available
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      // You could decode the token to get user info, but for simplicity we'll just set authenticated
      setUser({ username: 'User' }); // In a real app, decode JWT to get username
    }
  }, []);

  // Fetch tasks when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/api/tasks/')
        .then(res => setTasks(res.data))
        .catch(() => setTasks([
          { id: 1, title: "Finish SE Project", priority: "High", deadline: "Today", assigned_to: "Gibson" },
          { id: 2, title: "Final Demo", priority: "Medium", deadline: "Tomorrow", assigned_to: "Wanjiru" }
        ]));
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    setUser({ username: 'User' }); // In a real app, get from token
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setCurrentView('login');
    setUser(null);
    setShowDropdown(false);
  };

  const handleRegister = () => {
    setCurrentView('login'); // After registration, go to login
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
              cursor: 'pointer'
            }}
          >
            Don't have an account? Register here
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Navbar with Profile */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Eshiriki Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="btn-secondary">+ New Task</button>
            <div className="profile-dropdown">
              <button
                className="profile-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span style={{ marginRight: '5px' }}>{user?.username}</span>
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

      {/* Dashboard Content */}
      <div className="dashboard">
        <div className="task-grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <span className={`task-priority ${task.priority === 'High' ? 'priority-high' : 'priority-medium'}`}>
                {task.priority}
              </span>
              <h3 className="task-title">{task.title}</h3>
              <p className="task-deadline">Due: {task.deadline}</p>
              <p className="task-assignee">Assignee: {task.assigned_to}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;