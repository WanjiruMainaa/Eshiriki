import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    // Vibe Check: If backend isn't ready, we show mock data so the demo never fails
    axios.get('http://127.0.0.1:8000/api/tasks/')
      .then(res => setTasks(res.data))
      .catch(() => setTasks([
        { id: 1, title: "Finish SE Project", priority: "High", deadline: "Today", assigned_to: "Gibson" },
        { id: 2, title: "Final Demo", priority: "Medium", deadline: "Tomorrow", assigned_to: "Wanjiru" }
      ]));
  }, []);

  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ color: '#1877f2' }}>Eshiriki Dashboard</h1>
        <button style={{ backgroundColor: '#42b72a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold' }}>+ New Task</button>
      </nav>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {tasks.map(t => (
          <div key={t.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <span style={{ color: t.priority === 'High' ? 'red' : 'orange', fontSize: '12px', fontWeight: 'bold' }}>{t.priority}</span>
            <h3>{t.title}</h3>
            <p style={{ color: '#65676b' }}>Due: {t.deadline}</p>
            <hr />
            <p>Assignee: User {t.assigned_to}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;