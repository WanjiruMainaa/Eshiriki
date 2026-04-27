import React, { useState } from 'react';
import { registerUser } from './api';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await registerUser(username, email, password, fullName, role, department);
      setSuccess('Registration successful! Please log in.');
      setError('');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setRole('');
      setDepartment('');
      onRegister();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Create your account</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}
          <div className="form-group">
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Full Name (optional)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              id="role"
              name="role"
              type="text"
              placeholder="Role (optional)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              id="department"
              name="department"
              type="text"
              placeholder="Department (optional)"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;