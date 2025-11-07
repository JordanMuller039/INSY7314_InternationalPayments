import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    idNumber: '',
    accountNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user || user.role !== 'admin') {
    // If not an admin, redirect to main dashboard
    navigate('/dashboard');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await authAPI.registerEmployee(form);
      setMessage('Employee created successfully');
      setForm({ firstName: '', lastName: '', email: '', password: '', idNumber: '', accountNumber: '' });
    } catch (err: unknown) {
      // Handle Axios-style error shape safely
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = err as any;
      setError(e?.response?.data?.error || e?.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="admin-sub">Create employees (admin-only)</p>
      </header>

      <main className="admin-main">
        <section className="create-employee card-blue">
          <h2>Create Employee</h2>

          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="create-form">
            <div className="row">
              <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
              <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
            </div>
            <div className="row">
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              <input name="password" type="password" placeholder="Temporary password" value={form.password} onChange={handleChange} required />
            </div>
            <div className="row">
              <input name="idNumber" placeholder="ID number" value={form.idNumber} onChange={handleChange} required />
              <input name="accountNumber" placeholder="Account number" value={form.accountNumber} onChange={handleChange} required />
            </div>

            <div className="actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Employee'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
